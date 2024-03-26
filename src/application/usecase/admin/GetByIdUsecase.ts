/* eslint-disable camelcase */
import {AdminRepository} from '../../../domain/admin/AdminRepository';
import {GetAdminOutput} from '../../../domain/admin/entity/admin';
import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {AdminValidation} from '../../validation/AdminValidation';
import {Validation} from '../../validation/Validation';

export class GetAdminByIdUsecase {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly akunRepo: AkunRepository,
  ) {}

  async execute(id: string) {
    Validation.validate(AdminValidation.GET_BY_ID, {id});

    const {email} = await this.akunRepo.getById(id);
    const {nama, jenis_kelamin, created_at} = await this.adminRepo.getById(id);

    return {
      id, nama, email, jenis_kelamin,
      created_at: created_at.toLocaleString(),
    } as GetAdminOutput;
  }
}
