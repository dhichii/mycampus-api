import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {PendaftarRepository}
  from '../../../domain/pendaftar/PendaftarRepository';
import {GetAllPendaftarInput} from '../../../domain/pendaftar/entity/pendaftar';
import {SekolahRepository} from '../../../domain/sekolah/SekolahRepository';
import {Pagination} from '../../../util/pagination';

export class GetAllPendaftarUsecase {
  constructor(
    private readonly pendaftarRepo: PendaftarRepository,
    private readonly akunRepo: AkunRepository,
    private readonly sekolahRepo: SekolahRepository,
  ) {}

  async execute(payload: GetAllPendaftarInput) {
    payload.search = payload.search?.toUpperCase();
    payload.limit = (!payload.limit) ? 10 : payload.limit;
    payload.page = (!payload.page) ? 1 : payload.page;

    const {limit, page} = payload;

    // get pendaftar data
    const [totalResult, pendaftar] = await this.pendaftarRepo
        .getAll(payload);

    // map ids and sekolah ids
    const ids: string[] = [];
    const sekolahIds: string[] = [];
    for (let i = 0; i < pendaftar.length; i++) {
      ids.push(pendaftar[i].id);
      sekolahIds.push(pendaftar[i].id_sekolah);
    }

    // get all akun by ids
    const akun = await this.akunRepo.getAllByIds(ids);

    // get all sekolah by sekolah ids
    const sekolah = await this.sekolahRepo.getAllByIds(sekolahIds);

    const data = pendaftar.map((pendaftar) => {
      return {
        id: pendaftar.id,
        nama: pendaftar.nama,
        nisn: pendaftar.nisn,
        nik: pendaftar.nik,
        email: function() {
          for (let i = 0; i < akun.length; i++) {
            if (pendaftar.id == akun[i].id) {
              const email = akun[i].email;
              // remove the used element array
              // to minimize the next loops
              akun.splice(i, 1);

              return email;
            }
          }
        }(),
        jenis_kelamin: pendaftar.jenis_kelamin,
        created_at: pendaftar.created_at,
        asal_sekolah: function() {
          for (let i = 0; i < sekolah.length; i++) {
            if (pendaftar.id_sekolah == sekolah[i].id) {
              const currentSekolah = sekolah[i];
              // remove the used element array
              // to minimize the next loops
              sekolah.splice(i, 1);

              return currentSekolah;
            }
          }
        }(),
      };
    });

    return new Pagination({limit, page, totalResult, data});
  }
}
