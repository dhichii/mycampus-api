import {PotensiKarirRepository}
  from '../../../domain/potensi_karir/PotensiKarirRepository';
import {GetAllPotensiKarirInput}
  from '../../../domain/potensi_karir/entity/potensi-karir';
import {Pagination} from '../../../util/pagination';

export class GetAllPotensiKarirUseCase {
  constructor(private readonly potensiKarirRepo: PotensiKarirRepository) {}

  async execute(payload: GetAllPotensiKarirInput) {
    payload.search = payload.search?.toUpperCase();
    payload.limit = payload.limit ? payload.limit : 10;
    payload.page = payload.page ? payload.page : 1;

    const {limit, page} = payload;

    const [totalResult, data] = await this.potensiKarirRepo.getAll(payload);

    return new Pagination({limit, page, totalResult, data});
  }
}
