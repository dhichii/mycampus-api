import {ProdiRepository} from '../../../domain/prodi/ProdiRepository';
import {
  GetAllProdiInput,
  GetAllProdiOutput,
} from '../../../domain/prodi/entity/prodi';
import {Pagination} from '../../../util/pagination';
import {Prodivalidation} from '../../validation/ProdiValidation';
import {Validation} from '../../validation/Validation';

export class GetAllProdiUsecase {
  constructor(private readonly prodiRepo: ProdiRepository) {}

  async execute(payload: GetAllProdiInput) {
    payload.search = payload.search?.toUpperCase();
    payload.limit = payload.limit ? payload.limit : 10;
    payload.page = payload.page ? payload.page : 1;

    Validation.validate(Prodivalidation.GET_ALL, payload);

    const {limit, page} = payload;

    const [totalResult, prodi] = await this.prodiRepo.getAll(payload);

    const data: GetAllProdiOutput[] = prodi.map((prodi) => {
      return {
        id: prodi.id,
        nama: prodi.nama,
        universitas: {
          id: prodi.universitas.id,
          nama: prodi.universitas.nama,
          jenis: prodi.universitas.jenis,
          logo_url: prodi.universitas.logo_url,
        },
        kode_prodi: prodi.kode_prodi,
        jenjang: prodi.jenjang,
        status: prodi.status,
        akreditasi: prodi.akreditasi,
        biaya_pendaftaran: prodi.biaya_pendaftaran,
        ukt: prodi.ukt,
        potensi_karir: prodi.potensi_karir.map((potensiKarir) => {
          return {
            id: potensiKarir.id,
            nama: potensiKarir.nama,
          };
        }),
      };
    });

    return new Pagination({limit, page, totalResult, data});
  }
}
