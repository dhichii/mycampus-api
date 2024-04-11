import {Universitas} from '@prisma/client';
import {AddUniversitasInput, EditUniversitasInput} from './entity/universitas';

export interface UniversitasRepository {
  add(universitas: AddUniversitasInput): Promise<Universitas>;
  getAll(): Promise<Universitas[]>;
  getAllByIds(ids: string[]): Promise<Universitas[]>;
  getById(id: number): Promise<Universitas>;
  editById(id: number, universitas: EditUniversitasInput): Promise<void>;
  deleteById(id: number): Promise<void>;
  editLogoById(id: number, logoUrl: string): Promise<void>;
  verify(id: number): Promise<void>;
}
