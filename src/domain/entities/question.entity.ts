
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Answer } from './answer.entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false'
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quizId: string;

  @ManyToOne(() => Quiz, quiz => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column('text')
  text: string;

  @Column({ type: 'enum', enum: QuestionType, default: QuestionType.MULTIPLE_CHOICE })
  type: QuestionType;

  @Column('simple-array')
  options: string[];

  @Column()
  correctAnswer: string;

  @Column({ type: 'int', default: 10 })
  points: number;

  @Column({ type: 'int' })
  order: number;

  @OneToMany(() => Answer, answer => answer.question)
  answers: Answer[];
}