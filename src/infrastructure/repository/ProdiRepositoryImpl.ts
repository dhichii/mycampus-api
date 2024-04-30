import {PrismaClient} from '@prisma/client';
import {ProdiRepository} from '../../domain/prodi/ProdiRepository';
import {
  AddProdiInput,
  EditProdiInput,
  GetAllProdiInput,
  GetAllProdiOutput,
  GetProdiByIdOutput,
} from '../../domain/prodi/entity/prodi';
import {countOffset} from '../../util/pagination';
import {ResponseError} from '../../common/error/response-error';

export class ProdiRepositoryImpl implements ProdiRepository {
  constructor(private readonly db: PrismaClient) {}

  async add(
      prodi: AddProdiInput,
      potensiKarir: {nama: string}[],
  ): Promise<string> {
    const potensiKarirData = potensiKarir.map((value) => {
      const nama = value.nama;

      return {
        potensi_karir: {
          connectOrCreate: {
            where: {nama},
            create: {nama},
          },
        },
      };
    });

    const res = await this.db.prodi.create({
      data: {
        ...prodi,
        potensi_karir: {
          create: potensiKarirData,
        },
      },
    });

    return res.id;
  }

  async getAll(req: GetAllProdiInput): Promise<[number, GetAllProdiOutput[]]> {
    const where = {
      nama: {contains: req.search},
      status: req.status,
      id_universitas: req.universitas,
      ukt: {
        gte: req.min_ukt,
        lte: req.max_ukt,
      },
      universitas: {
        jenis: req.jenis_universitas,
      },
    };

    const [totalResult, data] = await Promise.all([
      this.db.prodi.count({where}),
      this.db.prodi.findMany({
        where,
        skip: countOffset(req.page, req.limit),
        take: req.limit,
        include: {
          potensi_karir: {
            include: {potensi_karir: true},
          },

          universitas: true,
        },
      }),
    ]);

    return [
      totalResult,
      data.map((prodi) => {
        return {
          ...prodi,
          potensi_karir: prodi.potensi_karir.map((potensiKarir) => {
            return potensiKarir.potensi_karir;
          }),
        };
      }),
    ];
  }

  async getById(id: string): Promise<GetProdiByIdOutput> {
    const data = await this.db.prodi.findUnique({
      where: {id},
      include: {
        potensi_karir: {
          include: {potensi_karir: true},
        },
        universitas: true,
      },
    });

    if (!data) {
      throw new ResponseError(404, 'prodi tidak ditemukan');
    }

    return {
      ...data,
      potensi_karir: data.potensi_karir.map((potensiKarir) => {
        return potensiKarir.potensi_karir;
      }),
    };
  }

  async editById(id: string, data: EditProdiInput): Promise<void> {
    await this.db.prodi.update({where: {id}, data});
  }

  async deleteById(id: string): Promise<void> {
    await this.db.prodi.delete({
      where: {id},
    });
  }

  async editPotensiKarir(
      id: string,
      potensiKarir: {nama: string}[],
  ): Promise<void> {
    const potensiKarirData = potensiKarir.map((value) => {
      const nama = value.nama;

      return {
        potensi_karir: {
          connectOrCreate: {
            where: {nama},
            create: {nama},
          },
        },
      };
    });

    await this.db.prodi.update({
      where: {id},
      data: {
        potensi_karir: {
          deleteMany: {},
          create: potensiKarirData,
        },
      },
    });
  }

  async verify(id: string): Promise<void> {
    const res = await this.db.prodi.count({where: {id}});
    if (!res) {
      throw new ResponseError(404, 'prodi tidak ditemukan');
    }
  }
}
