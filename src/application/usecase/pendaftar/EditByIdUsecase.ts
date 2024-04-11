import {PendaftarRepository}
  from '../../../domain/pendaftar/PendaftarRepository';
import {
  EditPendaftarReq,
  mapEditPendaftarReq,
} from '../../../domain/pendaftar/entity/pendaftar';
import {PendaftarValidation} from '../../validation/PendaftarValidation';
import {Validation} from '../../validation/Validation';

export class EditPendaftarByIdUsecase {
  constructor(private readonly pendaftarRepo: PendaftarRepository) {}

  async execute(payload: EditPendaftarReq) {
    Validation.validate(PendaftarValidation.EDIT_BY_ID, payload);

    await this.pendaftarRepo.verify(payload.id);
    await this.pendaftarRepo.editById(payload.id, mapEditPendaftarReq(payload));
  }
}
