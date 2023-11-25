import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { GetTaskDto, RegistTaskDto } from './dto/tasks.dto';
import { TaskEntity } from './entities/tasks.entity';

// TODO: Admin Role guard
@Controller()
@ApiTags('Task')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({
    summary: 'Task 조회 API',
    description: '등록된 Task를 조회합니다.',
  })
  @ApiResponse({
    description: 'Task 정보를 Array 형태로 반환합니다.',
    type: TaskEntity,
    isArray: true,
  })
  async getTasks(@Query() getTaskDto: GetTaskDto) {
    return await this.tasksService.tasks(getTaskDto);
  }

  @Post()
  @ApiOperation({
    summary: 'Task 등록 API',
    description: '예약이 필요한 작업을 등록합니다.',
  })
  @ApiCreatedResponse({
    description: '생성된 Task의 정보를 반환합니다.',
    type: TaskEntity,
  })
  async registTask(@Body() registTaskDto: RegistTaskDto) {
    return await this.tasksService.registTask(registTaskDto);
  }

  // TODO: 등록된 Task를 실행하는 기능 추가
}
