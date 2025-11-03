import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Param,
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
import { SubmitAnswerDto } from 'src/application/dto/submitanswer.dto';
import { QuizService } from 'src/application/use-cases/quiz/quiz.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RateLimit } from '../decorators/rate-limit.decorator';
import { JwtAuthGuard } from '../guards/jwtauth.guard';
import { RateLimitGuard } from '../guards/rate-limit.guard';


@ApiTags('Quiz')
@Controller('quiz')
@UseInterceptors(ClassSerializerInterceptor)

export class QuizController {
  constructor(private readonly quizService: QuizService) {}


  @Get('all')
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiResponse({ status: 200, description: 'List of all quizzes retrieved' })
  async getAllQuizzes() {
    return this.quizService.getallquiz();
  }



  @Get(':id')
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  @ApiOperation({ summary: 'Get quiz details by ID' })
  @ApiResponse({ status: 200, description: 'Quiz details retrieved' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async getQuizById(@Param('id') quizId: string) {
    return this.quizService.getQuizById(quizId);
  }

  @Get('rooms/:roomId/current-question')
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  @RateLimit({ 
    maxAttempts: 30, 
    windowMs: 60000, // 30 requêtes par minute
    message: 'Too many question requests. Please slow down.' 
  })
@ApiBearerAuth('access-token') 
  @ApiParam({ name: 'roomId', description: 'Room ID or code' })
  @ApiOperation({ summary: 'Get current question for a room' })
  @ApiResponse({ status: 200, description: 'Current question retrieved' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 400, description: 'Quiz not active or user not in room' })
  async getCurrentQuestion(
    @Param('roomId') roomId: string,
    @CurrentUser() user: any,
  ) {
    return this.quizService.getCurrentQuestion(roomId, user.sub);
  }

  @Post('rooms/:roomId/answer')
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  @RateLimit({ 
    maxAttempts: 60, 
    windowMs: 60000, // 60 réponses par minute (gameplay rapide)
    message: 'Too many answer submissions. Please wait a moment.' 
  })
@ApiBearerAuth('access-token') 
  @ApiParam({ name: 'roomId', description: 'Room ID or code' })
  @ApiOperation({ summary: 'Submit answer for current question' })
  @ApiResponse({ status: 201, description: 'Answer submitted successfully' })
  @ApiResponse({ status: 404, description: 'Room or question not found' })
  @ApiResponse({ status: 400, description: 'Invalid answer or quiz not active' })
  async submitAnswer(
    @Param('roomId') roomId: string,
    @CurrentUser() user: any,
    @Body() submitAnswerDto: SubmitAnswerDto,
  ) {
    return this.quizService.submitAnswer(roomId, user.sub, submitAnswerDto);
  }

  @Get('rooms/:roomId/leaderboard')
  @UseGuards(JwtAuthGuard, RateLimitGuard)

@ApiBearerAuth('access-token') 
  @ApiParam({ name: 'roomId', description: 'Room ID or code' })
  @ApiOperation({ summary: 'Get leaderboard for a room' })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async getLeaderboard(@Param('roomId') roomId: string) {
    return this.quizService.getLeaderboard(roomId);
  }

  @Post('rooms/:roomId/next-question')
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  @RateLimit({ 
    maxAttempts: 10, 
    windowMs: 60000, // 10 passages à la question suivante par minute
    message: 'Too many next question requests.' 
  })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'roomId', description: 'Room ID or code' })
  @ApiOperation({ summary: 'Move to next question (host only)' })
  @ApiResponse({ status: 200, description: 'Moved to next question' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 403, description: 'Only host can perform this action' })
  async nextQuestion(
    @Param('roomId') roomId: string,
    @CurrentUser() user: any,
  ) {
    return this.quizService.nextQuestion(roomId, user.sub);
  }

}