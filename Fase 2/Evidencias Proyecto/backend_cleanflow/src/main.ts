import 'reflect-metadata';
import * as dotenv from 'dotenv'; // Carga manual de variables de entorno desde .env
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('Iniciando la aplicación...');
  try {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser()); // Habilitar lectura de cookies

    app.enableCors({ // Configuración de CORS para permitir solicitudes desde el frontend
      origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',                 // 🔹 para desarrollo local
        'https://cleanflow-front.onrender.com',  // 🔹 dominio del front en producción (si luego lo subes)
        ];
  
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(`❌ Bloqueado por CORS: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

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
