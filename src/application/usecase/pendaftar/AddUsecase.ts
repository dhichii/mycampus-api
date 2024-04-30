import {ResponseError} from '../../../common/error/response-error';
import {PendaftarRepository}
  from '../../../domain/pendaftar/PendaftarRepository';
import {AddPendaftarReq, mapAddPendaftarReq}
  from '../../../domain/pendaftar/entity/pendaftar';
import {SekolahRepository} from '../../../domain/sekolah/SekolahRepository';
import {prismaClient} from '../../../infrastructure/database/prisma';
import {Role} from '../../../util/enum';
import {PendaftarValidation} from '../../validation/PendaftarValidation';
import {Validation} from '../../validation/Validation';
import {AddAkunUsecase} from '../akun/AddUsecase';
import {AddSekolahUsecase} from '../sekolah/AddUsecase';
import {v4 as uuid} from 'uuid';

export class AddPendaftarUsecase {
  constructor(
    private readonly pendaftarRepo: PendaftarRepository,
    private readonly sekolahRepo: SekolahRepository,
    private readonly addSekolahUsecase: AddSekolahUsecase,
    private readonly addAkunUsecase: AddAkunUsecase,
  ) {}

  async execute(payload: AddPendaftarReq) {
    Validation.validate(PendaftarValidation.ADD, payload);

    const id = uuid();
    const {email, password} = payload;

    await prismaClient.$transaction(async (tx) => {
      // add new sekolah when id_sekolah is empty
      const namaSekolah = payload.asal_sekolah.toUpperCase();
      try {
        const sekolah = await this.sekolahRepo.getByNama(namaSekolah);
        payload.id_sekolah = sekolah.id;
      } catch (e) {
        if (e instanceof ResponseError && e.message == 'sekolah not found') {
          const sekolah = await this.addSekolahUsecase.execute({
            nama: payload.asal_sekolah,
          }) as {id: string, nama: string};
          payload.id_sekolah = sekolah.id;
        }
      }

      await this.addAkunUsecase
          .execute({id, email, password, role: Role.PENDAFTAR});
      await this.pendaftarRepo.add(mapAddPendaftarReq(payload, id));
    });

    return id;
  }
}
