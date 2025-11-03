// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { QuizSeeder } from './infra/database-config/quiz.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  
   app.enableCors({
    origin: true, // ✅ Autorise toutes les origins en développement
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Authorization', 
      'Content-Type', 
      'Accept', 
      'X-Requested-With',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin'
    ],
    exposedHeaders: ['Authorization'],
    credentials: true, // ✅ Important pour les cookies/tokens
  });

  
  const config = new DocumentBuilder()
    .setTitle('Quiz Game API')
    .setDescription('API for real-time multiplayer quiz game')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
 const quizSeeder = app.get(QuizSeeder);
  await quizSeeder.seed();
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api`);
}

bootstrap();