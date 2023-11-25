import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsObject, IsOptional } from 'class-validator';
import { TASK_STATUS, TASK_KIND } from 'src/common/constants/constant';
import { TASK_STATUS_TYPE, TASK_KIND_TYPE } from 'src/common/constants/enum';

export class GetTaskDto {
  @ApiProperty({
    example: [1, 2, 3, 4],
    description: '조회할 태스크의 상태',
    required: false,
    default: 3,
  })
  @IsOptional()
  @IsNumber()
  @IsIn(Object.values(TASK_STATUS))
  readonly status?: TASK_STATUS_TYPE;

  @ApiProperty({
    examples: [1, 2, 3],
    description: '조회할 태스크의 작업 타입',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsIn(Object.keys(TASK_KIND))
  readonly type?: TASK_KIND_TYPE;
}

export class RunTaskDto {
  @ApiProperty({
    example: 1,
    description: '실행할 태스크의 Id',
    required: true,
  })
  @IsNumber()
  readonly id: number;
}

export class RegistTaskDto {
  @ApiProperty({
    examples: [1, 2, 3],
    description: '실행할 태스크의 작업 타입',
    required: true,
  })
  @IsNumber()
  @IsIn(Object.keys(TASK_KIND))
  readonly type: TASK_KIND_TYPE;

  @ApiProperty({
    example: 'email=admin@admin.com|password=admin1234',
    description: '태스크로 실행할 내용',
    required: true,
  })
  @IsObject()
  readonly message: string;
}
