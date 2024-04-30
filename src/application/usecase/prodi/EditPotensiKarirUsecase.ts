import {ProdiRepository} from '../../../domain/prodi/ProdiRepository';
import {Validation} from '../../validation/Validation';
import {Prodivalidation} from '../../validation/ProdiValidation';

export class EditProdiPotensiKarirUsecase {
  constructor(private readonly prodiRepo: ProdiRepository) {}

  async execute(payload: {id: string, potensi_karir: {nama: string}[]}) {
    Validation.validate(Prodivalidation.EDIT_PRODI_POTENSI_KARIR, payload);

    await this.prodiRepo.verify(payload.id);

    await this.prodiRepo.editPotensiKarir(payload.id, payload.potensi_karir);
  }
}
