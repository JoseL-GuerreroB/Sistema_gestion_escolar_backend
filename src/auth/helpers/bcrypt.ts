import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashPassword: string,
) => {
  return await bcrypt.compare(password, hashPassword);
};
