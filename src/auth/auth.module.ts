import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from 'src/typeOrm/entities/Coach';
import { Box } from 'src/typeOrm/entities/Box';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './utils/LocalStrategy';
import { CoachesModule } from 'src/coaches/coaches.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/JwtStrategy';

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
