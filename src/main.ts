import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { paginate } from './commen/middleware/paginate.middleware';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(paginate.use);
  app.setGlobalPrefix('api') 
  // app.useGlobalPipes(new ValidationPipe());

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     exceptionFactory: i18nValidationErrorFactory,
  //   }),
  // );
  await app.listen(8080);
}
bootstrap();
