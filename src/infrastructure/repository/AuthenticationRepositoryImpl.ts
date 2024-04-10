import {AuthenticationRepository}
  from '../../domain/authentication/AuthenticationRepository';
import {ResponseError} from '../../common/error/response-error';
import {Authentication} from '@prisma/client';

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  constructor(private readonly db: any) {}

  // eslint-disable-next-line camelcase
  async add(token: string, expires_at: Date) {
    await this.db.authentication.create({data: {
      token,
      // eslint-disable-next-line camelcase
      expires_at,
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
    await this.db.authentication.delete({where: {token}});
  }
}
