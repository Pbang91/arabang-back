import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/api/swagger.config';
import { customLogger } from './config/api/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: customLogger });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.enableCors();
  setupSwagger(app);
  await app.listen(5080);
}
bootstrap();
