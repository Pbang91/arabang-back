import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { BaseUserDto } from './dto/users.dto';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: '신규 회원가입 API',
    description: '신규 회원가입 시 등록을 진행합니다.',
  })
  @ApiNoContentResponse()
  @HttpCode(204)
  async createUser(@Body() baseUserDto: BaseUserDto) {
    await this.usersService.createUser(baseUserDto);
  }

  // FIXME: Test를 위한 임시 API입니다. 삭제 예정.
  @ApiExcludeEndpoint(true)
  @Post('/super')
  @ApiNoContentResponse()
  @HttpCode(204)
  async createSuperUser(@Body() baseUserDto: BaseUserDto): Promise<void> {
    await this.usersService.createSuperUser(baseUserDto);
  }
}
