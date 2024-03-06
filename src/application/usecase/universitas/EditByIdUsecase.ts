import {UniversitasRepository}
  from '../../../domain/universitas/UniversitasRepository';
import {EditUniversitasReq, mapEditUniversitasReq}
  from '../../../domain/universitas/entity/universitas';
import {UniversitasValidation} from '../../validation/UniversitasValidation';
import {Validation} from '../../validation/Validation';

export class EditUniversitasByIdUsecase {
  constructor(private readonly universitasRepo: UniversitasRepository) {}

  async execute(payload: EditUniversitasReq) {
    Validation.validate(UniversitasValidation.EDIT_BY_ID, payload);
    const id = payload.id;
    await this.universitasRepo.verify(id);
    await this.universitasRepo.editById(id, mapEditUniversitasReq(payload));
  }
}
