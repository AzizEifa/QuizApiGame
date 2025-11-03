// presentation/guards/refresh-token.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from 'src/infra/service/jwt.service';
import { UserRepository } from 'src/infra/repositories/user.repository';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromBody(request);
    
    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      // Vérifier le refresh token avec ton service
      const payload = this.jwtTokenService.verifyRefreshToken(token);
      
      // Vérifier que l'utilisateur existe et a le même refresh token
      const user = await this.userRepository.findById(payload.sub);
      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private extractTokenFromBody(request: any): string | null {
    return request.body?.refreshToken;
  }
}