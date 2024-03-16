import {Sekolah} from '@prisma/client';
import {
  AddSekolahInput,
  EditSekolahInput,
  GetAllSekolahInput,
} from './entity/sekolah';

export interface SekolahRepository {
  add(sekolah: AddSekolahInput): Promise<Sekolah | void>;
  getAll(req: GetAllSekolahInput): Promise<[number, Sekolah[]]>;
  editById(id: string, sekolah: EditSekolahInput): Promise<void>;
  deleteById(id: string): Promise<void>;
  verify(id: string): Promise<void>;
};
