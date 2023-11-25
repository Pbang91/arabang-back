import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto, GetItemsDto } from './dto/items.dto';
import { CreateCategoryDto } from './dto/items.category.dto';
import { CategoryEntity } from './entities/items.category.entity';
import { TagEntity } from './entities/items.tag.entity';
import { CreateTagDto } from './dto/items.tag.dto';
import { FindManyItemEntity, ItemEntity } from './entities/items.entity';

@Controller('items')
@ApiTags('Item')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({
    summary: '업체 조회 API',
    description: '현재 등록된 업체를 조회합니다.',
  })
  @ApiResponse({
    description: '업체 정보를 Array 형태로 반환합니다.',
    isArray: true,
    type: FindManyItemEntity,
    status: 200,
  })
  async getItems(@Query() query: GetItemsDto) {
    return await this.itemsService.items(query);
  }

  // TODO: Admin role Guard 추가
  @Post()
  @ApiOperation({
    summary: '업체 생성 API',
    description: '신규 업체를 등록합니다. 관리자만 가능합니다.',
  })
  @ApiCreatedResponse({
    description: '생성된 정보를 반환합니다.',
    type: ItemEntity,
  })
  async createItem(@Body() createItmeDto: CreateItemDto) {
    return await this.itemsService.createItem(createItmeDto);
  }

  // TODO: Role guard
  @Post('/categories')
  @ApiOperation({
    summary: '카테고리 생성 API',
    description: '신규 카테고리를 등록합니다. 관리자만 가능합니다.',
  })
  @ApiCreatedResponse({
    description: '생성된 정보를 반환합니다.',
    type: CategoryEntity,
  })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.itemsService.createCategory(createCategoryDto);
  }

  @Post('/tags')
  @ApiOperation({
    summary: '태그 생성 API',
    description: '신규 태그를 등록합니다. 관리자만 가능합니다.',
  })
  @ApiCreatedResponse({
    description: '생성된 정보를 반환합니다.',
    type: TagEntity,
  })
  async createTag(@Body() createTagDto: CreateTagDto) {
    return await this.itemsService.createTag(createTagDto);
  }
}
