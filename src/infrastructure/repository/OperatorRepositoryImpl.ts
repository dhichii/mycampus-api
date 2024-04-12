import {OperatorRepository} from '../../domain/operator/OperatorRepository';
import {
  AddOperatorInput,
  EditOperatorInput,
  GetAllOperatorInput,
} from '../../domain/operator/entity/operator';
import {countOffset} from '../../util/pagination';
import {ResponseError} from '../../common/error/response-error';
import {isPrismaError} from '../../common/error/prisma-error';
import {Operator} from '@prisma/client';

export class OperatorRepositoryImpl implements OperatorRepository {
  constructor(private readonly db: any) {}

  async add(data: AddOperatorInput): Promise<string> {
    await this.db.operator.create({data});

    return data.id;
  }

  async getAll(req: GetAllOperatorInput): Promise<[number, Operator[]]> {
    const where = {nama: {contains: req.search}};

    return await Promise.all([
      this.db.operator.count({where}),
      this.db.operator.findMany({
        skip: countOffset(req.page, req.limit),
        take: req.limit,
        where,
      }),
    ]);
  }

  async getById(id: string): Promise<Operator> {
    const data = await this.db.operator.findUnique({where: {id}});
    if (!data) {
      throw new ResponseError(404, 'akun tidak ditemukan');
    }

    return data;
  }

  async editById(id: string, data: EditOperatorInput): Promise<void> {
    try {
      await this.db.operator.update({data, where: {id}});
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.db.operator.update({
        data: {deleted_at: new Date()},
        where: {id},
      });
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async verify(id: string): Promise<void> {
    const result = await this.db.operator.count({where: {id}});
    if (!result) {
      throw new ResponseError(404, 'akun tidak ditemukan');
    }
  }
}
