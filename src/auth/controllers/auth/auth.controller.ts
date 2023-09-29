import {
  Controller,
  Post,
  UseGuards,
  Inject,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { LocalAuthGuard } from '../../utils/LocalAuthGuard';
import { Coach } from '../../../typeOrm/entities/Coach';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const coach = req.user as Coach;
    const jwt_obj = this.authService.login(coach);
    const jwtExp = this.configService.get<string>('JWT_EXPIRATION_IN_S');

    res.cookie('accessToken', jwt_obj.access_token, {
      expires: new Date(
        new Date().getTime() + Number.parseInt(jwtExp.split('s')[0]) * 1000,
      ),
      sameSite: 'strict',
      httpOnly: true,
      secure: true,
    });

    return res.send({
      accessToken: jwt_obj.access_token,
      coach: { name: coach.name, email: coach.email, id: coach.id },
    });
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.cookie('accessToken', 'none', {
      expires: new Date(new Date().getTime() + 3 * 1000),
      sameSite: 'strict',
      httpOnly: true,
      secure: true,
    });

    return res.send({
      message: 'Logout bem sucedido',
    });
  }
}
