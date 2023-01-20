import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from '../helpers/bcrypt';
import { User } from '../dto/user_dto';
import { TypesUsers } from '../entities/type_atr.entity';
import Users from '../entities/user.entity';
import { usernameAndEmailAlreadyRegistered } from '../helpers/validators/validators_user';

@Injectable()
export class AuthPreservice {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(TypesUsers)
    private typesUsersRepository: Repository<TypesUsers>,
  ) {}

  async Create_User(newUser: User, type_user: number) {
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

  async generateToken(id: number, type_user: string, type_employe?: string) {
    const JwtPayload: object = {
      id,
      type_user,
    };
    if (type_user === 'Empleado') {
      JwtPayload['type_employe'] = type_employe;
    }
    return await this.jwtService.signAsync(JwtPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(
    id: number,
    type_user: string,
    type_employe?: string,
  ) {
    const JwtPayload: object = {
      id,
      type_user,
    };
    if (type_user === 'Empleado') {
      JwtPayload['type_employe'] = type_employe;
    }
    return await this.jwtService.signAsync(JwtPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}
