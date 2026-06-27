
import { Injectable } from '@nestjs/common';
import { BcryptService } from '../auth/bcrypt.service';
import { userDto } from '../dto/users.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly bcryptService: BcryptService,
    ) { }

    async findOne(login: string) {
        return this.prisma.users.findUnique({
            where: {
                login: login
            }
        });
    }

    async findAll() {
        return this.prisma.users.findMany();
    }

    async create(dto: userDto) {

        const hashedPassword = await this.bcryptService.hash(dto.password);

        return this.prisma.users.create({
            data: {
                fullname: dto.fullname,
                login: dto.login,
                password: hashedPassword,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.users.delete({ where: { id: id } })
    }


}
