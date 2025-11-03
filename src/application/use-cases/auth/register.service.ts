import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from 'src/infra/repositories/user.repository';
import { BcryptService } from 'src/infra/service/Bcrypt.service';
import { RegisterDto } from 'src/application/dto/register.dto';
import { UserRole } from 'src/domain/entities/user.entity';

@Injectable()
export class RegisterService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existingUsername = await this.userRepository.findByEmail(username);
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    
    const hashedPassword = await this.bcryptService.hash(password);

    const user = await this.userRepository.createAndSave({
      email,
      username,
      password: hashedPassword,
      role: UserRole.USER,
    });
    

    const { password: _, ...result } = user;
    return result;
  }
}