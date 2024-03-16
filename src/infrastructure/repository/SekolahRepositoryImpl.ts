import {Sekolah} from '@prisma/client';
import {SekolahRepository} from '../../domain/sekolah/SekolahRepository';
import {
  AddSekolahInput,
  EditSekolahInput,
  GetAllSekolahInput,
} from '../../domain/sekolah/entity/sekolah';
import {countOffset} from '../../util/pagination';
import {ResponseError} from '../../common/error/response-error';
import {isPrismaError} from '../../common/error/prisma-error';

export class SekolahRepositoryImpl implements SekolahRepository {
  constructor(private readonly db: any) {}

  async add(sekolah: AddSekolahInput): Promise<Sekolah | void> {
    try {
      return await this.db.sekolah.create({data: sekolah});
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async getAll(req: GetAllSekolahInput): Promise<[number, Sekolah[]]> {
    const where = {nama: {contains: req.search}};

    return await Promise.all([
      this.db.sekolah.count({where}),
      this.db.sekolah.findMany({
        skip: countOffset(req.page, req.limit),
        take: req.limit,
        where,
      }),
    ]);
  }

  async editById(id: string, sekolah: EditSekolahInput): Promise<void> {
    try {
      await this.db.sekolah.update({
        where: {id: id},
        data: sekolah,
      });
    } catch (e) {
      isPrismaError(e);

      throw new ResponseError(500, 'failed edit universitas');
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.db.sekolah.delete({where: {id: id}});
    } catch {
      throw new ResponseError(500, 'failed delete sekolah');
    }
  }

  async verify(id: string): Promise<void> {
    const result = await this.db.sekolah.count({where: {id: id}});
    if (!result) {
      throw new ResponseError(404, 'sekolah not found');
    }
  }
}
