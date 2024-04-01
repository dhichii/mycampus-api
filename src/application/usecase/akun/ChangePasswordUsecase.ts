import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {Bcrypt} from '../../../infrastructure/security/Bcrypt';
import {AkunValidation} from '../../validation/AkunValidation';
import {Validation} from '../../validation/Validation';

export class ChangePasswordUsecase {
  constructor(private readonly akunRepo: AkunRepository) {}

  async execute({id= '', password= ''}) {
    Validation.validate(AkunValidation.CHANGE_PASSWORD, {id, password});

    await this.akunRepo.verify(id);

    const hashedPassword = await new Bcrypt().hash(password);

    await this.akunRepo.changePassword(id, hashedPassword);
  }
}
