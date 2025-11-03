// infrastructure/repositories/quiz.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../../domain/entities/quiz.entity';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectRepository(Quiz)
    private readonly repo: Repository<Quiz>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findWithQuestions(id: string) {
    return this.repo.findOne({ 
      where: { id }, 
      relations: ['questions'] 
    });
  }

  createAndSave(quiz: Partial<Quiz>) {
    const entity = this.repo.create(quiz);
    return this.repo.save(entity);
  }
}