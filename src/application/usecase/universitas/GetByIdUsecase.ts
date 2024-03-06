import {Universitas} from '@prisma/client';
import {UniversitasRepository}
  from '../../../domain/universitas/UniversitasRepository';
import {Validation} from '../../validation/Validation';
import {UniversitasValidation} from '../../validation/UniversitasValidation';
export class GetUniversitasByIdUsecase {
  constructor(public universitasRepo: UniversitasRepository) {}

  async execute(id: number): Promise<Universitas> {
    Validation.validate(UniversitasValidation.GET_BY_ID, {id});
    return this.universitasRepo.getById(id);
  }
}
