import {ResponseError} from '../../../common/error/response-error';
import {GetPendaftaranByIdOutput}
  from '../../../domain/pendaftaran/entity/pendaftaran';
import {PendaftaranRepository}
  from '../../../domain/pendaftaran/PendaftaranRepository';
import {JwtSignPayload} from '../../../infrastructure/security/Jwt';
import {Role} from '../../../util/enum';
import {PendaftaranValidation} from '../../validation/PendaftaranValidation';
import {Validation} from '../../validation/Validation';
import {GetPendaftarByIdUsecase} from '../pendaftar/GetById';
import {GetProdiByIdUsecase} from '../prodi/GetByIdUsecase';

export class GetPendaftaranByIdUsecase {
  constructor(
    private readonly pendaftaranRepo: PendaftaranRepository,
    private readonly getPendaftarByIdUsecase: GetPendaftarByIdUsecase,
    private readonly getProdiByIdUsecase: GetProdiByIdUsecase,
  ) {}

  async execute(payload: {id: string, userData: JwtSignPayload}) {
    Validation.validate(PendaftaranValidation.GET_BY_ID, payload);

    const {id, userData} = payload;
    const forbiddenError = new ResponseError(403, 'Anda tidak memiliki akses');

    await this.pendaftaranRepo.verify(id);

    const pendaftaran = await this.pendaftaranRepo.getById(id);
    const pendaftar = await this.getPendaftarByIdUsecase
        .execute(pendaftaran.id_pendaftar);
    const prodi = await this.getProdiByIdUsecase.execute(pendaftaran.id_prodi);

    switch (userData.role) {
      case Role.OPERATOR:
        if (prodi.universitas.id !== userData.id_universitas) {
          throw forbiddenError;
        }
      case Role.PENDAFTAR:
        if (pendaftaran.id_pendaftar !== userData.id) {
          throw forbiddenError;
        }
      case Role.SEKOLAH:
        if (pendaftar.asal_sekolah.id !== userData.id_sekolah) {
          throw forbiddenError;
        }
    }

    const output: GetPendaftaranByIdOutput = {
      id: pendaftaran.id,
      jalur_pendaftaran: pendaftaran.jalur_pendaftaran,
      status: pendaftaran.status,
      created_at: pendaftaran.created_at,
      prodi: {
        id: prodi.id,
        nama: prodi.nama,
        jenjang: prodi.jenjang,
        akreditasi: prodi.akreditasi,
        biaya_pendaftaran: prodi.biaya_pendaftaran,
        ukt: prodi.ukt,
        universitas: {
          id: prodi.universitas.id,
          nama: prodi.universitas.nama,
          jenis: prodi.universitas.jenis,
          logo_url: prodi.universitas.logo_url,
        },
      },
      pendaftar,
    };

    return output;
  }
}
