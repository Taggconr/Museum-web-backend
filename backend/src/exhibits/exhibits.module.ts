import { Module } from '@nestjs/common';
import { ExhibitsService } from './exhibits.service';
import { ExhibitsController } from './exhibits.controller';

@Module({
  controllers: [ExhibitsController],
  providers: [ExhibitsService],
})
export class ExhibitsModule {}
