import {
  Request,
  Body,
  Controller,
  Post,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from 'src/auth/dtos/SignInDto';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/utils/LocalAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const jwt_obj = await this.authService.login(req.user);
    return jwt_obj;
  }
}
