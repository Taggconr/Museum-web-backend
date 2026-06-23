
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findOne(login: string) {
        return this.prisma.users.findUnique({
            where: {
                login: login
            }
        });
    }
}
