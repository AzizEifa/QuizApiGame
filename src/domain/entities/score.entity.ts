import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  roomId: string;

  @ManyToOne(() => Room, room => room.scores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.scores)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', default: 0 })
  totalScore: number;

  @Column({ type: 'int', default: 0 })
  correctAnswers: number;

  @Column({ type: 'int', default: 0 })
  wrongAnswers: number;

  @Column({ type: 'int', default: 0 })
  rank: number;

  @CreateDateColumn()
  completedAt: Date;
}