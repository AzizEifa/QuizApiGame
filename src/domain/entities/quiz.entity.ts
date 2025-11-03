
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Question } from './question.entity';
import { Room } from './room.entity';

export enum QuizDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column({ type: 'enum', enum: QuizDifficulty, default: QuizDifficulty.MEDIUM })
  difficulty: QuizDifficulty;

  @Column({ type: 'int', default: 30 })
  timeLimit: number; // seconds per question

  @OneToMany(() => Question, question => question.quiz, { cascade: true })
  questions: Question[];

  @OneToMany(() => Room, room => room.quiz)
  rooms: Room[];

  @CreateDateColumn()
  createdAt: Date;
}