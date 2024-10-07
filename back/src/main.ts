import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://127.0.0.1:8080',
  });
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
