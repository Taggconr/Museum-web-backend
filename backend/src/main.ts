import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.use(cookieParser());
    app.enableCors({
        //origin: configService.get('CORS_ORIGIN'), // адрес фронта
        origin: true,
        //origin: 'http://localhost:3000',
        credentials: true,
    });
    await app.listen(9000);
}
bootstrap();
