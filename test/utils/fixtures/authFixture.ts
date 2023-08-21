import { Coach } from '../../../src/typeOrm/entities/Coach';
import { JwtService } from '@nestjs/jwt';

const authFixture = {
  async login(jwtService: JwtService, coach: Coach) {
    const payload = { email: coach.email, sub: coach.id };
    return {
      access_token: jwtService.sign(payload),
    };
  },
};

export default authFixture;
