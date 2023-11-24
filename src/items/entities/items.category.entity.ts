import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { ITEM_CATEGORY } from 'src/common/constants/constant';

export class CategoryEntity implements Category {
  @ApiProperty({
    example: 1,
    description: 'Category Id',
  })
  id: number;

  @ApiProperty({
    example: 'snap',
    examples: Object.values(ITEM_CATEGORY),
    description: '카테고리 분류',
  })
  category: string;
}
