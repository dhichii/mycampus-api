import { Universitas } from "@prisma/client";

export interface UniversitasRepository {
  add(universitas: Universitas): Promise<Universitas>;
  getAll(): Promise<Universitas[]>;
  getById(id: number): Promise<Universitas>;
  editById(id: number, universitas: Universitas): Promise<void>;
  deleteById(id: number): Promise<void>;
  verify(id: number): Promise<void>;
}
