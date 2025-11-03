// infrastructure/repositories/answer.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../../domain/entities/answer.entity';

@Injectable()
export class AnswerRepository {
  constructor(
    @InjectRepository(Answer)
    private readonly repo: Repository<Answer>,
  ) {}

  findByUserAndQuestion(userId: string, questionId: string) {
    return this.repo.findOne({ 
      where: { userId, questionId } 
    });
  }

  findByUserAndRoom(userId: string, roomId: string) {
    return this.repo.find({ 
      where: { userId, roomId },
      order: { submittedAt: 'ASC' }
    });
  }

  findByRoom(roomId: string) {
    return this.repo.find({ 
      where: { roomId },
      relations: ['question', 'user'],
      order: { submittedAt: 'ASC' }
    });
  }

  countByRoom(roomId: string) {
    return this.repo.count({ where: { roomId } });
  }

  create(answer: Partial<Answer>) {
    const entity = this.repo.create(answer);
    return this.repo.save(entity);
  }

  update(answer: Answer) {
    return this.repo.save(answer);
  }
  
}