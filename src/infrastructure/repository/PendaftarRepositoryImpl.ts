import {isPrismaError} from '../../common/error/prisma-error';
import {ResponseError} from '../../common/error/response-error';
import {PendaftarRepository} from '../../domain/pendaftar/PendaftarRepository';
import {
  AddPendaftarInput,
  EditPendaftarInput,
  GetAllPendaftarInput,
  GetPendaftarByIdOutput,
  GetPendaftarOutput,
} from '../../domain/pendaftar/entity/pendaftar';
import {countOffset} from '../../util/pagination';

export class PendaftarRepositoryImpl implements PendaftarRepository {
  constructor(private readonly db: any) {}

  async add(data: AddPendaftarInput): Promise<void> {
    try {
      await this.db.pendaftar.create({data});
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async getAll(req: GetAllPendaftarInput): Promise<[
      number,
      GetPendaftarOutput[],
  ]> {
    const where = {
      nama: {contains: req.search},
      id_sekolah: req.sekolah,
      nik: req.nik,
      nisn: req.nisn,
    };

    return await Promise.all([
      this.db.pendaftar.count({where}),
      this.db.pendaftar.findMany({
        select: {
          id: true,
          nama: true,
          nisn: true,
          nik: true,
          jenis_kelamin: true,
          created_at: true,
          id_sekolah: true,
        },
        skip: countOffset(req.page, req.limit),
        take: req.limit,
        where,
      }),
    ]);
  }

  async getById(id: string): Promise<GetPendaftarByIdOutput> {
    const data = await this.db.pendaftar.findUnique({where: {id}});
    if (!data) {
      throw new ResponseError(404, 'akun tidak ditemukan');
    }

    return data;
  }

  async editById(id: string, data: EditPendaftarInput): Promise<void> {
    try {
      await this.db.pendaftar.update({where: {id}, data});
    } catch (e) {
      isPrismaError(e);

      throw e;
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.db.pendaftar.update({
        where: {id},
        data: {deleted_at: new Date()},
      });
    } catch {
      throw new ResponseError(500, 'failed delete akun');
    }
  }

  async verify(id: string): Promise<void> {
    const result = await this.db.pendaftar.count({where: {id}});
    if (!result) {
      throw new ResponseError(404, 'akun tidak ditemukan');
    }
  }
}
