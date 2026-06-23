import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get(':login')
  async findOne(@Param('login') login: string) {
    return this.usersService.findOne(login);
  }
}
