import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthFixtureService {
  constructor(private jwtService: JwtService) {}

  login(coach: any) {
    const payload = { email: coach.email, sub: coach.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
