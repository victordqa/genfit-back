import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachesModule } from '../coaches/coaches.module';
import { Box } from '../typeOrm/entities/Box';
import { Coach } from '../typeOrm/entities/Coach';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtStrategy } from './utils/JwtStrategy';
import { LocalStrategy } from './utils/LocalStrategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coach, Box]),
    PassportModule,
    CoachesModule,

    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_IN_S },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
