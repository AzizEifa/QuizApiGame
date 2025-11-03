
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import {Room} from './room.entity';
import { Answer } from './answer.entity';
import { Score } from './score.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
  @Column({ name: 'refresh_token', type: 'varchar', nullable: true, length: 500 })
refreshToken: string | null;


  @OneToMany(() => Room, room => room.host)
  hostedRooms: Room[];

  @OneToMany(() => Answer, answer => answer.user)
  answers: Answer[];

  @OneToMany(() => Score, score => score.user)
  scores: Score[];

}