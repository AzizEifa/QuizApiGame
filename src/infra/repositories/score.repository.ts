// infrastructure/repositories/score.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '../../domain/entities/score.entity';

@Injectable()
export class ScoreRepository {
  constructor(
    @InjectRepository(Score)
    private readonly repo: Repository<Score>,
  ) {}

  findByRoomAndUser(roomId: string, userId: string) {
    return this.repo.findOne({ 
      where: { roomId, userId } 
    });
  }

  findAllByRoom(roomId: string) {
    return this.repo.find({ 
      where: { roomId },
      order: { totalScore: 'DESC' }
    });
  }

  create(score: Partial<Score>) {
    const entity = this.repo.create(score);
    return this.repo.save(entity);
  }

  update(score: Score) {
    return this.repo.save(score);
  }
}