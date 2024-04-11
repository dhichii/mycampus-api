import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {PendaftarRepository}
  from '../../../domain/pendaftar/PendaftarRepository';
import {prismaClient} from '../../../infrastructure/database/prisma';
import {PendaftarValidation} from '../../validation/PendaftarValidation';
import {Validation} from '../../validation/Validation';

export class DeletePendaftarByIdUsecase {
  constructor(
    private readonly pendaftarRepo: PendaftarRepository,
    private readonly akunRepo: AkunRepository,
  ) {}

  async execute(id: string) {
    Validation.validate(PendaftarValidation.DELETE_BY_ID, {id});

    await this.akunRepo.verify(id);
    await this.pendaftarRepo.verify(id);

    await prismaClient.$transaction(async (tx) => {
      await this.akunRepo.deleteById(id);
      await this.pendaftarRepo.deleteById(id);
    });
  }
}
