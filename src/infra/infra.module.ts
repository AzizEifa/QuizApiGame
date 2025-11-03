// infrastructure/infrastructure.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { User } from '../domain/entities/user.entity';
import { Quiz } from '../domain/entities/quiz.entity';
import { Question } from '../domain/entities/question.entity';
import { Room } from '../domain/entities/room.entity';
import { Answer } from '../domain/entities/answer.entity';
import { Score } from '../domain/entities/score.entity';

// Repositories
import { UserRepository } from './repositories/user.repository';
import { QuizRepository } from './repositories/quiz.repository';
import { QuestionRepository } from './repositories/question.repository';
import { RoomRepository } from './repositories/room.repository';
import { AnswerRepository } from './repositories/answer.repository';
import { ScoreRepository } from './repositories/score.repository';
import { QuizSeeder } from './database-config/quiz.seed';
import { BcryptService } from './service/Bcrypt.service';
import { JwtTokenService } from './service/jwt.service';



@Global() // ✅ Ajoute @Global() pour que le module soit disponible partout
@Module({
  imports: [
    ConfigModule, // ✅ IMPORTANT: Ajoute ConfigModule pour utiliser ConfigService
    
    TypeOrmModule.forFeature([
      User,
      Quiz,
      Question,
      Room,
      Answer,
      Score,
    ]),
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_ACCESS_EXPIRATION', 900), // 900 seconds = 15 minutes
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Repositories
    UserRepository,
    QuizRepository,
    QuestionRepository,
    RoomRepository,
    AnswerRepository,
    ScoreRepository,
    
    // Services
    BcryptService,
    JwtTokenService,
    
    // Seeders
    QuizSeeder,
  ],
  exports: [
    // Repositories
    UserRepository,
    QuizRepository,
    QuestionRepository,
    RoomRepository,
    AnswerRepository,
    ScoreRepository,
    
    // Services
    BcryptService,
    JwtTokenService,
    
    // Modules
    TypeOrmModule,
    JwtModule, // ✅ Export JwtModule aussi
  ],
})
export class InfrastructureModule {}