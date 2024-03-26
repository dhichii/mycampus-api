import {AdminRepository} from '../../../domain/admin/AdminRepository';
import {
  EditAdminReq,
  mapEditAdminReq,
} from '../../../domain/admin/entity/admin';
import {AdminValidation} from '../../validation/AdminValidation';
import {Validation} from '../../validation/Validation';

export class EditAdminByIdUsecase {
  constructor(private readonly adminRepo: AdminRepository) {}

  async execute(payload: EditAdminReq) {
    Validation.validate(AdminValidation.EDIT_BY_ID, payload);

    await this.adminRepo.verify(payload.id);
    await this.adminRepo.editById(payload.id, mapEditAdminReq(payload));
  }
}
