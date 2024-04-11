/* eslint-disable camelcase */
import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {OperatorRepository} from '../../../domain/operator/OperatorRepository';
import {GetOperatorOutput} from '../../../domain/operator/entity/operator';
import {UniversitasRepository}
  from '../../../domain/universitas/UniversitasRepository';
import {Validation} from '../../validation/Validation';
import {OperatorValidation} from '../../validation/operator';

export class GetOperatorByIdUsecase {
  constructor(
    private readonly operatorRepo: OperatorRepository,
    private readonly akunRepo: AkunRepository,
    private readonly universitasRepo: UniversitasRepository,
  ) {}

  async execute(id: string) {
    Validation.validate(OperatorValidation.GET_BY_ID, {id});

    const {email} = await this.akunRepo.getById(id);
    const {
      nama,
      id_universitas,
      jenis_kelamin,
      created_at,
    } = await this.operatorRepo.getById(id);
    const universitas = await this.universitasRepo.getById(id_universitas);
    return {
      id, nama, email, jenis_kelamin, created_at,
      universitas: {
        id: universitas.id,
        nama: universitas.nama,
      },
    } as GetOperatorOutput;
  }
}
