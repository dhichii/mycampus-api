import {PendaftaranRepository}
  from '../../../domain/pendaftaran/PendaftaranRepository';
import {
  EditPendaftaranReq,
  mapEditPendaftaranReq,
} from '../../../domain/pendaftaran/entity/pendaftaran';
import {Role} from '../../../util/enum';
import {PendaftaranValidation} from '../../validation/PendaftaranValidation';
import {Validation} from '../../validation/Validation';

export class EditPendaftaranByIdUsecase {
  constructor(private readonly pendaftaranRepo: PendaftaranRepository) {}

  async execute(payload: EditPendaftaranReq) {
    Validation.validate(PendaftaranValidation.EDIT_BY_ID, payload);

    await this.pendaftaranRepo.verify(payload.id);
    await this.pendaftaranRepo.verifyStatus(payload.id);

    if (payload.role == Role.PENDAFTAR) {
      await this.pendaftaranRepo.verifyOwner(payload.id, payload.userId);
    }

    await this.pendaftaranRepo
        .editById(payload.id, mapEditPendaftaranReq(payload));
  }
}
