import {Pendaftaran, PrismaClient, StatusPendaftaran} from '@prisma/client';
import {PendaftaranRepository}
  from '../../domain/pendaftaran/PendaftaranRepository';
import {
  AddPendaftaranInput,
  EditPendaftaranInput,
  GetAllPendaftaranInput,
  GetAllPendaftaranOutput,
} from '../../domain/pendaftaran/entity/pendaftaran';
import {countOffset} from '../../util/pagination';
import {ResponseError} from '../../common/error/response-error';

export class PendaftaranRepositoryImpl implements PendaftaranRepository {
  constructor(private readonly db: PrismaClient) {}

  async add(data: AddPendaftaranInput): Promise<string> {
    const res = await this.db.pendaftaran.create({data});

    return res.id;
  }

  async getAll(
      req: GetAllPendaftaranInput,
  ): Promise<[number, GetAllPendaftaranOutput[]]> {
    const where = {
      status: req.status,
      id_prodi: req.prodi,
      id_pendaftar: req.userId,
      prodi: {
        id_universitas: req.universitas,
      },
      pendaftar: {
        nisn: req.nisn,
        asal_sekolah: {
          id: req.sekolah,
        },
      },
    };

    return await Promise.all([
      this.db.pendaftaran.count({where}),
      this.db.pendaftaran.findMany({
        where,
        skip: countOffset(req.page, req.limit),
        take: req.limit,
        orderBy: {created_at: 'desc'},
        include: {
          pendaftar: true,
          prodi: {
            include: {universitas: true},
          },
        },
      }),
    ]);
  }

  async getById(id: string): Promise<Pendaftaran> {
    const data = await this.db.pendaftaran.findUnique({where: {id}});
    if (!data) {
      throw new ResponseError(404, 'pendaftaran tidak ditemukan');
    }

    return data;
  }

  async editById(id: string, data: EditPendaftaranInput): Promise<void> {
    await this.db.pendaftaran.update({where: {id}, data});
  }

  async deleteById(id: string): Promise<void> {
    await this.db.pendaftaran.delete({where: {id}});
  }

  async editStatusById(id: string, status: string): Promise<void> {
    await this.db.pendaftaran.update({
      where: {id},
      data: {status: status as StatusPendaftaran},
    });
  }
  async processAll(universitasId: number): Promise<void> {
    await this.db.pendaftaran.updateMany({
      where: {
        status: StatusPendaftaran.Menunggu,
        prodi: {
          id_universitas: universitasId,
        },
      },
      data: {status: StatusPendaftaran.Diproses},
    });
  }

  async verify(id: string): Promise<void> {
    const res = await this.db.pendaftaran.count({where: {id}});
    if (!res) {
      throw new ResponseError(404, 'pendaftaran tidak ditemukan');
    }
  }

  async isRegistered(idProdi: string, idPendaftar: string): Promise<void> {
    const res = await this.db.pendaftaran.count({
      where: {
        id_pendaftar: idPendaftar,
        id_prodi: idProdi,
      },
    });
    if (res) {
      throw new ResponseError(403, 'anda sudah mendaftar pada prodi ini');
    }
  }

  async verifyStatus(id: string): Promise<void> {
    const res = await this.db.pendaftaran.findUnique({
      select: {status: true},
      where: {id},
    });

    if (res?.status != 'Menunggu') {
      throw new ResponseError(403, 'pendaftaran sedang dalam proses');
    }
  }

  async verifyOwner(id: string, userId: string): Promise<void> {
    const res = await this.db.pendaftaran.findUnique({
      select: {id_pendaftar: true},
      where: {id},
    });

    if (res?.id_pendaftar !== userId) {
      throw new ResponseError(403, 'Anda tidak memiliki akses');
    }
  }
}
