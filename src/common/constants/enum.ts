import { ITEM_CATEGORY, ITEM_LINK, ITEM_TAG, TASK_STATUS, TASK_KIND } from './constant';

export type ITEM_CATEGORY_TYPE = (typeof ITEM_CATEGORY)[keyof typeof ITEM_CATEGORY];
export type ITEM_TAG_TYPE = (typeof ITEM_TAG)[keyof typeof ITEM_TAG];
export type ITEM_LINK_TYPE = (typeof ITEM_LINK)[keyof typeof ITEM_LINK];
export type TASK_STATUS_TYPE = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
export type TASK_KIND_TYPE = (typeof TASK_KIND)[keyof typeof TASK_KIND];
