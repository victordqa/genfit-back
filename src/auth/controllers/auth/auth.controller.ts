import { Controller, Post, UseGuards, Inject, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { LocalAuthGuard } from '../../utils/LocalAuthGuard';
import { Coach } from '../../../typeOrm/entities/Coach';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const coach = req.user as Coach;
    const jwt_obj = await this.authService.login(coach);

    res.cookie('accessToken', jwt_obj, {
      expires: new Date(
        new Date().getTime() +
          Number.parseInt(process.env.JWT_EXPIRATION_IN_S.split('s')[0]) * 1000,
      ),
      sameSite: 'strict',
      httpOnly: true,
    });

    return res.send({
      jwt_obj,
      coach: { name: coach.name, email: coach.email, id: coach.id },
    });
  }
}
