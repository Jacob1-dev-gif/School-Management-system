import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('School Management System API')
    .setDescription('Production-ready API for Liberian High Schools')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('students', 'Student management')
    .addTag('academic', 'Academic year, terms, classes, subjects')
    .addTag('attendance', 'Attendance tracking')
    .addTag('assessments', 'Assessments and grading')
    .addTag('finance', 'Fees, invoices, and payments')
    .addTag('reports', 'Report cards and PDFs')
    .addTag('notifications', 'Email and SMS notifications')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/docs`);
}

bootstrap();
