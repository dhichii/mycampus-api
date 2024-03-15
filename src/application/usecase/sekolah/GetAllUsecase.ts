import {SekolahRepository} from '../../../domain/sekolah/SekolahRepository';
import {GetAllSekolahInput} from '../../../domain/sekolah/entity/sekolah';
import {Pagination} from '../../../util/pagination';

export class GetAllSekolahUsecase {
  constructor(private readonly sekolahRepo: SekolahRepository) {}

  async execute({search = '', limit = 10, page = 1}: GetAllSekolahInput) {
    search = search.toUpperCase();

    const [totalResult, data] = await this.sekolahRepo
        .getAll({search, limit, page});

    return new Pagination({limit, page, totalResult, data});
  }
}
