import { ApiProperty } from '@nestjs/swagger';
import { Item } from '@prisma/client';
import { ITEM_CATEGORY, ITEM_LINK, ITEM_TAG } from 'src/common/constants/constant';
import { ITEM_CATEGORY_TYPE, ITEM_LINK_TYPE, ITEM_TAG_TYPE } from 'src/common/constants/enum';
import { CategoryEntity } from './items.category.entity';
import { TagEntity } from './items.tag.entity';
import { LinkEntity } from './items.link.entity';
import { TransformLinks } from '../interfaces/items.link.type';

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

  createdAt: Date;
  updatedAt: Date;
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
    example: "[{'type': 'instagram', 'link': 'https://..', ...}, ...]",
    description: 'Corp Site Link',
  })
  links: TransformLinks[];
}

export class FindOneItemEntity extends ItemEntity {
  @ApiProperty({
    type: CategoryEntity,
    description: 'Corp Category',
    isArray: true,
  })
  categories?: CategoryEntity[];

  @ApiProperty({
    type: TagEntity,
    description: 'Corp Tag',
    isArray: true,
  })
  tags?: TagEntity[];

  @ApiProperty({
    type: LinkEntity,
    description: 'Corp Link Data',
    isArray: true,
  })
  links?: LinkEntity[];
}

export class UpdateLinkOnItemEntity extends FindOneItemEntity {}
