import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Category, Item, Link, Prisma, Tag } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma.service';
import { CreateItemDto, GetItemsDto, UpdateItemDto } from './dto/items.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/items.category.dto';
import { CreateTagDto, UpdateTagDto } from './dto/items.tag.dto';
import { CategoryOrCondition, LinkOrCondition, TagOrCondition } from './interfaces/items.type';
import { FindManyItemEntity, FindOneItemEntity, UpdateLinkOnItemEntity } from './entities/items.entity';
import { ITEM_CATEGORY_TYPE, ITEM_TAG_TYPE } from 'src/common/constants/enum';
import { customLogger } from 'src/config/api/logger.config';
import { transformJoinValue } from 'src/common/utils/transform';
import { UpdateLinkDto } from './dto/items.link.dto';
import { TransformLinks } from './interfaces/items.link.type';
import { S3Service } from 'src/config/provider/s3/s3.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}

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

      const findItems = await this.prisma.item.findMany({
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

      const result: FindManyItemEntity[] = [];

      for (const findItem of findItems) {
        const { id, name, description, imgMaxCount, createdAt, updatedAt } = findItem;
        const categories = findItem.categories.map((category) => category.category.category) as ITEM_CATEGORY_TYPE[];
        const tags = findItem.tags.map((tag) => tag.tag.tag) as ITEM_TAG_TYPE[];
        const links = findItem.links.map((link) => ({
          type: link.link.type,
          link: link.link.link,
        })) as TransformLinks[];

        const extractedKey = findItem.thumbnail.split('.com/')[1];
        const thumbnail = (await this.s3Service.generatePresignedUrl(extractedKey)) as string;

        result.push({
          id,
          name,
          thumbnail,
          description,
          imgMaxCount,
          categories,
          tags,
          links,
          createdAt,
          updatedAt,
        });
      }

      return result;
    } catch (e) {
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
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
    try {
      return this.prisma.tag.findMany({ orderBy: { id: 'asc' } });
    } catch (e) {
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
    }
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
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);

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
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('중복된 카테고리 입니다.');

        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
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
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('중복된 태그 입니다.');

        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
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

    try {
      return await this.prisma.item.update({
        where: { id },
        data,
      });
    } catch (e) {
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new BadRequestException('업체 정보가 없습니다.');

        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
    }
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
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new BadRequestException('링크 정보가 없습니다.');

        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
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

  /**
   * 카테고리 정보를 수정하는 함수입니다.
   *
   * @param {number} id Category Id
   * @param {UpdateCategoryDto} updateCategoryDto 수정될 정보를 가지고 있는 class
   * @returns {Category} 변경된 카테고리
   */
  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.update({
        where: {
          id,
        },
        data: { ...updateCategoryDto },
      });
    } catch (e) {
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('중복된 카테고리 입니다.');
        if (e.code === 'P2025') throw new BadRequestException('카테고리 정보가 없습니다.');

        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
    }
  }

  /**
   * 태그 정보를 수정하는 함수입니다.
   *
   * @param {number} id Tag Id
   * @param {UpdateTagDto} updateTagDto 수정될 정보를 가지고 있는 class
   * @returns {Tag} 변경된 태그
   */
  async updateTag(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    try {
      return await this.prisma.tag.update({
        where: {
          id,
        },
        data: { ...updateTagDto },
      });
    } catch (e) {
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new ConflictException('중복된 태그 입니다.');
        if (e.code === 'P2025') throw new BadRequestException('태그 정보가 없습니다.');

        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
    }
  }
  // TODO: Delete 관련 기능 Task쪽으로 뺄지 고민.
  /**
   * Item을 삭제하는 함수입니다.
   *
   * @param {number} id Item Id
   */
  async removeItem(id: number): Promise<void> {
    try {
      const deleteItem = this.prisma.item.delete({ where: { id } });
      await this.prisma.$transaction([deleteItem]);
    } catch (e) {
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
    }
  }

  /**
   * 카테고리를 삭제하는 함수입니다.
   *
   * @param {number} id Category Id
   */
  async removeCategory(id: number): Promise<void> {
    try {
      const deleteCategory = this.prisma.category.delete({ where: { id } });
      await this.prisma.$transaction([deleteCategory]);
    } catch (e) {
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
    }
  }

  /**
   * 태그를 삭제하는 함수입니다.
   *
   * @param {number} id Tag Id
   */
  async removeTag(id: number): Promise<void> {
    try {
      const deleteTag = this.prisma.tag.delete({ where: { id } });
      await this.prisma.$transaction([deleteTag]);
    } catch (e) {
      let message = e.message;

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        message = `code: ${e.code}, cause: ${e.meta.cause}`;
      }

      customLogger.error(message);
      throw new ServiceUnavailableException('확인되지 않은 오류입니다. 잠시 후 다시 시도해주세요');
    }
  }
}
