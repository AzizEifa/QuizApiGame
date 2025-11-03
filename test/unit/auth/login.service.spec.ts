import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LoginService } from '../../../src/application/use-cases/auth/login.service';
import { UserRepository } from '../../../src/infra/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../../src/domain/entities/user.entity'; // Import UserRole enum

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('LoginService', () => {
  let loginService: LoginService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
    username: 'testuser',
    refreshToken: null,
    role: UserRole.USER, // Use the correct enum value
    hostedRooms: [],
    answers: [],
    scores: [],
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('jwt-token'),
          },
        },
      ],
    }).compile();

    loginService = moduleRef.get<LoginService>(LoginService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tokens when credentials are valid', async () => {
      // Arrange
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const bcrypt = require('bcrypt');
      
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'updateRefreshToken').mockResolvedValue();
      bcrypt.compare.mockResolvedValue(true);

      // Act
      const result = await loginService.execute(loginDto);

      // Assert
      expect(result).toEqual({
        accessToken: 'jwt-token',
        refreshToken: 'jwt-token',
      });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(userRepository.updateRefreshToken).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      const bcrypt = require('bcrypt');
      
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(loginService.execute(loginDto))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      const loginDto = { email: 'nonexistent@example.com', password: 'password123' };
      
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);

      // Act & Assert
      await expect(loginService.execute(loginDto))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});