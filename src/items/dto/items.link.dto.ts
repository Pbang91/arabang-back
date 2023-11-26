import { PickType } from '@nestjs/swagger';
import { CreateItemDto } from './items.dto';

export class UpdateLinkDto extends PickType(CreateItemDto, ['links'] as const) {}
