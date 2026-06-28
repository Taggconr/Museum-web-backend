import { Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const token = await this.authService.login(user);

    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '1d');
    const maxAgeMs = ms(accessExpiresIn as any) as unknown as number;
    // Кука для бэкенд-домена (остаётся)
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: true, // или process.env.NODE_ENV === 'production'
      sameSite: 'none',
      maxAge: maxAgeMs,
      path: '/',
    });

    // Теперь возвращаем токен и в теле ответа
    return {
      message: 'Вход выполнен успешно',
      access_token: token.access_token
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      //secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'none',
      path: '/',

    });
    return { message: 'Выход выполнен' };
  }
}