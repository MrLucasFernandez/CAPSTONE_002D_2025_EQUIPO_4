import * as dotenv from 'dotenv'; // Carga manual de variables de entorno desde .env
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes( // Habilitar validación global para DTOs
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  const config = new DocumentBuilder() // Configuración de Swagger
    .setTitle('CleanFlow API')
    .setDescription('Documentación de la API de CleanFlow')
    .setVersion('1.0')
    .addBearerAuth() // Para habilitar JWT en Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);

  console.log('Consultar documentación de API en: ', `http://localhost:${process.env.PORT ?? 3000}/api`);

}
bootstrap();
