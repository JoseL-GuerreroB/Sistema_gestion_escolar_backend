import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export default class PasswordTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-pass',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_PASSWORD,
    });
  }

  validate(payload: any) {
    return payload;
  }
}
