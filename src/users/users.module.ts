import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/config/database/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { AuthService } from 'src/common/auth/auth.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, TasksService, AuthService],
})
export class UsersModule {}
