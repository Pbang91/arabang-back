import { ConflictException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Category, Item, Prisma, Tag } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma.service';
import { CreateItemDto, GetItemsDto } from './dto/items.dto';
import { CreateCategoryDto } from './dto/items.category.dto';
import { CreateTagDto } from './dto/items.tag.dto';
import { CategoryOrCondition, LinkOrCondition, TagOrCondition } from './interfaces/items.type';
import { FindManyItemEntity } from './entities/items.entity';
import { ITEM_CATEGORY_TYPE, ITEM_LINK_TYPE, ITEM_TAG_TYPE } from 'src/common/constants/enum';
import { customLogger } from 'src/config/api/logger.config';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Item List를 전달하는 함수 입니다.
   *
   * @param {GetItemsDto} getItemDto limit, offset, categories 등이 포함된 class
   * @returns {Item[]} Item Array를 반환합니다.
   */
  async items(getItemDto: GetItemsDto): Promise<FindManyItemEntity[]> {
    const { limit, offset, categories, tags, links } = getItemDto;
    const where: Prisma.ItemWhereInput = {};

    try {
      if (categories) {
        const categoryOr: Array<{ category: CategoryOrCondition }> = categories.map((category) => {
          return {
            category: {
              category: category,
            },
          };
        });

        where.categories = {
          some: {
            OR: categoryOr,
          },
        };
      }

      if (tags) {
        const tagOr: Array<{ tag: TagOrCondition }> = tags.map((tag) => {
          return {
            tag: {
              tag: tag,
            },
          };
        });

        where.tags = {
          some: {
            OR: tagOr,
          },
        };
      }

      if (links) {
        const linkCondtion: Array<{ link: LinkOrCondition }> = links.map((link) => {
          return {
            link: {
              type: link,
            },
          };
        });

        where.links = {
          some: {
            OR: linkCondtion,
          },
        };
      }

      const findResults = await this.prisma.item.findMany({
        skip: limit,
        take: offset,
        where,
        include: {
          categories: {
            select: {
              category: true,
            },
          },
          tags: {
            select: {
              tag: true,
            },
          },
          links: {
            select: {
              link: true,
            },
          },
        },
      });

      const result = findResults.map((findResult) => {
        const { id, name, thumbnail, description, imgMaxCount } = findResult;
        const categories = findResult.categories.map((category) => category.category.category) as ITEM_CATEGORY_TYPE[];
        const tags = findResult.tags.map((tag) => tag.tag.tag) as ITEM_TAG_TYPE[];
        const links = findResult.links.map((link) => link.link.type) as ITEM_LINK_TYPE[];

        return {
          id,
          name,
          thumbnail,
          description,
          imgMaxCount,
          categories,
          tags,
          links,
        };
      });

      return result;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        customLogger.error(e.message);
        throw new ServiceUnavailableException('잠시 후 다시 시도해주세요.');
      }
    }
  }

  async createItem(createItemDto: CreateItemDto): Promise<Item> {
    const linkCreatCondition = createItemDto.links.map((linkData) => {
      return {
        link: {
          create: {
            link: linkData.link,
            type: linkData.type,
          },
        },
      };
    });

    const categoryCreateCondition = createItemDto.categories.map((category) => {
      return {
        category: {
          connect: {
            category: category,
          },
        },
      };
    });

    const tagCreateCondition = createItemDto.tags.map((tag) => {
      return {
        tag: {
          connect: {
            tag: tag,
          },
        },
      };
    });

    const data: Prisma.ItemCreateInput = {
      name: createItemDto.name,
      thumbnail: createItemDto.thumbnail,
      description: createItemDto.description,
      imgMaxCount: createItemDto.imgMaxCount,
      links: {
        create: linkCreatCondition,
      },
      categories: {
        create: categoryCreateCondition,
      },
      tags: {
        create: tagCreateCondition,
      },
    };

    try {
      return await this.prisma.item.create({ data });
    } catch (e) {
      customLogger.error(e.message);
      throw new ServiceUnavailableException('잠시 후 다시 시도해주세요.');
    }
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.create({
        data: {
          category: createCategoryDto.category,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('중복된 카테고리 입니다.');
      }
    }
  }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      return await this.prisma.tag.create({
        data: {
          tag: createTagDto.tag,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('중복된 태그 입니다.');
      }
    }
  }
}
