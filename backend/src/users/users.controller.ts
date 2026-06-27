import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { userDto } from 'src/dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get(':login')
  async findOne(@Param('login') login: string) {
    return this.usersService.findOne(login);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: userDto) {
    return this.usersService.create(dto);
  }
}
