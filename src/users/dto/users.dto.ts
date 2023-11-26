import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { USER_LOGIN } from 'src/common/constants/constant';
import { USER_LOGIN_TYPE } from 'src/common/constants/enum';

export class BaseUserDto {
  @ApiProperty({
    example: 'user1.is@user.com',
    description: '등록을 진행할 사용자 이메일',
    required: true,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'user1Password',
    description: '등록을 진행할 사용자 email',
    required: true,
  })
  @IsString()
  readonly password: string;

  @ApiProperty({
    example: false,
    description: '등록을 진행할 사용자의 레벨',
    required: false,
    default: false,
  })
  @IsBoolean()
  readonly isAdmin: boolean;
}

export class LoginUserDto extends PartialType(PickType(BaseUserDto, ['password', 'email'] as const)) {
  @ApiProperty({
    example: 'email',
    examples: Object.values(USER_LOGIN),
    description: '로그인을 진행하는 종류',
    required: true,
  })
  @IsEnum(USER_LOGIN)
  readonly type: USER_LOGIN_TYPE;
}
