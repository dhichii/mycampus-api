import {Operator} from '@prisma/client';
import {
  AddOperatorInput,
  EditOperatorInput,
  GetAllOperatorInput,
} from './entity/operator';

export interface OperatorRepository {
  add(data: AddOperatorInput): Promise<string>
  getAll(req: GetAllOperatorInput): Promise<[number, Operator[]]>
  getById(id: string): Promise<Operator>
  editById(id: string, data: EditOperatorInput): Promise<void>
  deleteById(id: string): Promise<void>
  verify(id: string): Promise<void>
}
