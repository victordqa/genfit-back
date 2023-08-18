import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CoachesService } from '../../../coaches/services/coaches/coaches.service';
import { compareHashes } from '../../../utils/hashing';

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
        'Email ou senha invalidos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const hashMatch = await compareHashes(password, dbCoach.password);
    if (!hashMatch) {
      throw new HttpException(
        'Email ou senha invalidos',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return dbCoach;
  }

  login(coach: any) {
    const payload = { email: coach.email, sub: coach.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
