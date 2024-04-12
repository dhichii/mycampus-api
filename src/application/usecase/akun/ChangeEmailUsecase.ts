import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {AkunValidation} from '../../validation/AkunValidation';
import {Validation} from '../../validation/Validation';

export class ChangeEmailUsecase {
  constructor(private readonly akunRepo: AkunRepository) {}

  async execute({id= '', email= ''}) {
    Validation.validate(AkunValidation.CHANGE_EMAIL, {id, email});

    await this.akunRepo.verify(id);
    await this.akunRepo.changeEmail(id, email);
  }
}
