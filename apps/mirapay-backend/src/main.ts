import 'dotenv/config';
/**
 * MiraPay Backend — NestJS API
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global pour toutes les routes : /api/...
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Configuration de Swagger (documentation interactive)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MiraPay API')
    .setDescription("Documentation de l'API backend MiraPay")
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `📚 Swagger documentation:      http://localhost:${port}/api/docs`,
  );
}

bootstrap();
