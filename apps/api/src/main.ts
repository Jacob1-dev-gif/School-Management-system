import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('School Management System API')
    .setDescription('API for managing Liberian high schools')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & Authorization')
    .addTag('users', 'User Management')
    .addTag('academic', 'Academic Years, Terms, Classes, Subjects')
    .addTag('students', 'Student & Guardian Management')
    .addTag('attendance', 'Attendance Tracking')
    .addTag('assessment', 'Assessments & Grades')
    .addTag('finance', 'Fees, Invoices, Payments')
    .addTag('reports', 'Report Card Generation')
    .addTag('notifications', 'Notifications')
    .addTag('health', 'Health Checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 API server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap();
