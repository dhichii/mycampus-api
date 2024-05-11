import {PendaftarRepository}
  from '../../../domain/pendaftar/PendaftarRepository';
import {PendaftaranRepository}
  from '../../../domain/pendaftaran/PendaftaranRepository';
import {
  AddPendaftaranReq,
  mapAddPendaftaranReq,
} from '../../../domain/pendaftaran/entity/pendaftaran';
import {ProdiRepository} from '../../../domain/prodi/ProdiRepository';
import {PendaftaranValidation} from '../../validation/PendaftaranValidation';
import {Validation} from '../../validation/Validation';

export class AddPendaftaranUsecase {
  constructor(
    private readonly pendaftaranRepo: PendaftaranRepository,
    private readonly pendaftarRepo: PendaftarRepository,
    private readonly prodiRepo: ProdiRepository,
  ) {}

  async execute(payload: AddPendaftaranReq) {
    Validation.validate(PendaftaranValidation.ADD, payload);

    await this.pendaftarRepo.verify(payload.id_pendaftar);
    await this.prodiRepo.verify(payload.id_prodi);
    await this.pendaftaranRepo
        .isRegistered(payload.id_prodi, payload.id_pendaftar);

    const id = await this.pendaftaranRepo.add(mapAddPendaftaranReq(payload));

    return {id};
  }
}
