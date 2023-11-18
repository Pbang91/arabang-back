import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Arabang BE Swagger를 설정하기 위한 함수입니다.
 *
 * @param {INestApplication} app NestApplication 정의 인터페이스
 */
export const setupSwagger = (app: INestApplication) => {
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Arabang API')
    .setDescription('Arabang API 문서입니다.')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api-docs', app, document);
};
