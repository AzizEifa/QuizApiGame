import { Test } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { RegisterService } from '../../../src/application/use-cases/auth/register.service';
import { UserRepository } from '../../../src/infra/repositories/user.repository';
import { UserRole } from 'src/domain/entities/user.entity';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('RegisterService', () => {
  let registerService: RegisterService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn() as jest.Mock,
            create: jest.fn() as jest.Mock,
          },
        },
      ],
    }).compile();

    registerService = moduleRef.get<RegisterService>(RegisterService);
    userRepository = moduleRef.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create user when email is not taken', async () => {
    // Arrange
    const registerDto = {
      email: 'newuser@example.com',
      password: 'password123',
      username: 'newuser',
    };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(userRepository as any, 'create').mockResolvedValue({
      id: 'user-123',
      ...registerDto,
      password: 'hashedPassword',
      refreshToken: null,
    });

    // Act
    const result = await registerService.execute(registerDto);

    // Assert
    expect(result).toHaveProperty('id');
    expect(result.email).toBe(registerDto.email);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
    expect(userRepository.createAndSave).toHaveBeenCalled();
  });

  it('should throw ConflictException when email already exists', async () => {
    // Arrange
    const registerDto = {
      email: 'existing@example.com',
      password: 'password123',
      username: 'existinguser',
    };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({
      id: 'existing-user',
      email: 'existing@example.com',
      password: 'hashed',
      username: 'existinguser',
      refreshToken: null,
      role: UserRole.USER, 
      hostedRooms: [],
      answers: [],
      scores: [],
    });

    // Act & Assert
    await expect(registerService.execute(registerDto))
      .rejects.toThrow(ConflictException);
      
    expect(userRepository.createAndSave).not.toHaveBeenCalled();
  });
});