import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TasksService } from 'src/tasks/tasks.service';
import { AuthModule } from 'src/common/auth/auth.module';
import { PrismaModule } from 'src/config/database/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, TasksService],
})
export class UsersModule {}
