import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsString, IsUrl } from 'class-validator';
import { ITEM_LINK } from 'src/common/constants/constant';

export class UpdateLinkDto {
  @ApiProperty({
    example: 'https://...',
    description: '업체 사이트 링크',
    required: false,
  })
  @IsUrl()
  readonly link?: string;

  @ApiProperty({
    example: 'self',
    description: '업체 사이트 분류',
    required: false,
  })
  @IsString()
  @IsIn(Object.values(ITEM_LINK))
  readonly type?: string;

  @ApiProperty({
    example: true,
    description: '업체 주 사이트',
    required: false,
  })
  @IsBoolean()
  readonly isMain?: boolean;
}
