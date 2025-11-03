import { config } from 'dotenv';


config({ path: '.env.test' });

jest.setTimeout(10000);

global.testFixtures = {
  user: {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser'
  },
  room: {
    code: 'ABC123',
    maxPlayers: 4
  },
  quiz: {
    id: 'quiz-123',
    title: 'Test Quiz'
  }
};