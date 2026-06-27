import { randomUUID } from 'crypto';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { put } from '@vercel/blob';
import { Image } from '@prisma/client';
import { ExhibitsDto } from 'src/dto/exhibits.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExhibitsUpdateDto } from 'src/dto/exhibits.update.dto';
import { title } from 'process';

@Injectable()
export class ExhibitsService {
    constructor(private readonly prisma: PrismaService) { }

    async findOne(id: string) {
        return this.prisma.exhibit.findUnique({
            where: { id },
            include: { images: true },
        });
    }

    async findAll() {
        return this.prisma.exhibit.findMany({ include: { images: true } });
    }

    async create(dto: ExhibitsDto, files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('Хотя бы одно изображение обязательно');
        }

        // 1. Загрузка в Blob
        const uploadPromises = files.map(async (file) => {
            const uniqueName = `${randomUUID()}-${file.originalname}`;
            const blob = await put(uniqueName, file.buffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            return blob.url;
        });

        let fileUrls: string[] = [];
        try {
            fileUrls = await Promise.all(uploadPromises);
        } catch (error) {
            console.error(' Ошибка загрузки в Blob:', error);
        }

        let exhibit;
        let attempts = 0;
        const maxAttempts = 3;
        while (attempts < maxAttempts) {
            try {
                exhibit = await this.prisma.exhibit.create({
                    data: {
                        category: dto.category,
                        title: dto.title,
                        subtitle: dto.subtitle,
                    },
                });
                break;
            } catch (error) {
                attempts++;
                if (attempts >= maxAttempts) {
                    throw new InternalServerErrorException('Не удалось создать экспонат после нескольких попыток');
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
        }

        const createdImages: Image[] = [];
        for (const url of fileUrls) {
            let success = false;
            let imgAttempts = 0;
            while (!success && imgAttempts < maxAttempts) {
                try {
                    const image = await this.prisma.image.create({
                        data: {
                            image: url,
                            exhibitId: exhibit.id,
                        },
                    });
                    createdImages.push(image);
                    success = true;
                } catch (error) {
                    imgAttempts++;
                    if (imgAttempts >= maxAttempts) {
                        await this.prisma.exhibit.delete({ where: { id: exhibit.id } })
                            .catch(e => console.error('Не удалось удалить экспонат при откате:', e));
                        throw new InternalServerErrorException(
                            `Не удалось создать изображение после ${imgAttempts} попыток. Экспонат удалён.`
                        );
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000 * imgAttempts));
                }
            }
        }

        return this.prisma.exhibit.findUnique({
            where: { id: exhibit.id },
            include: { images: true },
        });
    }

    async update(id: string, dto: ExhibitsUpdateDto) {
        return await this.prisma.exhibit.update({
            where: { id },
            data: dto,
        })
    }

    async delete(id: string) {
        return this.prisma.exhibit.delete({ where: { id } });
    }
}