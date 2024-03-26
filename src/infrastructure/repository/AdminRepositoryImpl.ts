import {Admin} from '@prisma/client';
import {isPrismaError} from '../../common/error/prisma-error';
import {ResponseError} from '../../common/error/response-error';
import {AdminRepository} from '../../domain/admin/AdminRepository';
import {
  AddAdminInput,
  EditAdminInput,
  GetAllAdminInput,
} from '../../domain/admin/entity/admin';
import {countOffset} from '../../util/pagination';

export class AdminRepositoryImpl implements AdminRepository {
  constructor(private readonly db: any) {}

  async add(req: AddAdminInput): Promise<void> {
    try {
      await this.db.admin.create({data: req});
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async getAll(req: GetAllAdminInput): Promise<[number, Admin[]]> {
    const where = {nama: {contains: req.search}};

    return await Promise.all([
      this.db.admin.count({where}),
      this.db.admin.findMany({
        skip: countOffset(req.page, req.limit),
        take: req.limit,
        where,
      }),
    ]);
  }

  async getById(id: string): Promise<Admin> {
    const data = await this.db.admin.findUnique({where: {id}});
    if (!data) {
      throw new ResponseError(404, 'akun tidak ditemukan');
    }

    return data;
  }

  async editById(id: string, req: EditAdminInput): Promise<void> {
    try {
      await this.db.akun.update({where: {id}, data: {req}});
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.db.admin.update({
        where: {id: id},
        data: {deleted_at: new Date()},
      });
    } catch {
      throw new ResponseError(500, 'failed delete akun');
    }
  }

  async verify(id: string): Promise<void> {
    const result = await this.db.admin.count({where: {id: id}});
    if (!result) {
      throw new ResponseError(404, 'akun tidak ditemukan');
    }
  }
}
