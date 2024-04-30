import {ProdiRepository} from '../../../domain/prodi/ProdiRepository';
import {
  EditProdiReq,
  mapEditProdiReq,
} from '../../../domain/prodi/entity/prodi';
import {Prodivalidation} from '../../validation/ProdiValidation';
import {Validation} from '../../validation/Validation';

export class EditProdiByIdUsecase {
  constructor(private readonly prodiRepo: ProdiRepository) {}

  async execute(payload: EditProdiReq) {
    Validation.validate(Prodivalidation.EDIT_BY_ID, payload);

    await this.prodiRepo.verify(payload.id);

    await this.prodiRepo.editById(payload.id, mapEditProdiReq(payload));
  }
}
