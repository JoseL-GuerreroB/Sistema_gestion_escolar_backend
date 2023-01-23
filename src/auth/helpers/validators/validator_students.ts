import { HttpException, HttpStatus } from '@nestjs/common';
import Users from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

export const validatorUpdateUsername = async (
  id: number,
  username: string,
  userTable: Repository<Users>,
) => {
  const findUsername = await userTable.findOne({
    select: ['username', 'id'],
    where: {
      username,
    },
  });
  if (!findUsername) return username;
  const findPreusernameUser = await userTable.findOne({
    select: ['username'],
    where: {
      id,
    },
  });
  if (
    findUsername.username === findPreusernameUser.username &&
    findUsername.id === id
  )
    return false;
  else if (
    findUsername.username === findPreusernameUser.username &&
    findUsername.id !== id
  )
    throw new HttpException(
      'El username que ingresaste ya lo tiene otro usuario',
      HttpStatus.CONFLICT,
    );
  else return username;
};

export const validatorUpdateEmail = async (
  id: number,
  email: string,
  userTable: Repository<Users>,
) => {
  const findEmail = await userTable.findOne({
    select: ['email', 'id'],
    where: {
      email,
    },
  });
  if (!findEmail) return email;
  const findPreemailUser = await userTable.findOne({
    select: ['email'],
    where: {
      id,
    },
  });
  if (findEmail.email === findPreemailUser.email && findEmail.id === id)
    return false;
  else if (findEmail.email === findPreemailUser.email && findEmail.id !== id)
    throw new HttpException(
      'El username que ingresaste ya lo tiene otro usuario',
      HttpStatus.CONFLICT,
    );
  else return email;
};

export const validatorUpdateUsernameAndEmail = async (
  id: number,
  username: string,
  email: string,
  userTable: Repository<Users>,
) => {
  const newUsername = await validatorUpdateUsername(id, username, userTable);
  if (email) {
    const newEmail = await validatorUpdateEmail(id, email, userTable);
    return { username: newUsername, email: newEmail };
  }
  return { username: newUsername };
};
