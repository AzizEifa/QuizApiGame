import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Answer } from 'src/domain/entities/answer.entity';
import { Question } from 'src/domain/entities/question.entity';
import { Quiz } from 'src/domain/entities/quiz.entity';
import { Room } from 'src/domain/entities/room.entity';
import { Score } from 'src/domain/entities/score.entity';
import { User } from 'src/domain/entities/user.entity';


export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'), 
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [User, Quiz, Question, Room, Answer, Score],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  logging: configService.get<string>('NODE_ENV') === 'development' ? ['error', 'warn', 'schema'] : ['error'],
  ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  autoLoadEntities: true,
  retryAttempts: 3,
  retryDelay: 3000,
  poolSize: 10,
});

export const dataSourceOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || '25061314',
  database: process.env.DATABASE_NAME || 'quiz_game',
  entities: [User, Quiz, Question, Room, Answer, Score],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
};