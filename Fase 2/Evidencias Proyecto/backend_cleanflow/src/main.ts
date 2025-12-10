import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log(' Iniciando la aplicación...');
  try {
    const app = await NestFactory.create(AppModule);

    // Permite leer cookies en las solicitudes
    app.use(cookieParser());

    // Configuración CORS correcta
    app.enableCors({
      origin: [
        "http://localhost:5173",
        "https://localhost:5173",
        "https://frontend-cleanflow.vercel.app",
        "https://localhost:4173",
      ],
      credentials: true, 
    });

    // Validaciones globales DTO
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Configuración Swagger
    const config = new DocumentBuilder()
      .setTitle('CleanFlow API')
      .setDescription('Documentación de la API de CleanFlow')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document,{
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

    console.log('Consultar documentación de API en: ', `http://localhost:${process.env.PORT ?? 3000}/api`);
  
    } catch (error) {
      console.error('Error al iniciar la aplicación:', error);
      process.exit(1);
    }
    
  
  }
  bootstrap();
