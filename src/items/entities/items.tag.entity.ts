import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '@prisma/client';
import { ITEM_TAG } from 'src/common/constants/constant';

export class TagEntity implements Tag {
  @ApiProperty({
    example: 1,
    description: 'Tag Id',
  })
  id: number;

  @ApiProperty({
    example: 'luv',
    examples: Object.values(ITEM_TAG),
    description: '태그 분류',
  })
  tag: string;
}
