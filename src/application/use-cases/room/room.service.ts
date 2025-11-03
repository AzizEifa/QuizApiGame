import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RoomRepository } from 'src/infra/repositories/room.repository';
import { QuizRepository } from 'src/infra/repositories/quiz.repository';
import { CreateRoomDto } from 'src/application/dto/createroom.dto';
import { JoinRoomDto } from 'src/application/dto/joinroom.dto';
import { RoomStatus } from 'src/domain/entities/room.entity';
@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly quizRepository: QuizRepository,
  ) {}

  
  async createRoom(createRoomDto: CreateRoomDto, hostId: string) {
    const { quizId, maxPlayers } = createRoomDto;

    
    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

   
    const code = this.generateRoomCode();

    
    const room = await this.roomRepository.create({
      code,
      quizId,
      hostId,
      maxPlayers,
      playerIds: [hostId],
      status: RoomStatus.WAITING,
      currentQuestionIndex: 0,
    });

    return room;
  }

  
  async joinRoom(joinRoomDto: JoinRoomDto, userId: string) {
    const { code } = joinRoomDto;

    
    const room = await this.roomRepository.findByCode(code);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.status !== RoomStatus.WAITING) {
      throw new BadRequestException('Room is not accepting players');
    }

   
    if (room.playerIds.includes(userId)) {
      throw new BadRequestException('You are already in this room');
    }

   
    if (room.playerIds.length >= room.maxPlayers) {
      throw new BadRequestException('Room is full');
    }

    
    await this.roomRepository.addPlayer(room, userId);

    return { message: 'Joined room successfully', room };
  }

 
  async leaveRoom(roomId: string, userId: string) {
    
    const room = await this.roomRepository.findByCode(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    
    await this.roomRepository.removePlayer(room, userId);

  
    if (room.playerIds.length === 0 || room.hostId === userId) {
      
      return { message: 'Left room and room was deleted' };
    }

    return { message: 'Left room successfully' };
  }

  async startQuiz(roomId: string, hostId: string) {
    const room = await this.roomRepository.findByCode(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.hostId !== hostId) {
      throw new BadRequestException('Only the host can start the quiz');
    }

    
    if (room.status !== RoomStatus.WAITING) {
      throw new BadRequestException('Quiz has already started or finished');
    }

    if (room.playerIds.length < 2) {
      throw new BadRequestException('Need at least 2 players to start');
    }

    room.status = RoomStatus.ACTIVE;
    await this.roomRepository.update(room);

    return { message: 'Quiz started successfully', room };
  }

  async getRoom(roomId: string) {
    const room = await this.roomRepository.findByCode(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  private generateRoomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}