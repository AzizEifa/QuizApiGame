// infrastructure/repositories/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../domain/entities/question.entity';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly repo: Repository<Question>,
  ) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByQuizId(quizId: string) {
    return this.repo.find({ 
      where: { quizId },
      order: { order: 'ASC' }
    });
  }

  create(question: Partial<Question>) {
    const entity = this.repo.create(question);
    return this.repo.save(entity);
  }
}