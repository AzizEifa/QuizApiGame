import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/infra/repositories/user.repository';
import { BcryptService } from 'src/infra/service/Bcrypt.service';
import { JwtTokenService } from 'src/infra/service/jwt.service';
import { LoginDto } from 'src/application/dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.bcryptService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenPair = this.jwtTokenService.generateTokenPair({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.userRepository.updateRefreshToken(user.id, tokenPair.refreshToken);

    const { password: _, refreshToken: __, ...userInfo } = user;
    return {
      user: userInfo,
      ...tokenPair,
    };
  }
  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _, refreshToken: __, ...userInfo } = user;
    return userInfo;
  }
}