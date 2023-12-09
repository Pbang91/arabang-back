import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../config/database/prisma.service';
import { CreateItemDto, GetItemsDto, UpdateItemDto } from './dto/items.dto';
import { Category, Item, Link, Tag } from '@prisma/client';
import { CreateCategoryDto } from './dto/items.category.dto';
import { CreateTagDto } from './dto/items.tag.dto';
import { UpdateLinkDto } from './dto/items.link.dto';
// TODO: 실패 케이스 적용.
describe('ItemsService', () => {
  let itemsService: ItemsService;

  const createdCategories: Category[] = [
    {
      id: 1,
      category: 'snap',
    },
    {
      id: 2,
      category: 'film',
    },
    {
      id: 3,
      category: 'hair&makeup',
    },
  ];

  const createdTags: Tag[] = [
    {
      id: 1,
      tag: 'emo',
    },
    {
      id: 2,
      tag: 'luv',
    },
  ];

  const createdLinks: Link[] = [
    {
      id: 1,
      type: 'instagram',
      link: 'https://instagram.test',
    },
  ];

  const createdItems: Item[] = [
    {
      id: 1,
      name: 'Test Item1',
      thumbnail: 'https://www.test.com/1.jpg',
      imgMaxCount: 4,
      description: '테스트 1 업체입니다',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
    {
      id: 2,
      name: 'Test Item2',
      thumbnail: 'https://www.test.com/2.jpg',
      imgMaxCount: 3,
      description: '테스트 2 업체입니다',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
  ];

  const findManyItemsMiddleTb = {
    category: createdCategories[0],
    tag: createdTags[0],
    link: createdLinks[0],
  };

  // 실제 db 처럼 활용됨
  const findManyItems = [
    {
      ...createdItems[0],
      categories: [findManyItemsMiddleTb],
      tags: [findManyItemsMiddleTb],
      links: [findManyItemsMiddleTb],
    },
  ];

  // 실제 service로직에서 변환을 해주기 때문에 적용
  const transformFindManyItems = findManyItems.map((item) => {
    const { id, name, thumbnail, description, imgMaxCount } = item;
    const categories = item.categories.map((category) => category.category.category);
    const tags = item.tags.map((tag) => tag.tag.tag);
    const links = item.links.map((link) => link.link.type);

    return {
      id,
      name,
      description,
      thumbnail,
      imgMaxCount,
      categories,
      tags,
      links,
    };
  });

  // 실제 db 처럼 활용
  const findOneItem = {
    ...createdItems[0],
    categories: [{ category: findManyItemsMiddleTb.category }],
    tags: [{ tag: findManyItemsMiddleTb.tag }],
    links: [{ link: findManyItemsMiddleTb.link }],
  };

  // 변환에 의한 적용
  const transformFindOneItem = {
    ...createdItems[0],
    categories: [findManyItemsMiddleTb.category],
    tags: [findManyItemsMiddleTb.tag],
    links: [findManyItemsMiddleTb.link],
  };

  const oneCreatedCategory = createdCategories[0];
  const oneCreatedTag = createdTags[0];
  const oneCreatedItem = createdItems[0];
  const oneUpdatedItem = {
    id: createdItems[0].id,
    description: '변환된 정보',
    name: createdItems[0].name,
    thumbnail: createdItems[0].thumbnail,
    imgMaxCount: createdItems[0].imgMaxCount,
  };
  const oneUpdatedLinkOnItem = {
    id: createdLinks[0].id,
    type: 'self',
    link: 'https://other.site.link',
  };
  // TODO: 변수명 바꾸자 ㅎㅎ;;...
  const 링크변경된item = {
    ...createdItems[0],
    links: [{ link: oneUpdatedItem }],
  };

  const mockDb = {
    category: {
      create: jest.fn().mockResolvedValue(oneCreatedCategory),
      findMany: jest.fn().mockResolvedValue(createdCategories),
    },
    tag: {
      create: jest.fn().mockResolvedValue(oneCreatedTag),
      findMany: jest.fn().mockResolvedValue(createdTags),
    },
    item: {
      create: jest.fn().mockResolvedValue(oneCreatedItem),
      findMany: jest.fn().mockResolvedValue(findManyItems),
      findUnique: jest.fn().mockResolvedValue(findOneItem),
      update: jest.fn().mockResolvedValue(oneUpdatedItem),
    },
    link: {
      update: jest.fn().mockResolvedValue(oneUpdatedLinkOnItem),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: mockDb,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
  });

  it('Should be defined', () => {
    expect(itemsService).toBeDefined();
  });

  describe('items', () => {
    it('필터링 된 Items를 반환합니다.', async () => {
      const getItemsDto: GetItemsDto = {
        offset: 2,
        categories: ['snap'],
        tags: ['emo'],
      };

      const findItems = await itemsService.items(getItemsDto);

      expect(findItems).toEqual(transformFindManyItems);
      expect(itemsService.items(getItemsDto)).resolves.toEqual(transformFindManyItems);
    });
  });

  describe('categories', () => {
    it('Category 리스트를 반환합니다.', async () => {
      const findCategoires = await itemsService.categories();

      expect(findCategoires).toEqual(createdCategories);
      expect(itemsService.categories()).resolves.toEqual(createdCategories);
    });
  });

  describe('categories', () => {
    it('Tag 리스트를 반환합니다.', async () => {
      const findTags = await itemsService.tags();

      expect(findTags).toEqual(createdTags);
      expect(itemsService.tags()).resolves.toEqual(createdTags);
    });
  });

  describe('findOneItem', () => {
    it('특정 Id를 가진 Item을 반환합니다.', async () => {
      const findItem = await itemsService.findOneItem(1);

      expect(findItem).toEqual(transformFindOneItem);
      expect(itemsService.findOneItem(1)).resolves.toEqual(transformFindOneItem);
    });
  });

  describe('createItem', () => {
    it('생성된 Item 정보를 반환합니다.', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        thumbnail: 'https://www.test.com/1.jpg',
        imgMaxCount: 4,
        categories: ['snap', 'film'],
        tags: ['luv'],
        links: [
          {
            link: 'https://instagram.test',
            isMain: true,
            type: 'instagram',
          },
          {
            link: 'https://self.com.luv',
            isMain: false,
            type: 'self',
          },
        ],
        description: '테스트 업체입니다',
      };

      const createdItem = await itemsService.createItem(createItemDto);

      expect(createdItem).toEqual(oneCreatedItem);
      expect(itemsService.createItem(createItemDto)).resolves.toEqual(oneCreatedItem);
    });
  });

  describe('createCategory', () => {
    it('생성된 Category 정보를 반환합니다.', async () => {
      const createCategoryDto: CreateCategoryDto = { category: 'snap' };
      const createdCategoryResponse = await itemsService.createCategory(createCategoryDto);
      const createdCategory = createdCategoryResponse;

      expect(createdCategory).toEqual(oneCreatedCategory);
      expect(itemsService.createCategory(createCategoryDto)).resolves.toEqual(createdCategoryResponse);
    });
  });

  describe('createTag', () => {
    it('생성된 Tag 정보를 반환합니다,', async () => {
      const createTagDto: CreateTagDto = { tag: 'emo' };
      const createdTag = await itemsService.createTag(createTagDto);

      expect(createdTag).toEqual(oneCreatedTag);
      expect(itemsService.createTag(createTagDto)).resolves.toEqual(createdTag);
    });
  });

  describe('updateItem', () => {
    it('Item의 정보를 수정합니다.', async () => {
      const updateItmeDto: UpdateItemDto = { description: '변환된 정보' };
      const updatedItem = await itemsService.updateItem(1, updateItmeDto);

      expect(updatedItem).toEqual(oneUpdatedItem);
      expect(itemsService.updateItem(1, updateItmeDto)).resolves.toEqual(updatedItem);
    });
  });
  // TODO: 검증하기
  describe('updateLinkOnItems', () => {
    it('Link on Item 정보를 수정합니다.', async () => {
      const updateLinkDto: UpdateLinkDto = { link: 'https://other.site.link', type: 'self' };
      await itemsService.updateLinkOnItem(1, 1, updateLinkDto);
    });
  });
});
