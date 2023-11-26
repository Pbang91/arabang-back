import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiNoContentResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { BaseUserDto, LoginUserDto } from './dto/users.dto';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: '신규 회원가입 API',
    description: '신규 회원가입 시 등록을 진행합니다.',
  })
  @ApiNoContentResponse({
    description: '유저 등록여부에 따라 아무 응답을 반환하지 않습니다.',
  })
  @HttpCode(204)
  async createUser(@Body() baseUserDto: BaseUserDto) {
    await this.usersService.createUser(baseUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인 API',
    description: 'email, kakao 로그인을 진행합니다.',
  })
  @ApiResponse({
    description: 'accessToken을 반환합니다',
    status: 200,
  })
  @HttpCode(200)
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.loginUser(loginUserDto);
  }

  // FIXME: Test를 위한 임시 API입니다. 삭제 예정.
  @ApiExcludeEndpoint(true)
  @Post('super')
  @ApiNoContentResponse()
  @HttpCode(204)
  async createSuperUser(@Body() baseUserDto: BaseUserDto): Promise<void> {
    await this.usersService.createSuperUser(baseUserDto);
  }
}
