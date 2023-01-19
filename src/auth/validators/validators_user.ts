import { Repository } from 'typeorm';
import Users from '../entities/user.entity';

export const usernameAlreadyRegistered = async (
  userTable: Repository<Users>,
  username: string,
) => {
  const usedUsername = await userTable.findOne({
    where: {
      username,
    },
  });
  console.log(usedUsername);
  if (usedUsername) return false;
  return true;
};

export const emailAlreadyRegistered = async (
  userTable: Repository<Users>,
  email: string,
) => {
  const usedEmail = await userTable.findOne({
    where: {
      email,
    },
  });
  if (usedEmail) return false;
  return true;
};
