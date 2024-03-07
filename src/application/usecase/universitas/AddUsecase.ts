import {Universitas} from '@prisma/client';
import {UniversitasRepository}
  from '../../../domain/universitas/UniversitasRepository';
import {mapAddUniversitasReq, AddUniversitasReq}
  from '../../../domain/universitas/entity/universitas';
import {Validation} from '../../validation/Validation';
import {UniversitasValidation} from '../../validation/UniversitasValidation';

export class AddUniversitasUsecase {
  constructor(private readonly universitasRepo: UniversitasRepository) {}

  async execute(payload: AddUniversitasReq): Promise<Universitas> {
    Validation.validate(UniversitasValidation.ADD, payload);
    return this.universitasRepo.add(mapAddUniversitasReq(payload));
  }
}
