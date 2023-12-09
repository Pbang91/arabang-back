export const ITEM_CATEGORY = {
  SNAP: 'snap',
  HALL: 'hall',
  H_M: 'hair&makeup',
  DRESS: 'dress',
  SUIT: 'suit',
  STUDIO: 'studio',
  BOUQUET: 'bouquet',
  FILM: 'film',
} as const;

export const ITEM_TAG = {
  EMO: 'emo',
  LUV: 'luv',
  FRE: 'fre',
  MOD: 'mod',
  WRAM: 'warm',
} as const;

export const ITEM_LINK = {
  INSTA: 'instagram',
  SELF: 'self',
} as const;

export const TASK_STATUS = {
  COMPLETE: 1,
  PENDING: 2,
  IN_PROGRESS: 3,
  ERROR: 4,
} as const;

export const TASK_KIND = {
  SCRAP: 1,
  PROMOTION: 2,
  REGIST: 3,
} as const;

export const USER_LOGIN = {
  EMAIL: 'email',
  KAKAO: 'kakao',
} as const;

export const USER_ROLE = {
  USER: 0,
  ADMIN: 1,
} as const;
