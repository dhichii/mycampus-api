import {Role} from '../../../util/enum';
import {AdminRepository} from '../../../domain/admin/AdminRepository';
import {AddAdminReq, mapAddAdminReq} from '../../../domain/admin/entity/admin';
import {AddAkunUsecase} from '../akun/AddUsecase';
import {v4 as uuid} from 'uuid';
import {prismaClient} from '../../../infrastructure/database/prisma';
import {Validation} from '../../validation/Validation';
import {AdminValidation} from '../../validation/AdminValidation';

export class AddAdminUsecase {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly addAkunUsecase: AddAkunUsecase,
  ) {}

  async execute(payload: AddAdminReq) {
    Validation.validate(AdminValidation.ADD, payload);

    const id = uuid();
    const {email, password} = payload;
    await prismaClient.$transaction(async (tx) => {
      await this.addAkunUsecase
          .execute({id, email, password, role: Role.ADMIN});
      await this.adminRepo.add(mapAddAdminReq(payload, id));
    });

    return id;
  }
}
