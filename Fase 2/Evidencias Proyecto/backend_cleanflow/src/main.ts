import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('🚀 Iniciando la aplicación...');
  try {
    const app = await NestFactory.create(AppModule);

    // ✅ Permite leer cookies en las solicitudes
    app.use(cookieParser());

    // 🔧 Configuración CORS correcta
    app.enableCors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:5173',                // frontend local
          'https://cleanflow-front.onrender.com', // (futuro) front en producción
        ];

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(`❌ Bloqueado por CORS: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // 🔥 Necesario para cookies cross-origin
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // 🧹 Validaciones globales DTO
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // 📘 Configuración Swagger
    const config = new DocumentBuilder()
      .setTitle('CleanFlow API')
      .setDescription('Documentación de la API de CleanFlow')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(ap
