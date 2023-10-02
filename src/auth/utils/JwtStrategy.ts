import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req?.cookies?.accessToken && req.cookies.accessToken.length > 0) {
      return req.cookies.accessToken;
    }
    return null;
  }

  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email };
  }
}
