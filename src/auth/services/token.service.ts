import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export default class TokenService {
  constructor(
    private JWTService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateToken(
    id: number,
    secondLevel: string,
    thirdLevel: string,
    roles: any[],
  ) {
    const JwtPayload: object = {
      id,
      secondLevel,
      roles: roles.map((role) => role.role),
    };
    if (thirdLevel) JwtPayload['thirdLevel'] = thirdLevel;
    return await this.JWTService.signAsync(JwtPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(
    id: number,
    secondLevel: string,
    thirdLevel: string | null,
    roles: string[],
    res: Response,
  ) {
    const JwtPayload: object = {
      id,
      secondLevel,
      roles,
    };
    if (thirdLevel !== null) JwtPayload['thirdLevel'] = thirdLevel;
    const refreshToken = await this.JWTService.signAsync(JwtPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
  }

  async generateTokenPassword(id: number) {
    const JwtPayload: object = {
      id,
    };
    return await this.JWTService.signAsync(JwtPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '5m',
    });
  }
}
