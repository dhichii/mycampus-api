import {PotensiKarirRepository}
  from '../../../domain/potensi_karir/PotensiKarirRepository';
import {
  EditPotensiKarirReq,
  mapEditPotensiKarirReq,
} from '../../../domain/potensi_karir/entity/potensi-karir';
import {PotensiKarirValidation} from '../../validation/PotensiKarirValidation';
import {Validation} from '../../validation/Validation';

export class EditPotensiKarirByIdUseCase {
  constructor(private readonly potensiKarirRepo: PotensiKarirRepository) {}

  async execute(payload: EditPotensiKarirReq) {
    Validation.validate(PotensiKarirValidation.EDIT_BY_ID, payload);

    await this.potensiKarirRepo.verify(payload.id);
    await this.potensiKarirRepo.editById(
        payload.id,
        mapEditPotensiKarirReq(payload),
    );
  }
}
