import {PendaftaranRepository}
  from '../../../domain/pendaftaran/PendaftaranRepository';
import {DeletePendaftaranInput}
  from '../../../domain/pendaftaran/entity/pendaftaran';
import {Role} from '../../../util/enum';
import {PendaftaranValidation} from '../../validation/PendaftaranValidation';
import {Validation} from '../../validation/Validation';

export class DeletePendaftaranByIdUsecase {
  constructor(private readonly pendaftaranRepo: PendaftaranRepository) {}

  async execute(payload: DeletePendaftaranInput) {
    Validation.validate(PendaftaranValidation.DELETE_BY_ID, payload);

    await this.pendaftaranRepo.verify(payload.id);

    if (payload.role == Role.PENDAFTAR) {
      await this.pendaftaranRepo.verifyOwner(payload.id, payload.userId);
    }

    await this.pendaftaranRepo.deleteById(payload.id);
  }
}
