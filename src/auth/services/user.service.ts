import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { comparePasswords, encryptPassword } from '../helpers/bcrypt';

import { TypesUsers } from '../entities/type_atr.entity';
import Users from '../entities/user.entity';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(Users) private UserRepository: Repository<Users>,
    @InjectRepository(TypesUsers)
    private TypeUserRepository: Repository<TypesUsers>,
  ) {}

  async UniqueStringValidatorFromUser(
    idUser: number,
    uniqueString: keyof Users,
    value: string,
  ) {
    const findOwnerUser = await this.UserRepository.findOne({
      select: [uniqueString, 'id'],
      where: {
        [uniqueString]: value,
      },
    });
    if (!findOwnerUser) return value;
    const findUser = await this.UserRepository.findOne({
      select: [uniqueString],
      where: {
        id: idUser,
      },
    });
    if (
      findOwnerUser[uniqueString] === findUser[uniqueString] &&
      findOwnerUser.id === idUser
    )
      return false;
    else
      throw new HttpException(
        `El ${uniqueString} que ingresaste ya lo tiene otro usuario`,
        HttpStatus.CONFLICT,
      );
  }

  async UsernameAndEmailAlreadyRegistered(username: string, email: string) {
    const usedUsername = await this.UserRepository.findOne({
      where: {
        username,
      },
    });
    if (usedUsername)
      throw new HttpException(
        'El username ya esta ocupado',
        HttpStatus.CONFLICT,
      );
    const usedEmail = await this.UserRepository.findOne({
      where: {
        email,
      },
    });
    if (usedEmail)
      throw new HttpException(
        'El correo ya esta registrado',
        HttpStatus.CONFLICT,
      );
  }

  async Create_User_Service(newUser: any, type_user: number) {
    await this.UsernameAndEmailAlreadyRegistered(
      newUser.username,
      newUser.email,
    );
    let user = newUser;
    user.password = await encryptPassword(newUser.password);
    const typeUser = await this.TypeUserRepository.findOne({
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
    user = this.UserRepository.create(user);
    return await this.UserRepository.save(user);
  }

  async User_Login(email: string, password: string) {
    const existUser = await this.UserRepository.findOne({
      where: {
        email,
      },
    });
    if (!existUser)
      throw new HttpException('Error de credenciales', HttpStatus.NOT_FOUND);

    const confirmPassword = await comparePasswords(
      password,
      existUser.password,
    );
    if (confirmPassword === false)
      throw new HttpException('Error de credenciales', HttpStatus.NOT_FOUND);
    return existUser;
  }

  async Update_User_Service(idUser: number, data: any) {
    console.log(data);
    await this.UserRepository.update({ id: idUser }, data);
    return;
  }

  async Delete_User_Service(idUser: number) {
    await this.UserRepository.delete({ id: idUser });
    return;
  }

  async Find_User_for_Change_Password(
    username: string,
    email: string,
    phone: string,
  ) {
    const user = await this.UserRepository.findOne({
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
    await this.UserRepository.update({ id }, { password });
  }
}
