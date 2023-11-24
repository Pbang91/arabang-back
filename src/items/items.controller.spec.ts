import { PrismaService } from '../config/database/prisma.service';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
  let itemsController: ItemsController;
  let itemsService: ItemsService;

  beforeEach(() => {
    itemsService = new ItemsService(new PrismaService());
    itemsController = new ItemsController(itemsService);
  });

  describe('createItem', () => {
    it('생성된 업체 정보를 반환해야 합니다', async () => {});
  });
});
