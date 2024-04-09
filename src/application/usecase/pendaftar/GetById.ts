import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {PendaftarRepository}
  from '../../../domain/pendaftar/PendaftarRepository';
import {GetPendaftarByIdOutput}
  from '../../../domain/pendaftar/entity/pendaftar';
import {SekolahRepository} from '../../../domain/sekolah/SekolahRepository';
import {convertDatetimeToDateString} from '../../../util/date';
import {PendaftarValidation} from '../../validation/PendaftarValidation';
import {Validation} from '../../validation/Validation';

export class GetPendaftarByIdUsecase {
  constructor(
    private readonly pendaftarRepo: PendaftarRepository,
    private readonly akunRepo: AkunRepository,
    private readonly sekolahRepo: SekolahRepository,
  ) {}

  async execute(id: string) {
    Validation.validate(PendaftarValidation.GET_BY_ID, {id});

    const {email} = await this.akunRepo.getById(id);
    const pendaftar = await this.pendaftarRepo.getById(id);
    const sekolah = await this.sekolahRepo.getById(pendaftar.id_sekolah);

    return {
      id,
      nama: pendaftar.nama,
      nisn: pendaftar.nisn,
      nik: pendaftar.nik,
      email,
      jenis_kelamin: pendaftar.jenis_kelamin,
      kewarganegaraan: pendaftar.kewarganegaraan,
      tempat_lahir: pendaftar.tempat_lahir,
      tanggal_lahir: convertDatetimeToDateString(
        pendaftar.tanggal_lahir as unknown as Date,
      ),
      agama: pendaftar.agama,
      alamat_jalan: pendaftar.alamat_jalan,
      rt: pendaftar.rt,
      rw: pendaftar.rw,
      kelurahan: pendaftar.kelurahan,
      kecamatan: pendaftar.kecamatan,
      provinsi: pendaftar.provinsi,
      no_hp: pendaftar.no_hp,
      no_wa: pendaftar.no_wa,
      created_at: pendaftar.created_at,
      asal_sekolah: sekolah,
    } as GetPendaftarByIdOutput;
  }
}
