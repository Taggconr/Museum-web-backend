import { Module } from '@nestjs/common';
import { ExhibitsService } from './exhibits.service';
import { ExhibitsController } from './exhibits.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ExhibitsController],
  imports: [PrismaModule],
  providers: [ExhibitsService],
})
export class ExhibitsModule { }
