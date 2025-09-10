import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
  })

   app.use(
    "/payment/webhook",
    bodyParser.raw({ type: "application/json" }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
