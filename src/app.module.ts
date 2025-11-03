// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';
import { getTypeOrmConfig } from './infra/database-config/typeorm.config';
import { InfrastructureModule } from './infra/infra.module';

@Module({
  imports: [
    // ✅ ConfigModule global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // ✅ TypeOrmModule avec imports explicite
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ✅ Ajoute cette ligne
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    
    // Nos modules
    InfrastructureModule,
    ApplicationModule, 
    PresentationModule,
  ],
})
export class AppModule {}
