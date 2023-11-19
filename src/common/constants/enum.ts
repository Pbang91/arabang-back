import { ITEM_CATEGORY, ITEM_LINK, ITEM_TAG } from './constant';

export type ITEM_CATEGORY_TYPE = (typeof ITEM_CATEGORY)[keyof typeof ITEM_CATEGORY];
export type ITEM_TAG_TYPE = (typeof ITEM_TAG)[keyof typeof ITEM_TAG];
export type ITEM_LINK_TYPE = (typeof ITEM_LINK)[keyof typeof ITEM_LINK];
