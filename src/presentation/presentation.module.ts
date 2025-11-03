
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ApplicationModule } from '../application/application.module';
import { InfrastructureModule } from 'src/infra/infra.module';
import { AuthController } from './controllers/auth.controller';
import { QuizController } from './controllers/quiz.controller';
import { RoomController } from './controllers/room.controller';
import { JwtAuthGuard } from './guards/jwtauth.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RefreshTokenGuard } from './guards/refreshtoken.guard';




@Module({
  imports: [
    ApplicationModule,
    InfrastructureModule
  ],
  controllers: [
    AuthController,
    RoomController, 
    QuizController,
  ],
  providers: [
    JwtAuthGuard,
    RefreshTokenGuard, 
    RateLimitGuard,
    
  
  ],
  exports: [
   
    JwtAuthGuard,
    RateLimitGuard,
  ],
})
export class PresentationModule {}