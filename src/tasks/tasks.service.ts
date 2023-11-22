import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { GetTaskDto, RegistTaskDto } from './dto/tasks.dto';
import { TASK_KIND, TASK_STATUS } from 'src/common/constants/constant';
import { Prisma, Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async tasks(getTaskDto: GetTaskDto): Promise<Task[]> {
    const { status, type } = getTaskDto;

    return await this.prisma.task.findMany({
      where: {
        status,
        type,
      },
    });
  }

  async registTask(registTaskDto: RegistTaskDto): Promise<Task> {
    const { type, message } = registTaskDto;

    const data: Prisma.TaskCreateInput = {
      type: TASK_KIND[type],
      message,
      status: TASK_STATUS.PENDING,
      user: {
        connect: {
          id: 1,
        },
      },
    };

    return await this.prisma.task.create({
      data,
    });
  }
}
