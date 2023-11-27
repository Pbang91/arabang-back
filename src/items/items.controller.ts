import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto, GetItemsDto, UpdateItemDto } from './dto/items.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/items.category.dto';
import { CategoryEntity } from './entities/items.category.entity';
import { TagEntity } from './entities/items.tag.entity';
import { CreateTagDto, UpdateTagDto } from './dto/items.tag.dto';
import { FindManyItemEntity, FindOneItemEntity, ItemEntity } from './entities/items.entity';
import { Roles } from 'src/common/role/role.decorator';
import { USER_ROLE } from 'src/common/constants/constant';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { UpdateLinkDto } from './dto/items.link.dto';

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
  async getItems(@Query() getItemsDto: GetItemsDto) {
    return await this.itemsService.items(getItemsDto);
  }

  @Get('categories')
  @ApiOperation({
    summary: '카테고리 조회 API',
    description: '현재 등록된 카테고리를 조회합니다.',
  })
  @ApiResponse({
    description: '카테고리 정보를 Array 형태로 반환합니다.',
    isArray: true,
    type: CategoryEntity,
    status: 200,
  })
  async getCategories() {
    return await this.itemsService.categories();
  }

  @Get('tags')
  @ApiOperation({
    summary: '태그 조회 API',
    description: '현재 등록된 태그를 조회합니다.',
  })
  @ApiResponse({
    description: '태그 정보를 Array 형태로 반환합니다.',
    isArray: true,
    type: TagEntity,
    status: 200,
  })
  async getTags() {
    return await this.itemsService.tags();
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 업체 조회 API',
    description: 'Id를 기반으로 특정 업체 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '업체 정보를 반환합니다.',
    type: FindOneItemEntity,
  })
  async findOneItem(@Param('id') id: number) {
    return await this.itemsService.findOneItem(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(USER_ROLE.ADMIN)
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

  @Post('categories')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(USER_ROLE.ADMIN)
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

  @Post('tags')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(USER_ROLE.ADMIN)
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

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiOperation({
    summary: 'Item 정보 수정 API',
    description: '업체에 대한 정보를 수정합니다. 관리자만 가능합니다',
  })
  @ApiParam({ name: 'id', required: true, description: 'Item Id' })
  @ApiOkResponse({
    description: '수정이 완료될 시 수정된 정보를 반환합니다.',
    type: ItemEntity,
  })
  async updateItem(@Param('id') id: number, @Body() updateItemDto: UpdateItemDto) {
    return await this.itemsService.updateItem(id, updateItemDto);
  }

  @Patch(':id/links/:linkId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiOperation({
    summary: '링크 정보 수정 API',
    description: '업체에 연관된 링크 정보를 수정합니다. 관리자만 가능합니다.',
  })
  @ApiParam({ name: 'id', required: true, description: 'Item Id' })
  @ApiParam({ name: 'linkId', required: true, description: 'Link Id' })
  @ApiOkResponse({
    description: '수정된 업체의 정보를 반환합니다.',
    type: ItemEntity,
  })
  async updateLinkonItems(
    @Param('id') id: number,
    @Param('linkId') linkId: number,
    @Body() updateLinkDto: UpdateLinkDto,
  ) {
    return await this.itemsService.updateLinkOnItem(id, linkId, updateLinkDto);
  }

  @Put('categories/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiOperation({
    summary: '카테고리 수정 API',
    description: '카테고리의 정보를 수정합니다. 관리자만 가능합니다.',
  })
  @ApiParam({ name: 'id', required: true, description: 'Category Id' })
  @ApiOkResponse({
    description: '수정된 카테고리의 정보를 반환합니다.',
    type: CategoryEntity,
  })
  async updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.itemsService.updateCategory(id, updateCategoryDto);
  }

  @Put('tags/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(USER_ROLE.ADMIN)
  @ApiOperation({
    summary: '태그 수정 API',
    description: '태그의 정보를 수정합니다. 관리자만 가능합니다.',
  })
  @ApiParam({ name: 'id', required: true, description: 'Tag Id' })
  @ApiOkResponse({
    description: '수정된 태그의 정보를 반환합니다.',
    type: TagEntity,
  })
  async updateTag(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto) {
    return await this.itemsService.updateTag(id, updateTagDto);
  }
}
