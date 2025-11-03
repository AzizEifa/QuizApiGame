import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';
import { Question } from './question.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  roomId: string;

  @ManyToOne(() => Room, room => room.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.answers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Question, question => question.answers)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column()
  answer: string;

  @Column({ type: 'boolean' })
  isCorrect: boolean;

  @Column({ type: 'int' })
  timeSpent: number; // milliseconds

  @CreateDateColumn()
  submittedAt: Date;
}