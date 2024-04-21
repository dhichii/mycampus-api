import {PotensiKarir, PrismaClient} from '@prisma/client';
import {isPrismaError} from '../../common/error/prisma-error';
import {PotensiKarirRepository}
  from '../../domain/potensi_karir/PotensiKarirRepository';
import {
  AddPotensiKarirInput,
  EditPotensiKarirInput,
  GetAllPotensiKarirInput,
} from '../../domain/potensi_karir/entity/potensi-karir';
import {countOffset} from '../../util/pagination';
import {ResponseError} from '../../common/error/response-error';

export class PotensiKarirRepositoryImpl implements PotensiKarirRepository {
  constructor(private readonly db: PrismaClient) {}

  async add(data: AddPotensiKarirInput): Promise<number> {
    try {
      const res = await this.db.potensiKarir.create({data});

      return res.id;
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async getAll(req: GetAllPotensiKarirInput): Promise<[
    number,
    PotensiKarir[],
  ]> {
    const where = {nama: {contains: req.search}};

    return await Promise.all([
      this.db.potensiKarir.count({where}),
      this.db.potensiKarir.findMany({
        skip: countOffset(req.page, req.limit),
        take: req.limit,
        where,
      }),
    ]);
  }

  async editById(id: number, data: EditPotensiKarirInput): Promise<void> {
    try {
      await this.db.potensiKarir.update({where: {id}, data});
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await this.db.potensiKarir.delete({where: {id}});
    } catch (e) {
      throw new ResponseError(500, 'failed delete potensi karir');
    }
  }

  async verify(id: number): Promise<void> {
    const result = await this.db.potensiKarir.count({where: {id}});
    if (!result) {
      throw new ResponseError(404, 'potensi karir tidak ditemukan');
    }
  }
}
