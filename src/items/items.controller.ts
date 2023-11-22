import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto, GetItemsDto } from './dto/items.dto';

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
  })
  async createItem(@Body() createItmeDto: CreateItemDto) {
    return await this.itemsService.createItem(createItmeDto);
  }
}
