import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * 애플리케이션 실행 시 Prisma를 이용한 db Connect를 진행합니다.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      await this.$disconnect();
    }
  }
}
