import {PotensiKarirRepository}
  from '../../../domain/potensi_karir/PotensiKarirRepository';
import {PotensiKarirValidation} from '../../validation/PotensiKarirValidation';
import {Validation} from '../../validation/Validation';

export class DeletePotensiKarirByIdUseCase {
  constructor(private readonly potensiKarirRepo: PotensiKarirRepository) {}

  async execute(id: number) {
    Validation.validate(PotensiKarirValidation.DELETE_BY_ID, {id});

    await this.potensiKarirRepo.verify(id);
    await this.potensiKarirRepo.deleteById(id);
  }
}
