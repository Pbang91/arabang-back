import { ITEM_CATEGORY_TYPE, ITEM_LINK_TYPE, ITEM_TAG_TYPE } from 'src/common/constants/enum';

interface CategoryOrCondition {
  category: ITEM_CATEGORY_TYPE;
}

interface TagOrCondition {
  tag: ITEM_TAG_TYPE;
}

interface LinkOrCondition {
  type: ITEM_LINK_TYPE;
}

export { CategoryOrCondition, TagOrCondition, LinkOrCondition };
