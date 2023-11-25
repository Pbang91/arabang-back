import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { ITEM_CATEGORY } from 'src/common/constants/constant';
import { ITEM_CATEGORY_TYPE } from 'src/common/constants/enum';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'snap',
    examples: Object.values(ITEM_CATEGORY),
    description: '카테고리 분류',
    required: true,
  })
  @IsString()
  @IsIn(Object.values(ITEM_CATEGORY))
  readonly category: ITEM_CATEGORY_TYPE;
}
