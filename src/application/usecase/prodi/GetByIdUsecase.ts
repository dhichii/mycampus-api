import {ProdiRepository} from '../../../domain/prodi/ProdiRepository';
import {GetProdiByIdOutput} from '../../../domain/prodi/entity/prodi';
import {Prodivalidation} from '../../validation/ProdiValidation';
import {Validation} from '../../validation/Validation';

export class GetProdiByIdUsecase {
  constructor(private readonly prodiRepo: ProdiRepository) {}

  async execute(id: string) {
    Validation.validate(Prodivalidation.GET_BY_ID, {id});

    await this.prodiRepo.verify(id);

    const prodi = await this.prodiRepo.getById(id);

    const output: GetProdiByIdOutput = {
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
      keterangan: prodi.keterangan,
      potensi_karir: prodi.potensi_karir.map((potensiKarir) => {
        return {
          id: potensiKarir.id,
          nama: potensiKarir.nama,
        };
      }),
    };

    return output;
  }
}
