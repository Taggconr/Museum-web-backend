import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
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
        const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '1d');
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: expiresIn as any }),
        };
    }
}