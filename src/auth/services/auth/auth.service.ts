import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CoachesService } from 'src/coaches/services/coaches/coaches.service';
import { compareHashes, hashPassword } from 'src/utils/hashing';

@Injectable()
export class AuthService {
  constructor(
    private coachesService: CoachesService,
    private jwtService: JwtService,
  ) {}
  async validateCoach(email: string, password: string) {
    const dbCoach = await this.coachesService.findCoachByEmail(email);

    if (!dbCoach) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hashMatch = await compareHashes(password, dbCoach.password);
    if (!hashMatch) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
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
