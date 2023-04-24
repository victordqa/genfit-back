import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
};

export const compareHashes = async (plain: string, dbHash: string) => {
  return bcrypt.compare(plain, dbHash);
};
