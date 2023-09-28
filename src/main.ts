import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      'https://genfit-front-mermf4p0y-victordqa.vercel.app',
    ],
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
