import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) { }


    async validateUser(login: string, pass: string): Promise<any> {
        const user = await this.prismaService.users.findUnique({ where: { login } });
        if (!user) return null;


        const isMatch = user.password.startsWith('$2b$')
            ? await bcrypt.compare(pass, user.password)
            : user.password === pass;

        if (!isMatch) return null;

        const { password, ...result } = user;
        return result;
    }

    // Генерация JWT
    async login(user: any) {
        const payload = { login: user.login, sub: user.id };
        return { access_token: this.jwtService.sign(payload) };
    }
}