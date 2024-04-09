import {
  AddPendaftarInput,
  EditPendaftarInput,
  GetAllPendaftarInput,
  GetPendaftarByIdOutput,
  GetPendaftarOutput,
} from './entity/pendaftar';

export interface PendaftarRepository {
  add(data: AddPendaftarInput): Promise<void>
  getAll(req: GetAllPendaftarInput): Promise<[number, GetPendaftarOutput[]]>
  getById(id: string): Promise<GetPendaftarByIdOutput>
  editById(id: string, data: EditPendaftarInput): Promise<void>
  deleteById(id: string): Promise<void>
  verify(id: string): Promise<void>
}
