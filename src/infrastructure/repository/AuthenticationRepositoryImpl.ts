import {JwtPayload} from 'jsonwebtoken';
import {AuthenticationRepository}
  from '../../domain/authentication/AuthenticationRepository';
import {Jwt} from '../security/Jwt';
import {ResponseError} from '../../common/error/response-error';
import {Authentication} from '@prisma/client';

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  constructor(private readonly db: any) {}

  async add(token: string) {
    const payload = await new Jwt().verifyRefreshToken(token) as JwtPayload;
    await this.db.authentication.create({data: {
      token,
      expires_at: new Date(payload.exp as number / 1000000),
    }});
  }

  async get(token: string): Promise<Authentication> {
    const data = await this.db.authentication.findUnique({where: {token}});
    if (!data) {
      throw new ResponseError(401, 'sesi kadaluarsa, silahkan login kembali');
    }

    return data;
  }

  async delete(token: string) {
    await this.db.authentication.delete({where: token});
  }
}
