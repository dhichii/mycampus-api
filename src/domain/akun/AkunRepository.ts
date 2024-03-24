import {Akun} from '@prisma/client';
import {AddAkunInput, LoginOutput} from './entity/akun';

export interface AkunRepository {
  add(req: AddAkunInput): Promise<void>;
  login(email: string): Promise<LoginOutput>;
  getById(id: string): Promise<Akun>;
  changeEmail(id: string, email: string): Promise<void>;
  changePassword(id: string, password: string): Promise<void>;
  delete(id: string): Promise<void>;
  verify(id: string): Promise<void>;
}
