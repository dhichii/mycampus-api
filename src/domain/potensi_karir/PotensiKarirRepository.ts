import {PotensiKarir} from '@prisma/client';
import {
  AddPotensiKarirInput,
  GetAllPotensiKarirInput,
  EditPotensiKarirInput,
} from './entity/potensi-karir';

export interface PotensiKarirRepository {
  add(data: AddPotensiKarirInput): Promise<number>;
  getAll(req: GetAllPotensiKarirInput): Promise<[number, PotensiKarir[]]>;
  editById(id: number, data: EditPotensiKarirInput): Promise<void>;
  deleteById(id: number): Promise<void>;
  verify(id: number): Promise<void>;
}
