import {ResponseError} from '../../../common/error/response-error';
import {PendaftarRepository}
  from '../../../domain/pendaftar/PendaftarRepository';
import {
  EditPendaftarReq,
  mapEditPendaftarReq,
} from '../../../domain/pendaftar/entity/pendaftar';
import {SekolahRepository} from '../../../domain/sekolah/SekolahRepository';
import {prismaClient} from '../../../infrastructure/database/prisma';
import {PendaftarValidation} from '../../validation/PendaftarValidation';
import {Validation} from '../../validation/Validation';
import {AddSekolahUsecase} from '../sekolah/AddUsecase';

export class EditPendaftarByIdUsecase {
  constructor(
    private readonly pendaftarRepo: PendaftarRepository,
    private readonly sekolahRepo: SekolahRepository,
    private readonly addSekolahUsecase: AddSekolahUsecase,
  ) {}

  async execute(payload: EditPendaftarReq) {
    Validation.validate(PendaftarValidation.EDIT_BY_ID, payload);

    await this.pendaftarRepo.verify(payload.id);

    await prismaClient.$transaction(async (tx) => {
      // add new sekolah when id_sekolah is empty
      const namaSekolah = payload.asal_sekolah.toUpperCase();
      try {
        const sekolah = await this.sekolahRepo.getByNama(namaSekolah);
        payload.id_sekolah = sekolah.id;
      } catch (e) {
        if (e instanceof ResponseError && e.message == 'sekolah not found') {
          const sekolah = await this.addSekolahUsecase.execute({
            nama: namaSekolah,
          }) as {id: string, nama: string};
          payload.id_sekolah = sekolah.id;
        }
      }

      await this.pendaftarRepo.editById(
          payload.id,
          mapEditPendaftarReq(payload),
      );
    });
  }
}
