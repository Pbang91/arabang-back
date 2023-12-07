import { ITEM_LINK_TYPE } from 'src/common/constants/enum';

export interface ItemLinks {
  link: string;
  isMain: boolean;
  type: ITEM_LINK_TYPE;
}

export interface TransformLinks {
  type: ITEM_LINK_TYPE;
  link: string;
}
