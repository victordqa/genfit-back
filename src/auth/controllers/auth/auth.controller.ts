import { Controller, Post, UseGuards, Inject, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { LocalAuthGuard } from '../../utils/LocalAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    const jwt_obj = await this.authService.login(req.user);
    return jwt_obj;
  }
}
