import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logging/winston.logging';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // лишние поля удаляются
      forbidNonWhitelisted: true, // ошибка если прислали лишнее
      transform: true,            // string -> number / date
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true
  })
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('Документация для системы библиотеки')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, // bu security schema
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`server: http://localhost:3000/api`,`swagger: http://localhost:3000/docs`)
}
bootstrap();
