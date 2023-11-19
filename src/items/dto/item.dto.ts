import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { ITEM_CATEGORY, ITEM_LINK, ITEM_TAG } from 'src/common/constants/constant';
import { ITEM_CATEGORY_TYPE, ITEM_LINK_TYPE, ITEM_TAG_TYPE } from 'src/common/constants/enum';
import { ItemLinks } from '../interfaces/items.type';

export class GetItemsDto {
  @ApiProperty({
    example: 0,
    description: '업체를 불러오기 위한 시작 지점',
    required: false,
    default: 0,
  })
  @IsNumber()
  readonly limit?: number = 0;

  @ApiProperty({
    example: 12,
    description: '업체를 불러오기 위한 끝 지점',
    required: false,
    default: 12,
  })
  @IsNumber()
  readonly offset?: number = 12;

  @ApiProperty({
    example: 'snap,dress',
    description: '업체 상세 분류. ","로 다중 선택 가능',
    required: false,
    default: null,
  })
  @IsOptional()
  @IsIn(Object.values(ITEM_CATEGORY), { each: true })
  readonly categories?: ITEM_CATEGORY_TYPE[];

  @ApiProperty({
    example: 'emo,luv',
    description: '업체 태그 분류. ","로 다중 선택 가능',
    required: false,
    default: null,
  })
  @IsOptional()
  @IsIn(Object.values(ITEM_TAG), { each: true })
  readonly tags?: ITEM_TAG_TYPE[];

  @ApiProperty({
    example: 'instagram,self',
    description: '업체 사이트 분류. ","로 다중 선택 가능',
    required: false,
    default: null,
  })
  @IsOptional()
  @IsIn(Object.values(ITEM_LINK), { each: true })
  readonly links?: ITEM_LINK_TYPE[];
}

export class CreateItemDto {
  @ApiProperty({
    example: '943 홀릭',
    description: '등록할 업체명',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'https://...jpg',
    description: '업체의 썸네일',
    required: true,
  })
  @IsUrl()
  readonly thumbnail: string;

  @ApiProperty({
    example: '심플하고 감각적인 스냅을 뽐내는 업체',
    description: '사용자가 확인할 수 있는 업체의 설명',
    required: true,
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: 4,
    description: '업체 관련 사진 개수(promotion)',
    required: false,
  })
  @IsNumber()
  readonly imgMaxCount: number;

  @ApiProperty({
    example: '["snap", ...]',
    description: '해당 업체 카테고리. 여러 개 가능',
    required: true,
    isArray: true,
  })
  @IsIn(Object.values(ITEM_CATEGORY), { each: true })
  readonly categories: ITEM_CATEGORY_TYPE[];

  @ApiProperty({
    example: '["luv", ...]',
    description: '해당 업체 태그. 여러 개 가능',
    required: true,
    isArray: true,
  })
  @IsIn(Object.values(ITEM_TAG), { each: true })
  readonly tags: ITEM_TAG_TYPE[];

  @ApiProperty({
    example: '[{"link": "https://...", "isMain": true, "type": "instagram"}...]',
    description: '업체의 사진 정보',
    required: false,
    isArray: true,
  })
  @IsArray()
  readonly links: ItemLinks[];
}
