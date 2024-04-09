import {AdminRepository} from '../../../domain/admin/AdminRepository';
import {
  GetAdminOutput,
  GetAllAdminInput,
} from '../../../domain/admin/entity/admin';
import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {Pagination} from '../../../util/pagination';

export class GetAllAdminUsecase {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly akunRepo: AkunRepository,
  ) {}

  async execute({search = '', limit = 10, page = 1}: GetAllAdminInput) {
    search = search.toUpperCase();

    // get admin data
    const [totalResult, admin] = await this.adminRepo
        .getAll({search, limit, page});

    // map ids
    const ids = admin.map((data) => data.id);

    // get all akun by ids
    const akun = await this.akunRepo.getAllByIds(ids);

    const data: GetAdminOutput[] = admin.map((admin) => {
      return {
        id: admin.id,
        nama: admin.nama,
        email: function() {
          for (let i = 0; i < akun.length; i++) {
            if (admin.id == akun[i].id) {
              const email = akun[i].email;
              // remove the used element array
              // to minimize the next loops
              akun.splice(i, 1);

              return email;
            }
          }
        }() as string,
        // akun.filter((akun) => akun.id === admin.id)[0].id,
        jenis_kelamin: admin.jenis_kelamin,
        created_at: admin.created_at,
      };
    });

    return new Pagination({limit, page, totalResult, data});
  }
}
