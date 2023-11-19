import { ITEM_LINK_TYPE } from 'src/common/constants/enum';

export interface ItemLinks {
  link: string;
  isAdmin: boolean;
  type: ITEM_LINK_TYPE;
}
