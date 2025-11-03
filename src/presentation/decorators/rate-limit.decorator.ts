import { SetMetadata } from '@nestjs/common';

export interface RateLimitOptions {
  maxAttempts?: number;
  windowMs?: number;
  message?: string;
}

export const RATE_LIMIT_METADATA = 'rateLimit';

export const RateLimit = (options: RateLimitOptions = {}) => {
  return SetMetadata(RATE_LIMIT_METADATA, {
    maxAttempts: options.maxAttempts || 10,
    windowMs: options.windowMs || 60000, // 1 minute par défaut
    message: options.message || 'Too many requests, please try again later.'
  });
};