import { ITEM_CATEGORY, ITEM_LINK, ITEM_TAG, TASK_STATUS, TASK_KIND, USER_LOGIN, USER_ROLE } from './constant';

export type ITEM_CATEGORY_TYPE = (typeof ITEM_CATEGORY)[keyof typeof ITEM_CATEGORY];
export type ITEM_TAG_TYPE = (typeof ITEM_TAG)[keyof typeof ITEM_TAG];
export type ITEM_LINK_TYPE = (typeof ITEM_LINK)[keyof typeof ITEM_LINK];
export type TASK_STATUS_TYPE = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
export type TASK_KIND_TYPE = (typeof TASK_KIND)[keyof typeof TASK_KIND];
export type USER_LOGIN_TYPE = (typeof USER_LOGIN)[keyof typeof USER_LOGIN];
export type USER_ROLE_TYPE = (typeof USER_ROLE)[keyof typeof USER_ROLE];
