import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ExhibitsService } from './exhibits.service';
import { ExhibitsDto } from 'src/dto/exhibits.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { count } from 'console';
import { Multer } from 'multer';

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

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async create(@Body() dto: ExhibitsDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Необходимо загрузить хотя бы один файл');
    }
    console.log(files);
    const result = await this.exhibitsService.create(dto);
    return {
      result,
      message: 'Файлы успешно загружены',
      count: files.length,
    };
  }
}
