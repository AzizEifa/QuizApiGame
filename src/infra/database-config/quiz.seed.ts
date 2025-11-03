import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz, QuizDifficulty } from 'src/domain/entities/quiz.entity';
import { Question, QuestionType } from 'src/domain/entities/question.entity';

@Injectable()
export class QuizSeeder {
  private readonly logger = new Logger(QuizSeeder.name);

  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async seed() {
    const existingQuizzes = await this.quizRepository.count();
    if (existingQuizzes > 0) {
      this.logger.log('Quizzes already seeded');
      return;
    }

    this.logger.log('Starting quiz seeding...');

    // Quiz 1: General Knowledge
    const quiz1 = await this.quizRepository.save({
      title: 'General Knowledge Challenge',
      description: 'Test your general knowledge with this diverse quiz covering history, geography, and culture',
      category: 'General Knowledge',
      difficulty: QuizDifficulty.MEDIUM,
      timeLimit: 30,
    });

    const questions1 = [
      {
        quizId: quiz1.id,
        text: 'What is the capital of France?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['London', 'Paris', 'Berlin', 'Madrid'],
        correctAnswer: 'Paris',
        points: 10,
        order: 1,
      },
      {
        quizId: quiz1.id,
        text: 'Which planet is known as the Red Planet?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
        points: 10,
        order: 2,
      },
      {
        quizId: quiz1.id,
        text: 'The Great Wall of China is visible from space with the naked eye.',
        type: QuestionType.TRUE_FALSE,
        options: ['True', 'False'],
        correctAnswer: 'False',
        points: 10,
        order: 3,
      },
      {
        quizId: quiz1.id,
        text: 'Who painted the Mona Lisa?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
        correctAnswer: 'Leonardo da Vinci',
        points: 10,
        order: 4,
      },
      {
        quizId: quiz1.id,
        text: 'What is the largest ocean on Earth?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 'Pacific Ocean',
        points: 10,
        order: 5,
      },
      {
        quizId: quiz1.id,
        text: 'Mount Everest is located in which mountain range?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Alps', 'Andes', 'Himalayas', 'Rockies'],
        correctAnswer: 'Himalayas',
        points: 10,
        order: 6,
      },
      {
        quizId: quiz1.id,
        text: 'The Eiffel Tower was originally intended to be a permanent structure.',
        type: QuestionType.TRUE_FALSE,
        options: ['True', 'False'],
        correctAnswer: 'False',
        points: 10,
        order: 7,
      },
      {
        quizId: quiz1.id,
        text: 'Which country is known as the Land of the Rising Sun?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['China', 'Japan', 'Thailand', 'South Korea'],
        correctAnswer: 'Japan',
        points: 10,
        order: 8,
      },
      {
        quizId: quiz1.id,
        text: 'What is the smallest country in the world?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
        correctAnswer: 'Vatican City',
        points: 10,
        order: 9,
      },
      {
        quizId: quiz1.id,
        text: 'The Amazon River is longer than the Nile River.',
        type: QuestionType.TRUE_FALSE,
        options: ['True', 'False'],
        correctAnswer: 'False',
        points: 10,
        order: 10,
      },
    ];

    await this.questionRepository.save(questions1);
    this.logger.log(`Created quiz: ${quiz1.title} with ${questions1.length} questions`);

    // Quiz 2: Science & Technology
    const quiz2 = await this.quizRepository.save({
      title: 'Science & Technology Trivia',
      description: 'Challenge your knowledge of scientific discoveries and technological innovations',
      category: 'Science',
      difficulty: QuizDifficulty.HARD,
      timeLimit: 45,
    });

    const questions2 = [
      {
        quizId: quiz2.id,
        text: 'What does DNA stand for?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Deoxyribonucleic Acid', 'Dynamic Nuclear Acid', 'Dual Nitrogen Acid', 'Digital Neural Array'],
        correctAnswer: 'Deoxyribonucleic Acid',
        points: 15,
        order: 1,
      },
      {
        quizId: quiz2.id,
        text: 'Which programming language is known as the "mother of all languages"?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['C', 'Assembly', 'FORTRAN', 'COBOL'],
        correctAnswer: 'C',
        points: 15,
        order: 2,
      },
      {
        quizId: quiz2.id,
        text: 'The speed of light is approximately 300,000 km/s.',
        type: QuestionType.TRUE_FALSE,
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 15,
        order: 3,
      },
      {
        quizId: quiz2.id,
        text: 'Who is credited with inventing the World Wide Web?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Mark Zuckerberg'],
        correctAnswer: 'Tim Berners-Lee',
        points: 15,
        order: 4,
      },
      {
        quizId: quiz2.id,
        text: 'What is the powerhouse of the cell?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
        correctAnswer: 'Mitochondria',
        points: 15,
        order: 5,
      },
      {
        quizId: quiz2.id,
        text: 'Artificial Intelligence was first coined as a term in the 21st century.',
        type: QuestionType.TRUE_FALSE,
        options: ['True', 'False'],
        correctAnswer: 'False',
        points: 15,
        order: 6,
      },
      {
        quizId: quiz2.id,
        text: 'What is the most abundant element in the universe?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Oxygen', 'Carbon', 'Hydrogen', 'Helium'],
        correctAnswer: 'Hydrogen',
        points: 15,
        order: 7,
      },
      {
        quizId: quiz2.id,
        text: 'Which planet in our solar system has the most moons?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        correctAnswer: 'Saturn',
        points: 15,
        order: 8,
      },
    ];

    await this.questionRepository.save(questions2);
    this.logger.log(`Created quiz: ${quiz2.title} with ${questions2.length} questions`);

    // Quiz 3: Pop Culture
    const quiz3 = await this.quizRepository.save({
      title: 'Pop Culture Quiz',
      description: 'How well do you know movies, music, and entertainment?',
      category: 'Entertainment',
      difficulty: QuizDifficulty.EASY,
      timeLimit: 20,
    });

    const questions3 = [
      {
        quizId: quiz3.id,
        text: 'Which movie won the Academy Award for Best Picture in 2020?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['1917', 'Joker', 'Parasite', 'Once Upon a Time in Hollywood'],
        correctAnswer: 'Parasite',
        points: 10,
        order: 1,
      },
      {
        quizId: quiz3.id,
        text: 'Taylor Swift released her album "1989" in 2014.',
        type: QuestionType.TRUE_FALSE,
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 10,
        order: 2,
      },
      {
        quizId: quiz3.id,
        text: 'Who played Iron Man in the Marvel Cinematic Universe?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo'],
        correctAnswer: 'Robert Downey Jr.',
        points: 10,
        order: 3,
      },
      {
        quizId: quiz3.id,
        text: 'Which streaming service produced "Stranger Things"?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Netflix', 'Disney+', 'HBO Max', 'Amazon Prime'],
        correctAnswer: 'Netflix',
        points: 10,
        order: 4,
      },
      {
        quizId: quiz3.id,
        text: 'The Beatles were from Liverpool, England.',
        type: QuestionType.TRUE_FALSE,
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 10,
        order: 5,
      },
      {
        quizId: quiz3.id,
        text: 'Which social media platform uses a bird as its logo?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Facebook', 'Instagram', 'Twitter', 'TikTok'],
        correctAnswer: 'Twitter',
        points: 10,
        order: 6,
      },
    ];

    await this.questionRepository.save(questions3);
    this.logger.log(`Created quiz: ${quiz3.title} with ${questions3.length} questions`);

    this.logger.log('Quiz seeding completed successfully!');
  }
}