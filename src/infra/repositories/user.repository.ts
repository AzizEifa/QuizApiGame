// ✅ Nouvelle méthode - Utilise l'injection NestJS
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  
  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async createAndSave(user: Partial<User>) {
    const entity = this.repo.create(user);
    return this.repo.save(entity);
  }

async updateRefreshToken(userId: string, refreshToken: string | null) {
  await this.repo.update(
    { id: userId },
    { refreshToken } as any
  );
}
}