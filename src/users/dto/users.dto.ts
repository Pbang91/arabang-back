import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString } from 'class-validator';

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
