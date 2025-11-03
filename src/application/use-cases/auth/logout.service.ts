import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/infra/repositories/user.repository';
@Injectable()
export class LogoutService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string) {

    await this.userRepository.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }
}