import * as dotenv from 'dotenv'; // Carga manual de variables de entorno desde .env
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

console.log('URL de la base de datos:', process.env.DATABASE_URL);
async function bootstrap() {
  console.log('Iniciando la aplicación...');
  try {
    //const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    app.enableCors({ // Configuración de CORS para permitir solicitudes desde el frontend
      origin: true, 
      credentials: true, 
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
