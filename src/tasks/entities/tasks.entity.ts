import { ApiProperty } from '@nestjs/swagger';
import { Task } from '@prisma/client';

export class TaskEntity implements Task {
  @ApiProperty({
    example: 1,
    description: 'Task Id',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'Task Type',
  })
  type: number;

  @ApiProperty({
    example: 'complete',
    description: 'Task Status',
  })
  status: number;

  @ApiProperty({
    example: 'email=....',
    description: 'To run Task message',
  })
  message: string;

  @ApiProperty({
    example: 1,
    description: 'Task를 등록한 UserId',
  })
  userId: number;
}
