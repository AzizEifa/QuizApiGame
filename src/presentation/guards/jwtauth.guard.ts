// presentation/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/infra/repositories/user.repository';
import { JwtTokenService } from 'src/infra/service/jwt.service';


@Injectable()
export class JwtAuthGuard implements CanActivate { // ✅ Ajoute "implements CanActivate"
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtTokenService.verifyAccessToken(token);
      
      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      request.user = {
        sub: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
      };

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    console.log('Authorization Header:', authHeader); // Debug log
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}