import {AdminRepository} from '../../../domain/admin/AdminRepository';
import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {prismaClient} from '../../../infrastructure/database/prisma';
import {AdminValidation} from '../../validation/AdminValidation';
import {Validation} from '../../validation/Validation';

export class DeleteAdminByIdUsecase {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly akunRepo: AkunRepository,
  ) {}

  async execute(id: string) {
    Validation.validate(AdminValidation.DELETE_BY_ID, {id});

    await this.akunRepo.verify(id);
    await this.adminRepo.verify(id);

    await prismaClient.$transaction(async (tx) => {
      await this.akunRepo.deleteById(id);
      await this.adminRepo.deleteById(id);
    });
  }
}
