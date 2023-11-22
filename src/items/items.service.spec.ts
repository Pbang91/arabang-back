import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from 'src/config/database/prisma.service';
import { CreateItemDto } from './dto/item.dto';

describe('ItemsService', () => {
  let itemsService: ItemsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: {
            item: {
              create: jest.fn((dto: CreateItemDto) => ({ id: 1, ...dto })),
            },
          },
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('Should be defined', () => {
    expect(itemsService).toBeDefined();
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

      expect(createdItem).toEqual({ id: 1, ...createItemDto });
      // TODO: link, tag, category 고려한 결과값 적용.
      // expect(prismaService.item.create).toHaveBeenCalledWith({ data: createdItem });
    });
  });
});
