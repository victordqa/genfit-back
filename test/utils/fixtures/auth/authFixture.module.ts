import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthFixtureService } from './authFixture.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_IN_S },
      }),
    }),
  ],
  providers: [AuthFixtureService],
})
export class AuthFixtureModule {}
