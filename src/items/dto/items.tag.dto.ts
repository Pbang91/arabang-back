import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { ITEM_TAG } from 'src/common/constants/constant';
import { ITEM_TAG_TYPE } from 'src/common/constants/enum';

export class CreateTagDto {
  @ApiProperty({
    example: 'luv',
    examples: Object.values(ITEM_TAG),
    description: '태그 분류',
    required: true,
  })
  @IsString()
  @IsIn(Object.values(ITEM_TAG))
  readonly tag: ITEM_TAG_TYPE;
}

export class UpdateTagDto extends CreateTagDto {}
