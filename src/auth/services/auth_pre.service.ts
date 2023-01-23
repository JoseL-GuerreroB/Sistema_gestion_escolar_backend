import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { encryptPassword } from '../helpers/bcrypt';
import { usernameAndEmailAlreadyRegistered } from '../helpers/validators/validators_user';
import { Response } from 'express';

import { TypesUsers } from '../entities/type_atr.entity';
import Users from '../entities/user.entity';

@Injectable()
export default class AuthPreservice {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(TypesUsers)
    private typesUsersRepository: Repository<TypesUsers>,
  ) {}

  async Create_User(newUser: any, type_user: number) {
    await usernameAndEmailAlreadyRegistered(
      this.usersRepository,
      newUser.username,
      newUser.email,
    );
    let user = newUser;
    user.password = await encryptPassword(newUser.password);
    const typeUser = await this.typesUsersRepository.findOne({
      where: {
        id: type_user,
      },
    });
    if (!typeUser)
      throw new HttpException(
        'Tipo de usuario no registrado',
        HttpStatus.NOT_FOUND,
      );
    user['type_user'] = typeUser;
    user = this.usersRepository.create(user);
    return await this.usersRepository.save(user);
  }

  async Find_User_for_Change_Password(
    username: string,
    email: string,
    phone: string,
  ) {
    const user = await this.usersRepository.findOne({
      select: ['id'],
      where: {
        username,
        email,
        phone,
      },
    });
    if (!user)
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    return user;
  }

  async Change_Password(id: number, dataPassword: string) {
    const password = await encryptPassword(dataPassword);
    await this.usersRepository.update({ id }, { password });
  }

  async generateToken(id: number, secondLevel: string, thirdLevel: string) {
    const JwtPayload: object = {
      id,
      secondLevel,
    };
    if (thirdLevel) JwtPayload['thirdLevel'] = thirdLevel;
    return await this.jwtService.signAsync(JwtPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(
    id: number,
    secondLevel: string,
    thirdLevel: string | null,
    res: Response,
  ) {
    const JwtPayload: object = {
      id,
      secondLevel,
    };
    if (thirdLevel !== null) JwtPayload['thirdLevel'] = thirdLevel;
    const refreshToken = await this.jwtService.signAsync(JwtPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
  }

  async generateTokenPassword(id: number) {
    const JwtPayload: object = {
      id,
    };
    return await this.jwtService.signAsync(JwtPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '5m',
    });
  }
}
