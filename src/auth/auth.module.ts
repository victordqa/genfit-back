import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { CoachesService } from 'src/coaches/services/coaches/coaches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from 'src/typeOrm/entities/Coach';
import { Box } from 'src/typeOrm/entities/Box';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './utils/LocalStrategy';
import { CoachesModule } from 'src/coaches/coaches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coach, Box]),
    PassportModule,
    CoachesModule,
  ],
  controllers: [AuthController],
  providers: [
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    LocalStrategy,
  ],
})
export class AuthModule {}
