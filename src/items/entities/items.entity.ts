import { Item } from '@prisma/client';
import { ITEM_CATEGORY_TYPE, ITEM_LINK_TYPE, ITEM_TAG_TYPE } from 'src/common/constants/enum';

export class ItemEntity implements Item {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  imgMaxCount: number;
}

export class FindManyItemEntity extends ItemEntity {
  categories: ITEM_CATEGORY_TYPE[];
  tags: ITEM_TAG_TYPE[];
  links: ITEM_LINK_TYPE[];
}
