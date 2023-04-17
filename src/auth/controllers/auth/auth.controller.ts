import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from 'src/auth/dtos/SignInDto';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    console.log('from controller', signInDto);
    const { email, password } = signInDto;
    return { message: 'logged in' };
  }
}
