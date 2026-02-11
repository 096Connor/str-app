import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: 'http://localhost:3001', // adres frontendu
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
