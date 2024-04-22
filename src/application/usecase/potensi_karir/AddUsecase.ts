import {PotensiKarirRepository}
  from '../../../domain/potensi_karir/PotensiKarirRepository';
import {
  AddPotensiKarirReq,
  mapAddPotensiKarirReq,
} from '../../../domain/potensi_karir/entity/potensi-karir';
import {PotensiKarirValidation} from '../../validation/PotensiKarirValidation';
import {Validation} from '../../validation/Validation';

export class AddPotensiKarirUsecase {
  constructor(private readonly potensiKarirRepo: PotensiKarirRepository) {}

  async execute(payload: AddPotensiKarirReq) {
    Validation.validate(PotensiKarirValidation.ADD, payload);

    const id = await this.potensiKarirRepo.add(mapAddPotensiKarirReq(payload));

    return id;
  }
}
