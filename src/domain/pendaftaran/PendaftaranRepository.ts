import {Pendaftaran} from '@prisma/client';
import {
  AddPendaftaranInput,
  GetAllPendaftaranInput,
  GetAllPendaftaranOutput,
  EditPendaftaranInput,
} from './entity/pendaftaran';

export interface PendaftaranRepository {
  add(data: AddPendaftaranInput): Promise<string>
  getAll(
    req: GetAllPendaftaranInput,
  ): Promise<[number, GetAllPendaftaranOutput[]]>
  getById(id: string): Promise<Pendaftaran>
  editById(id: string, data: EditPendaftaranInput): Promise<void>
  deleteById(id: string): Promise<void>
  editStatusById(id: string, status: string): Promise<void>
  processAll(universitasId: number): Promise<void>
  verify(id: string): Promise<void>
  isRegistered(idProdi: string, idPendaftar: string): Promise<void>
  verifyStatus(id: string): Promise<void>
  verifyOwner(id: string, userId: string): Promise<void>
}
