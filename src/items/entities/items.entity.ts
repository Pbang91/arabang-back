import { ApiProperty } from '@nestjs/swagger';
import { Item } from '@prisma/client';
import { ITEM_CATEGORY, ITEM_LINK, ITEM_TAG } from 'src/common/constants/constant';
import { ITEM_CATEGORY_TYPE, ITEM_LINK_TYPE, ITEM_TAG_TYPE } from 'src/common/constants/enum';

export class ItemEntity implements Item {
  @ApiProperty({
    example: 1,
    description: 'Corp Id',
  })
  id: number;

  @ApiProperty({
    example: '943 홀릭',
    description: 'Corp name',
  })
  name: string;

  @ApiProperty({
    example: 'https://...jpg',
    description: 'Corp Thumbnail',
  })
  thumbnail: string;

  @ApiProperty({
    example: '좋은 업체',
    description: 'Corp description',
  })
  description: string;

  @ApiProperty({
    example: 4,
    description: 'Corp Images',
  })
  imgMaxCount: number;
}

export class FindManyItemEntity extends ItemEntity {
  @ApiProperty({
    example: "['snap', ...]",
    examples: Object.values(ITEM_CATEGORY),
    description: 'Corp categories',
  })
  categories: ITEM_CATEGORY_TYPE[];

  @ApiProperty({
    example: "['filme', ...]",
    examples: Object.values(ITEM_TAG),
    description: 'Corp tags',
  })
  tags: ITEM_TAG_TYPE[];

  @ApiProperty({
    example: "['instagram', ...]",
    examples: Object.values(ITEM_LINK),
    description: 'Corp Site Link',
  })
  links: ITEM_LINK_TYPE[];
}
