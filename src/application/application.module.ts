import { Module } from '@nestjs/common';
import { RoomService } from './use-cases/room/room.service';
import { QuizService } from './use-cases/quiz/quiz.service';
import { LoginService } from './use-cases/auth/login.service';
import { RegisterService } from './use-cases/auth/register.service';
import { RefreshTokenService } from './use-cases/auth/refreshtoken.service';
import { LogoutService } from './use-cases/auth/logout.service';
import { InfrastructureModule } from 'src/infra/infra.module';

@Module({
    imports: [InfrastructureModule],
    providers: [ 
        QuizService,
        RoomService,
        LoginService,
        RegisterService,
        RefreshTokenService,
        LogoutService
        
    ],
    exports: [    QuizService,
        RoomService,
        LoginService,
        RegisterService,
        RefreshTokenService,
        LogoutService],
})
export class ApplicationModule {}
