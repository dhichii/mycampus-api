import {ResponseError} from '../../../common/error/response-error';
import {PendaftaranRepository}
  from '../../../domain/pendaftaran/PendaftaranRepository';
import {EditStatusPendaftaranReq}
  from '../../../domain/pendaftaran/entity/pendaftaran';
import {Role} from '../../../util/enum';
import {PendaftaranValidation} from '../../validation/PendaftaranValidation';
import {Validation} from '../../validation/Validation';
import {GetProdiByIdUsecase} from '../prodi/GetByIdUsecase';

export class EditStatusPendaftaranByIdUsecase {
  constructor(
    private readonly pendaftaranRepo: PendaftaranRepository,
    private readonly getProdiByIdUsecase: GetProdiByIdUsecase,
  ) {}

  async execute(payload: EditStatusPendaftaranReq) {
    Validation.validate(PendaftaranValidation.EDIT_STATUS_BY_ID, payload);

    const pendaftaran = await this.pendaftaranRepo.getById(payload.id);
    if (payload.role == Role.OPERATOR) {
      const prodi = await this.getProdiByIdUsecase
          .execute(pendaftaran.id_prodi);
      if (prodi.universitas.id !== payload.id_universitas) {
        throw new ResponseError(403, 'Anda tidak memiliki akses');
      }
    }

    await this.pendaftaranRepo.editStatusById(payload.id, payload.status);
  }
}
