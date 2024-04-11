import {Universitas} from '@prisma/client';
import {UniversitasRepository}
  from '../../domain/universitas/UniversitasRepository';
import {ResponseError} from '../../common/error/response-error';
import {AddUniversitasInput, EditUniversitasInput}
  from '../../domain/universitas/entity/universitas';

export class UniversitasRepositoryImpl implements UniversitasRepository {
  constructor(private readonly db: any) {
  }

  async add(universitas: AddUniversitasInput): Promise<Universitas> {
    const result = await this.db.universitas.create({data: universitas});

    return result;
  }

  async getAll(): Promise<Universitas[]> {
    const result = await this.db.universitas.findMany();

    return result;
  }

  async getAllByIds(ids: number[]): Promise<Universitas[]> {
    return await this.db.universitas.findMany({
      where: {
        id: {in: ids},
      },
    });
  }

  async getById(id: number): Promise<Universitas> {
    const result = await this.db.universitas.findFirst({where: {id: id}});
    if (!result) {
      throw new ResponseError(404, 'universitas not found');
    }

    return result;
  }

  async editById(id: number, universitas: EditUniversitasInput): Promise<void> {
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

  async editLogoById(id: number, logoUrl: string): Promise<void> {
    try {
      await this.db.universitas.update({
        where: {id: id},
        data: {logo_url: logoUrl},
      });
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
