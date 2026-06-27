import { Injectable } from '@nestjs/common';
import { ExhibitsDto } from 'src/dto/exhibits.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExhibitsService {
    constructor(
        private readonly prisma: PrismaService
    ) { }


    async findOne(id: string) {
        return this.prisma.exhibit.findUnique({ where: { id: id }, include: { images: true } })
    }

    async findAll() {
        return this.prisma.exhibit.findMany({ include: { images: true } })
    }

    async create(dto: ExhibitsDto, files: Express.Multer.File[]) {
        return this.prisma.exhibit.create({ data: dto, files: files })
    }

    async update(id: string) {
        return
    }

    async delete() {
        return
    }



}
