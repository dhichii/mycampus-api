import {Admin} from '@prisma/client';
import {AddAdminInput, EditAdminInput, GetAllAdminInput} from './entity/admin';

export interface AdminRepository {
  add(req: AddAdminInput): Promise<void>
  getAll(req: GetAllAdminInput): Promise<[number, Admin[]]>
  getById(id: string): Promise<Admin>
  editById(id: string, req: EditAdminInput): Promise<void>
  deleteById(id: string): Promise<void>
  verify(id: string): Promise<void>
}
