import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BcryptService } from 'src/auth/bcrypt.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, BcryptService],
  imports: [PrismaModule],
  exports: [UsersService]
})
export class UsersModule { }
