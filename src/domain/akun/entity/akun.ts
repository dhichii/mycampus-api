import {Role} from '../../../util/enum';
import {Bcrypt} from '../../../infrastructure/security/Bcrypt';

export type AddAkunReq = {
  id: string;
  email: string;
  password: string;
  role: Role;
}

export type AddAkunInput = {
  id: string;
  email: string;
  password: string;
  role: Role;
}

export type LoginReq = {
  email: string;
  password: string;
}

export type LoginOutput = {
  id: string;
  password: string;
  role: string;
}

export type LoginRes = {
  access: string;
  refresh: string;
}

export async function mapAddAdkunReq(req: AddAkunReq): Promise<AddAkunInput> {
  const password = await new Bcrypt().hash(req.password);
  return {
    id: req.id,
    email: req.email,
    password: password,
    role: req.role,
  };
}
