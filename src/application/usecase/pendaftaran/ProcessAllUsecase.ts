import {PendaftaranRepository}
  from '../../../domain/pendaftaran/PendaftaranRepository';
import {PendaftaranValidation} from '../../validation/PendaftaranValidation';
import {Validation} from '../../validation/Validation';

export class ProcessAllPendaftaranUsecase {
  constructor(private readonly pendaftaranRepo: PendaftaranRepository) {}

  async execute(universitasId: number) {
    Validation.validate(
        PendaftaranValidation.PROCESS_ALL,
        {id_universitas: universitasId},
    );

    await this.pendaftaranRepo.processAll(universitasId);
  }
}
