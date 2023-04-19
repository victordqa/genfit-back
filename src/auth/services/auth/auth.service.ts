import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CoachesService } from 'src/coaches/services/coaches/coaches.service';

@Injectable()
export class AuthService {
  constructor(
    private coachesService: CoachesService,
    private jwtService: JwtService,
  ) {}
  async validateCoach(email: string, password: string) {
    const dbCoach = await this.coachesService.findCoachByEmail(email);

    if (!dbCoach || password !== dbCoach.password) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return dbCoach;
  }

  async login(coach: any) {
    // TODO: create user credentials type
    const payload = { email: coach.email, sub: coach.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
