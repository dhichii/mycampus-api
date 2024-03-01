import {Universitas} from '@prisma/client';
import {UniversitasRepository}
  from '../../domain/universitas/UniversitasRepository';
import {ResponseError} from '../../common/error/response-error';

export class UniversitasRepositoryImpl implements UniversitasRepository {
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  async add(universitas: Universitas): Promise<Universitas> {
    const result = await this.db.universitas.create({data: universitas});

    return result;
  }

  async getAll(): Promise<Universitas[]> {
    const result = await this.db.universitas.findMany();

    return result;
  }

  async getById(id: number): Promise<Universitas> {
    const result = await this.db.universitas.findFirst({where: {id: id}});
    if (!result) {
      throw new ResponseError(404, 'universitas not found');
    }

    return result;
  }

  async editById(id: number, universitas: Universitas): Promise<void> {
    try {
      await this.db.universitas.update({
        where: {id: id},
        data: universitas,
      });
    } catch {
      throw new ResponseError(500, 'failed edit universitas');
    }
  }

  async deleteById(id: number): Promise<void> {
    try {
      await this.db.universitas.delete({where: {id: id}});
    } catch {
      throw new ResponseError(500, 'failed delete universitas');
    }
  }

  async verify(id: number): Promise<void> {
    const result = await this.db.universitas.count({where: {id: id}});
    if (!result) {
      throw new ResponseError(404, 'universitas not found');
    }
  }
}
