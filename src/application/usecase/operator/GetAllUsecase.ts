import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {OperatorRepository} from '../../../domain/operator/OperatorRepository';
import {
  GetAllOperatorInput,
  GetOperatorOutput,
} from '../../../domain/operator/entity/operator';
import {UniversitasRepository}
  from '../../../domain/universitas/UniversitasRepository';
import {Pagination} from '../../../util/pagination';

export class GetAlloperatorUsecase {
  constructor(
    private readonly operatorRepo: OperatorRepository,
    private readonly akunRepo: AkunRepository,
    private readonly universitasRepo: UniversitasRepository,
  ) {}

  async execute({search = '', limit = 10, page = 1}: GetAllOperatorInput) {
    search = search.toUpperCase();

    // get operator data
    const [totalResult, operator] = await this.operatorRepo
        .getAll({search, limit, page});

    // map ids and id_universitas
    const ids: string[] = [];
    const universitasIds: number[] = [];

    for (let i = 0; i < operator.length; i++) {
      ids.push(operator[i].id);
      universitasIds.push(operator[i].id_universitas);
    }

    // get all akun by ids
    const akun = await this.akunRepo.getAllByIds(ids);

    // get all universitas by ids
    const universitas = await this.universitasRepo.getAllByIds(universitasIds);

    const data = operator.map((operator) => {
      return {
        id: operator.id,
        nama: operator.nama,
        email: function() {
          for (let i = 0; i < akun.length; i++) {
            if (operator.id == akun[i].id) {
              const email = akun[i].email;
              // remove the used element array
              // to minimize the next loops
              akun.splice(i, 1);

              return email;
            }
          }
        }() as string,
        jenis_kelamin: operator.jenis_kelamin,
        created_at: operator.created_at,
        universitas: function() {
          for (let i = 0; i < akun.length; i++) {
            if (operator.id_universitas == universitas[i].id) {
              const currUniv = universitas[i];
              // remove the used element array
              // to minimize the next loops
              universitas.splice(i, 1);

              return {
                id: currUniv.id,
                nama: currUniv.nama,
              };
            }
          }
        }(),
      };
    }) as GetOperatorOutput[];

    return new Pagination({limit, page, totalResult, data});
  }
}
