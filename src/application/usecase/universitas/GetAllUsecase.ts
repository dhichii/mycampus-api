import {Universitas} from '@prisma/client';
import {UniversitasRepository}
  from '../../../domain/universitas/UniversitasRepository';

export class GetAllUniversitasUsecase {
  constructor(private readonly universitasRepo: UniversitasRepository) {}

  async execute(): Promise<Universitas[]> {
    return this.universitasRepo.getAll();
  }
}
