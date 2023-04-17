import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CoachesService } from 'src/coaches/services/coaches/coaches.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('COACHES_SERVICE') private readonly coachesService: CoachesService,
  ) {}
  async validateCoach(email: string, password: string) {
    const dbCoach = await this.coachesService.findCoachByEmail(email);

    if (!dbCoach || password !== dbCoach.password) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {};
  }
}
