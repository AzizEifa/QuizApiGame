// infrastructure/repositories/room.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../domain/entities/room.entity';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectRepository(Room)
    private readonly repo: Repository<Room>,
  ) {}

  async findByCode(code: string) {
    return this.repo.findOne({ 
      where: { code }, 
      relations: ['quiz', 'host'] 
    });
  }
  async findall(){
    return this.repo.find();
  }

  async create(room: Partial<Room>) {
    const entity = this.repo.create(room);
    return this.repo.save(entity);
  }

  async update(room: Room) {
    return this.repo.save(room);
  }

  async addPlayer(room: Room, userId: string) {
    if (!room.playerIds) room.playerIds = [];
    room.playerIds.push(userId);
    return this.repo.save(room);
  }

  async removePlayer(room: Room, userId: string) {
    if (!room.playerIds) return room;
    room.playerIds = room.playerIds.filter(id => id !== userId);
    return this.repo.save(room);
  }
}