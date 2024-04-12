import bcrypt from 'bcrypt';
import {ResponseError} from '../../common/error/response-error';

export class Bcrypt {
  constructor(private readonly saltRound = 10) {}

  async hash(password: string) {
    return bcrypt.hash(password, this.saltRound);
  }

  async compare(password: string, hashedPassword: string) {
    const res = await bcrypt.compare(password, hashedPassword);
    if (!res) {
      throw new ResponseError(401, 'email atau password salah');
    }
  }
}
