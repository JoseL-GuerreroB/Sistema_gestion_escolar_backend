import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import Users from '../../entities/user.entity';
import { comparePasswords } from '../bcrypt';

export const usernameAndEmailAlreadyRegistered = async (
  userTable: Repository<Users>,
  username: string,
  email: string,
) => {
  const usedUsername = await userTable.findOne({
    where: {
      username,
    },
  });
  if (usedUsername)
    throw new HttpException('El username ya esta ocupado', HttpStatus.CONFLICT);
  const usedEmail = await userTable.findOne({
    where: {
      email,
    },
  });
  if (usedEmail)
    throw new HttpException(
      'El correo ya esta registrado',
      HttpStatus.CONFLICT,
    );
};

export const userLogin = async (
  userTable: Repository<Users>,
  email: string,
  password: string,
) => {
  const existUser = await userTable.findOne({
    where: {
      email,
    },
  });
  if (!existUser)
    throw new HttpException('Error de credenciales', HttpStatus.NOT_FOUND);

  const confirmPassword = await comparePasswords(password, existUser.password);
  if (confirmPassword === false)
    throw new HttpException('Error de credenciales', HttpStatus.NOT_FOUND);
  return existUser;
};
