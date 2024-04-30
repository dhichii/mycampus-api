import {ProdiRepository} from '../../../domain/prodi/ProdiRepository';
import {Prodivalidation} from '../../validation/ProdiValidation';
import {Validation} from '../../validation/Validation';

export class DeleteProdiByIdUsecase {
  constructor(private readonly prodiRepo: ProdiRepository) {}

  async execute(id: string) {
    Validation.validate(Prodivalidation.DELETE_BY_ID, {id});

    await this.prodiRepo.verify(id);

    await this.prodiRepo.deleteById(id);
  }
}
