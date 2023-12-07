import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';
import s3Config from './s3.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [s3Config],
    }),
  ],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
