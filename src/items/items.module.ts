import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { PrismaModule } from 'src/config/database/prisma.module';
import { AuthModule } from 'src/common/auth/auth.module';
import { RoleGuard } from 'src/common/role/role.guard';
import { S3Module } from 'src/config/provider/s3/s3.module';

@Module({
  imports: [PrismaModule, AuthModule, S3Module],
  controllers: [ItemsController],
  providers: [ItemsService, RoleGuard],
})
export class ItemsModule {}
