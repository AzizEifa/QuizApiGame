import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Get, 
  Param, 
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam 
} from '@nestjs/swagger';
import { CreateRoomDto } from 'src/application/dto/createroom.dto';
import { JoinRoomDto } from 'src/application/dto/joinroom.dto';
import { RoomService } from 'src/application/use-cases/room/room.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RateLimit } from '../decorators/rate-limit.decorator';
import { JwtAuthGuard } from '../guards/jwtauth.guard';
import { RateLimitGuard } from '../guards/rate-limit.guard';


@ApiTags('Rooms')
@Controller('rooms')
@UseGuards(JwtAuthGuard) 
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth('access-token') 
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @RateLimit({ 
    maxAttempts: 5, 
    windowMs: 60000, // 5 rooms par minute
    message: 'Too many rooms created. Please wait a moment.' 
  })
  @UseGuards(RateLimitGuard)
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async createRoom(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: any) {
    return this.roomService.createRoom(createRoomDto, user.sub);
  }

  @Post('join')
  @RateLimit({ 
    maxAttempts: 10, 
    windowMs: 60000, // 10 joins par minute
    message: 'Too many room join attempts. Please slow down.' 
  })
  @UseGuards(RateLimitGuard)
  @ApiOperation({ summary: 'Join an existing room' })
  @ApiResponse({ status: 200, description: 'Joined room successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 400, description: 'Room full or not accepting players' })
  async joinRoom(@Body() joinRoomDto: JoinRoomDto, @CurrentUser() user: any) {
    return this.roomService.joinRoom(joinRoomDto, user.sub);
  }

  @Post(':id/start')
  @ApiParam({ name: 'id', description: 'Room ID or code' })
  @ApiOperation({ summary: 'Start the quiz in a room' })
  @ApiResponse({ status: 200, description: 'Quiz started successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 400, description: 'Only host can start or not enough players' })
  async startQuiz(@Param('id') roomId: string, @CurrentUser() user: any) {
    return this.roomService.startQuiz(roomId, user.sub);
  }

  @Delete(':id/leave')
  @ApiParam({ name: 'id', description: 'Room ID or code' })
  @ApiOperation({ summary: 'Leave a room' })
  @ApiResponse({ status: 200, description: 'Left room successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async leaveRoom(@Param('id') roomId: string, @CurrentUser() user: any) {
    return this.roomService.leaveRoom(roomId, user.sub);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Room ID or code' })
  @ApiOperation({ summary: 'Get room information' })
  @ApiResponse({ status: 200, description: 'Room information retrieved' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async getRoom(@Param('id') roomId: string) {
    return this.roomService.getRoom(roomId);
  }

}