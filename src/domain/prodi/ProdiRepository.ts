import {
  AddProdiInput,
  EditProdiInput,
  GetAllProdiInput,
  GetAllProdiOutput,
  GetProdiByIdOutput,
} from './entity/prodi';

export interface ProdiRepository {
  add(prodi: AddProdiInput, potensiKarir: {nama: string}[]): Promise<string>
  getAll(req: GetAllProdiInput): Promise<[number, GetAllProdiOutput[]]>
  getById(id: string): Promise<GetProdiByIdOutput>
  editById(id: string, data: EditProdiInput): Promise<void>
  deleteById(id: string): Promise<void>
  editPotensiKarir(id: string, potensiKarir: {nama: string}[]): Promise<void>
  verify(id: string): Promise<void>
}
