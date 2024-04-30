import {ProdiRepository} from '../../../domain/prodi/ProdiRepository';
import {AddProdiReq, mapAddProdiReq} from '../../../domain/prodi/entity/prodi';
import {UniversitasRepository}
  from '../../../domain/universitas/UniversitasRepository';
import {Prodivalidation} from '../../validation/ProdiValidation';
import {Validation} from '../../validation/Validation';

export class AddProdiUsecase {
  constructor(
    private readonly prodiRepo: ProdiRepository,
    private readonly univRepo: UniversitasRepository,
  ) {}

  async execute(payload: AddProdiReq) {
    Validation.validate(Prodivalidation.ADD, payload);

    await this.univRepo.verify(payload.id_universitas);

    const id = await this.prodiRepo.add(
        mapAddProdiReq(payload),
        payload.potensi_karir,
    );

    return {id};
  }
}
