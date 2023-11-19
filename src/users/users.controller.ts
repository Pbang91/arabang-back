import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
export class UsersController {
  // constructor(private readonly usersService: UsersService) {}
  // @Post()
}
