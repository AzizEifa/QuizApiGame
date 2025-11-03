// application/services/quiz.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RoomRepository } from 'src/infra/repositories/room.repository';
import { QuestionRepository } from 'src/infra/repositories/question.repository';
import { AnswerRepository } from 'src/infra/repositories/answer.repository';
import { ScoreRepository } from 'src/infra/repositories/score.repository';
import { SubmitAnswerDto } from 'src/application/dto/submitanswer.dto';
import { RoomStatus } from 'src/domain/entities/room.entity';
import { QuizRepository } from 'src/infra/repositories/quiz.repository';

@Injectable()
export class QuizService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly answerRepository: AnswerRepository,
    private readonly scoreRepository: ScoreRepository,
    private readonly quizRepository: QuizRepository,
  ) {}

  async getallquiz(){
    return this.quizRepository.findAll();
  }
  

  async getCurrentQuestion(roomId: string, userId: string) {
    const room = await this.roomRepository.findByCode(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (!room.playerIds.includes(userId)) {
      throw new BadRequestException('You are not in this room');
    }

    if (room.status !== RoomStatus.ACTIVE) {
      throw new BadRequestException('Quiz is not active');
    }

    const questions = await this.questionRepository.findByQuizId(room.quizId);
    
    if (room.currentQuestionIndex >= questions.length) {
      room.status = RoomStatus.FINISHED;
      await this.roomRepository.update(room);
      throw new BadRequestException('Quiz has finished');
    }

    const currentQuestion = questions[room.currentQuestionIndex];
    
    const { correctAnswer, ...questionWithoutAnswer } = currentQuestion;

    return {
      question: questionWithoutAnswer,
      currentQuestion: room.currentQuestionIndex + 1,
      totalQuestions: questions.length,
    };
  }

  async submitAnswer(roomId: string, userId: string, submitAnswerDto: SubmitAnswerDto) {
    const { questionId, answer, timeSpent } = submitAnswerDto;

    // Find room and verify user is in room
    const room = await this.roomRepository.findByCode(roomId);
    if (!room || !room.playerIds.includes(userId)) {
      throw new NotFoundException('Room not found or you are not in this room');
    }

    // Check room status
    if (room.status !== RoomStatus.ACTIVE) {
      throw new BadRequestException('Quiz is not active');
    }

    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const existingAnswer = await this.answerRepository.findByUserAndQuestion(userId, questionId);
    if (existingAnswer) {
      throw new BadRequestException('You have already answered this question');
    }

    const isCorrect = answer === question.correctAnswer;
    
    const basePoints = isCorrect ? question.points : 0;
    const totalPoints = basePoints ;

    await this.answerRepository.create({
      roomId: room.id,
      userId,
      questionId,
      answer,
      isCorrect,
      timeSpent,
    });

    let score = await this.scoreRepository.findByRoomAndUser(room.id, userId);
    if (score) {
      score.totalScore += totalPoints;
      if (isCorrect) score.correctAnswers += 1;
      else score.wrongAnswers += 1;
      await this.scoreRepository.update(score);
    } else {
      score = await this.scoreRepository.create({
        roomId: room.id,
        userId,
        totalScore: totalPoints,
        correctAnswers: isCorrect ? 1 : 0,
        wrongAnswers: isCorrect ? 0 : 1,
      });
    }

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      pointsEarned: totalPoints,
      basePoints,
      currentScore: score.totalScore,
    };
  }

  async getLeaderboard(roomId: string) {
    const room = await this.roomRepository.findByCode(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const scores = await this.scoreRepository.findAllByRoom(room.id);

    const sortedScores = scores
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((score, index) => ({
        ...score,
        rank: index + 1,
      }));

    for (const score of sortedScores) {
      await this.scoreRepository.update(score);
    }

    return sortedScores;
  }

  async nextQuestion(roomId: string, hostId: string) {
    const room = await this.roomRepository.findByCode(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.hostId !== hostId) {
      throw new BadRequestException('Only the host can move to next question');
    }

    const questions = await this.questionRepository.findByQuizId(room.quizId);
    
    if (room.currentQuestionIndex >= questions.length - 1) {
      room.status = RoomStatus.FINISHED;
      await this.roomRepository.update(room);
      return { message: 'Quiz finished', finished: true };
    }

    room.currentQuestionIndex += 1;
    await this.roomRepository.update(room);

    return { 
      message: 'Moved to next question', 
      currentQuestion: room.currentQuestionIndex + 1,
      totalQuestions: questions.length,
      finished: false 
    };
  }

  


  async getQuizById(quizId: string) {
    const quiz = await this.questionRepository.findByQuizId(quizId);
    if (quiz) {
      return quiz;
    }
    
 
    return null;
  }
}