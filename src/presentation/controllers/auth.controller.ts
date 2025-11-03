import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor, 
  Get
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiTooManyRequestsResponse 
} from '@nestjs/swagger';
import { LoginDto } from 'src/application/dto/login.dto';
import { LoginService } from 'src/application/use-cases/auth/login.service';
import { RateLimit } from '../decorators/rate-limit.decorator';
import { RateLimitGuard } from '../guards/rate-limit.guard';
import { RegisterDto } from 'src/application/dto/register.dto';
import { RegisterService } from 'src/application/use-cases/auth/register.service';
import { RefreshTokenService } from 'src/application/use-cases/auth/refreshtoken.service';
import { LogoutService } from 'src/application/use-cases/auth/logout.service';
import { RefreshTokenGuard } from '../guards/refreshtoken.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RefreshTokenDto } from 'src/application/dto/refreshtoken.dto';
import { JwtAuthGuard } from '../guards/jwtauth.guard';


@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logoutService: LogoutService,
  ) {}

  @Post('register')
  @RateLimit({ 
    maxAttempts: 3, 
    windowMs: 3600000, // 1 heure
    message: 'Too many registration attempts. Please try again in an hour.' 
  })
  @UseGuards(RateLimitGuard)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiTooManyRequestsResponse({ description: 'Too many registration attempts' })
  async register(@Body() registerDto: RegisterDto) {
    return this.registerService.execute(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @RateLimit({ 
    maxAttempts: 5, 
    windowMs: 60000, // 1 minute
    message: 'Too many login attempts. Please try again in a minute.' 
  })
  @UseGuards(RateLimitGuard)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiTooManyRequestsResponse({ description: 'Too many login attempts' })
  async login(@Body() loginDto: LoginDto) {
    return this.loginService.execute(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @CurrentUser() user: any) {
    return this.refreshTokenService.execute(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@CurrentUser() user: any) {
    return this.logoutService.execute(user.sub);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getProfile(@CurrentUser() user: any) {
    return this.loginService.getProfile(user.sub);
  }
}