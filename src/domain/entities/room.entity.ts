import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Quiz } from './quiz.entity';
import { Answer } from './answer.entity';
import { Score } from './score.entity';

export enum RoomStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  FINISHED = 'finished'
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 6 })
  code: string;

  @Column({ type: 'uuid' })
  quizId: string;

  @ManyToOne(() => Quiz, quiz => quiz.rooms)
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column({ type: 'uuid' })
  hostId: string;

  @ManyToOne(() => User, user => user.hostedRooms)
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column({ type: 'enum', enum: RoomStatus, default: RoomStatus.WAITING })
  status: RoomStatus;

  @Column({ type: 'int', default: 10 })
  maxPlayers: number;

  @Column({ type: 'simple-array', default: '' })
  playerIds: string[];

  @Column({ type: 'int', default: 0 })
  currentQuestionIndex: number;

  @OneToMany(() => Answer, answer => answer.room)
  answers: Answer[];

  @OneToMany(() => Score, score => score.room)
  scores: Score[];

  @CreateDateColumn()
  createdAt: Date;
}