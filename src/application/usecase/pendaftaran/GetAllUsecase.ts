import {PendaftaranRepository}
  from '../../../domain/pendaftaran/PendaftaranRepository';
import {GetAllPendaftaranInput}
  from '../../../domain/pendaftaran/entity/pendaftaran';
import {JwtSignPayload} from '../../../infrastructure/security/Jwt';
import {Role} from '../../../util/enum';
import {Pagination} from '../../../util/pagination';

export class GetAllPendaftaranUsecase {
  constructor(private readonly pendaftaranRepo: PendaftaranRepository) {}

  async execute(payload: {
    userData: JwtSignPayload,
    input: GetAllPendaftaranInput,
  }) {
    const {userData, input} = payload;

    input.limit = input.limit ? input.limit : 10;
    input.page = input.page ? input.page : 1;

    // input query parameter by role
    switch (userData.role) {
      case Role.PENDAFTAR:
        input.userId = userData.id;
      case Role.OPERATOR:
        input.universitas = userData.id_universitas;
      case Role.SEKOLAH:
        input.sekolah = userData.id_sekolah;
    }

    const [totalResult, data] = await this.pendaftaranRepo.getAll(input);

    data.map((pendaftaran) => {
      const prodi = pendaftaran.prodi;
      const pendaftar = pendaftaran.pendaftar;
      return {
        id: pendaftaran.id,
        jalur_pendaftaran: pendaftaran.jalur_pendaftaran,
        status: pendaftaran.status,
        created_at: pendaftaran.created_at,
        prodi: {
          id: prodi.id,
          nama: prodi.nama,
          jenjang: prodi.jenjang,
          universitas: {
            id: prodi.universitas.id,
            nama: prodi.universitas.nama,
            jenis: prodi.universitas.jenis,
            logo_url: prodi.universitas.logo_url,
          },
        },
        pendaftar: {
          id: pendaftar.id,
          nama: pendaftar.nama,
          nisn: pendaftar.nisn,
        },
      };
    });

    const {limit, page} = input;

    return new Pagination({limit, page, totalResult, data});
  }
}
