import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ExhibitsService } from './exhibits.service';
import { ExhibitsDto } from '../dto/exhibits.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { count } from 'console';
import { Multer } from 'multer';
import { ExhibitsUpdateDto } from '../dto/exhibits.update.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('exhibits')
export class ExhibitsController {
  constructor(private readonly exhibitsService: ExhibitsService) { }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.exhibitsService.findOne(id);
  }


  @Get()
  async findAll() {
    return this.exhibitsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(@Body() dto: ExhibitsDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Необходимо загрузить хотя бы один файл');
    }
    console.log(files);
    const result = await this.exhibitsService.create(dto, files);
    return {
      result,
      message: 'Файлы успешно загружены',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Body() dto: ExhibitsUpdateDto, @Param('id') id: string) {
    return await this.exhibitsService.update(id, dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.exhibitsService.delete(id)
  }
}
