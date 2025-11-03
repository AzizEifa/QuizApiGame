import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../../dto/refreshtoken.dto';
import { UserRepository } from 'src/infra/repositories/user.repository';
import { JwtTokenService } from 'src/infra/service/jwt.service';
@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtTokenService.verifyRefreshToken(refreshToken);
      
      const user = await this.userRepository.findById(payload.sub);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtTokenService.generateAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}