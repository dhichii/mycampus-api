import {Akun} from '@prisma/client';
import {isPrismaError} from '../../common/error/prisma-error';
import {ResponseError} from '../../common/error/response-error';
import {AkunRepository} from '../../domain/akun/AkunRepository';
import {AddAkunInput, LoginOutput} from '../../domain/akun/entity/akun';

export class AkunRepositoryImpl implements AkunRepository {
  constructor(private readonly db: any) {}

  async add(req: AddAkunInput): Promise<void> {
    try {
      await this.db.akun.create({data: req});
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async login(email: string): Promise<LoginOutput> {
    const data = await this.db.akun.findUnique({
      where: {email},
      select: {
        id: true,
        password: true,
        role: true,
      },
    });
    if (!data) {
      throw new ResponseError(401, 'email atau password salah');
    }

    return data;
  }

  async getById(id: string): Promise<Akun> {
    const data = await this.db.akun.findUnique({where: {id, deleted_at: null}});
    if (!data) {
      throw new ResponseError(404, 'akun tidak ditemukan');
    }

    return data;
  }

  async getAllByIds(ids: string[]): Promise<Akun[]> {
    return await this.db.akun.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async changeEmail(id: string, email: string): Promise<void> {
    try {
      await this.db.akun.update({where: {id}, data: {email}});
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async changePassword(id: string, password: string): Promise<void> {
    try {
      await this.db.akun.update({where: {id}, data: {password}});
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.db.akun.update({
        where: {id: id},
        data: {deleted_at: new Date()},
      });
    } catch {
      throw new ResponseError(500, 'failed delete akun');
    }
  }

  async verify(id: string): Promise<void> {
    const result = await this.db.akun.count({where: {id, deleted_at: null}});
    if (!result) {
      throw new ResponseError(404, 'akun tidak ditemukan');
    }
  }
}
