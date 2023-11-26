import { ApiProperty } from '@nestjs/swagger';
import { Link } from '@prisma/client';

export class LinkEntity implements Link {
  @ApiProperty({
    example: 1,
    description: 'Link Id',
  })
  id: number;

  @ApiProperty({
    example: 'https://.....com',
    description: 'Corp Site link',
  })
  link: string;

  @ApiProperty({
    example: 'instagram',
    description: 'Corp Site link Kind',
  })
  type: string;
}
