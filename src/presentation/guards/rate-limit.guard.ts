import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_METADATA, RateLimitOptions } from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private attempts = new Map<string, number[]>();
  
  private readonly defaultConfig: Required<RateLimitOptions> = {
    maxAttempts: 10,
    windowMs: 60000, // 1 minute
    message: 'Too many requests, please try again later.'
  };

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const config = this.getRateLimitConfig(context);
    
    const key = this.generateKey(context, request);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    this.cleanOldAttempts(key, windowStart);

    const userAttempts = this.attempts.get(key) || [];
    
    if (userAttempts.length >= config.maxAttempts) {
      const retryAfter = Math.ceil((userAttempts[0] + config.windowMs - now) / 1000);
      
      response.header('Retry-After', retryAfter.toString());
      
      throw new HttpException(
        {
          success: false,
          error: {
            message: config.message,
            retryAfter: `${retryAfter} seconds`,
            limit: config.maxAttempts,
            window: `${config.windowMs / 1000} seconds`
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    userAttempts.push(now);
    this.attempts.set(key, userAttempts);

    response.header('X-RateLimit-Limit', config.maxAttempts.toString());
    response.header('X-RateLimit-Remaining', (config.maxAttempts - userAttempts.length).toString());
    response.header('X-RateLimit-Reset', (now + config.windowMs).toString());

    return true;
  }

  private generateKey(context: ExecutionContext, request: any): string {
    const user = request.user;
    const handler = context.getHandler().name;
    const classRef = context.getClass().name;
    
    // Si l'utilisateur est authentifié, utiliser son ID
    if (user && user.sub) {
      return `rate_${classRef}_${handler}_user_${user.sub}`;
    }
    
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    return `rate_${classRef}_${handler}_ip_${ip}`;
  }

  private cleanOldAttempts(key: string, windowStart: number): void {
    const userAttempts = this.attempts.get(key);
    if (userAttempts) {
      const recentAttempts = userAttempts.filter(timestamp => timestamp > windowStart);
      if (recentAttempts.length === 0) {
        this.attempts.delete(key);
      } else {
        this.attempts.set(key, recentAttempts);
      }
    }
  }

  private getRateLimitConfig(context: ExecutionContext): Required<RateLimitOptions> {
    const customConfig = this.reflector.get<RateLimitOptions | undefined>(
      RATE_LIMIT_METADATA, 
      context.getHandler()
    ) || this.reflector.get<RateLimitOptions | undefined>(
      RATE_LIMIT_METADATA, 
      context.getClass()
    );

    return {
      maxAttempts: customConfig?.maxAttempts ?? this.defaultConfig.maxAttempts,
      windowMs: customConfig?.windowMs ?? this.defaultConfig.windowMs,
      message: customConfig?.message ?? this.defaultConfig.message,
    };
  }
}