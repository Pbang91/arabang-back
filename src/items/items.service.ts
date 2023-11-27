import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Category, Item, Link, Prisma, Tag } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma.service';
import { CreateItemDto, GetItemsDto, UpdateItemDto } from './dto/items.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/items.category.dto';
import { CreateTagDto, UpdateTagDto } from './dto/items.tag.dto';
import { CategoryOrCondition, LinkOrCondition, TagOrCondition } from './interfaces/items.type';
import { FindManyItemEntity, FindOneItemEntity, UpdateLinkOnItemEntity } from './entities/items.entity';
import { ITEM_CATEGORY_TYPE, ITEM_LINK_TYPE, ITEM_TAG_TYPE } from 'src/common/constants/enum';
import { customLogger } from 'src/config/api/logger.config';
import { transformJoinValue } from 'src/common/utils/transform';
import { UpdateLinkDto } from './dto/items.link.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Item List를 전달하는 함수입니다.
   *
   * @param {GetItemsDto} getItemDto limit, offset, categories 등이 포함된 class
   * @returns {Item[]} Item Array를 반환합니다.
   */
  async items(getItemDto: GetItemsDto): Promise<FindManyItemEntity[]> {
    const { limit, offset, categories, tags, links } = getItemDto;
    const data: { skip: number; take: number; where?: Prisma.ItemWhereInput } = {
      skip: limit,
      take: offset,
    };

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

      if (Object.values(where).length > 0) {
        data.where = where;
      }

      const findResults = await this.prisma.item.findMany({
        ...data,
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
      customLogger.error(e.message);

      throw new ServiceUnavailableException('잠시 후 다시 시도해주세요.');
    }
  }

  /**
   * Category List를 전달하는 함수입니다.
   *
   * @returns {Category[]} Category Array를 반환합니다.
   */
  async categories(): Promise<Category[]> {
    return this.prisma.category.findMany({ orderBy: { id: 'asc' } });
  }

  /**
   * Tag List를 전달하는 함수입니다.
   *
   * @returns {Tag[]} Tag Array를 반환합니다.
   */
  async tags(): Promise<Tag[]> {
    return this.prisma.tag.findMany({ orderBy: { id: 'asc' } });
  }

  /**
   * 특정 Item을 전달하는 함수입니다.
   *
   * @param {number} id Item Id
   * @returns {FindOneItemEntity} Item 정보를 반환합니다.
   */
  async findOneItem(id: number): Promise<FindOneItemEntity> {
    const item = await this.prisma.item.findUnique({
      where: {
        id,
      },
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

    if (item === null) throw new BadRequestException('업체 정보가 없습니다.');

    const result = {
      ...item,
    } as unknown as FindOneItemEntity;

    if (result.links) {
      result.links = await transformJoinValue<{ link: Link }>(item.links);
    }

    if (result.categories) {
      result.categories = await transformJoinValue<{ category: Category }>(item.categories);
    }

    if (result.tags) {
      result.tags = await transformJoinValue<{ tag: Tag }>(item.tags);
    }

    return result;
  }

  /**
   * Item을 생성하는 함수입니다.
   *
   * @param {CreateItemDto} createItemDto name, thumbnail 등이 포함된 class
   * @returns {Item} 생성된 Item 정보를 반환합니다.
   */
  async createItem(createItemDto: CreateItemDto): Promise<Item> {
    const { name, thumbnail, description, imgMaxCount, links, categories, tags } = createItemDto;

    const data: Prisma.ItemCreateInput = {
      name,
      thumbnail,
      description,
      imgMaxCount,
    };

    if (links) {
      const linkCreateCondition = createItemDto.links.map((linkData) => {
        return {
          link: {
            create: {
              link: linkData.link,
              type: linkData.type,
            },
          },
        };
      });

      data.links = {
        create: linkCreateCondition,
      };
    }

    if (categories) {
      const categoryCreateCondition = createItemDto.categories.map((category) => {
        return {
          category: {
            connect: {
              category: category,
            },
          },
        };
      });

      data.categories = {
        create: categoryCreateCondition,
      };
    }

    if (tags) {
      const tagCreateCondition = createItemDto.tags.map((tag) => {
        return {
          tag: {
            connect: {
              tag: tag,
            },
          },
        };
      });

      data.tags = {
        create: tagCreateCondition,
      };
    }

    try {
      return await this.prisma.item.create({ data });
    } catch (e) {
      customLogger.error(e.message);
      throw new ServiceUnavailableException('잠시 후 다시 시도해주세요.');
    }
  }

  /**
   * Category를 생성하는 함수입니다.
   *
   * @param {CreateCategoryDto} createCategoryDto category 이름을 가진 class
   * @returns {Category} 생성된 Category 정보를 반환합니다.
   */
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

  /**
   * Tag를 생성하는 함수입니다.
   *
   * @param {CreateTagDto} createTagDto tag 이름을 가진 class
   * @returns {Tag} 생성된 Tag 정보를 반환합니다.
   */
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

  /**
   * 업체 정보를 수정하는 함수입니다.
   *
   * @param {number} id Item Id
   * @param {UpdateItemDto} updateItemDto 수정될 정보를 가지고 있는 class
   * @returns 수정된 Item 정보
   */
  async updateItem(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const data: Prisma.ItemUpdateInput = {};

    Object.entries(updateItemDto).forEach(([key, value]) => {
      data[key] = value;
    });

    return await this.prisma.item.update({
      where: { id },
      data,
    });
  }

  /**
   * 업체 관련 링크 정보를 수정하는 함수입니다.
   *
   * @param {number} id Item id
   * @param {number} linkId Link Id
   * @param {UpdateLinkDto} updateLinkDto 수정될 정보를 가지고 있는 class
   * @returns {FindOneItemEntity} 수정된 Item 정보
   */
  async updateLinkOnItem(id: number, linkId: number, updateLinkDto: UpdateLinkDto): Promise<FindOneItemEntity> {
    try {
      await this.prisma.link.update({
        where: {
          id: linkId,
        },
        data: {
          ...updateLinkDto,
        },
      });
    } catch (e) {
      customLogger.error(e.message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
    }

    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        links: {
          select: {
            link: true,
          },
        },
      },
    });

    if (item === null) throw new BadRequestException('업체 정보가 없습니다.');

    const result = {
      ...item,
    } as unknown as UpdateLinkOnItemEntity;

    if (result.links) {
      result.links = await transformJoinValue<{ link: Link }>(item.links);
    }

    return result;
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // TODO: Test 진행해야 함.
    try {
      return await this.prisma.category.update({
        where: {
          id,
        },
        data: { ...updateCategoryDto },
      });
    } catch (e) {
      console.log(e);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
    }
  }

  async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    // TODO: Test 진행해야 함.
    try {
      return await this.prisma.tag.update({
        where: {
          id,
        },
        data: { ...updateTagDto },
      });
    } catch (e) {
      console.log(e);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
    }
  }
}
