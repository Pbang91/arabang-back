import { Injectable } from '@nestjs/common';
import { Item, Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/database/prisma.service';
import { CreateItemDto, GetItemsDto } from './dto/item.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async items(params: GetItemsDto): Promise<Item[]> {
    const { limit, offset, categories, tags, links } = params;

    const categoryOr = categories.map((category) => {
      return {
        category: {
          category: category,
        },
      };
    });

    const tagOr = tags.map((tag) => {
      return {
        tag: {
          tag: tag,
        },
      };
    });

    const linkOr = links.map((link) => {
      return {
        link: {
          type: link,
        },
      };
    });

    return this.prisma.item.findMany({
      skip: limit,
      take: offset,
      where: {
        categories: {
          some: {
            OR: categoryOr,
          },
        },
        tags: {
          some: {
            OR: tagOr,
          },
        },
        links: {
          some: {
            OR: linkOr,
          },
        },
      },
    });
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

    return await this.prisma.item.create({ data });
  }
}
