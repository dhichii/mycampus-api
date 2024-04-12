import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {AkunValidation} from '../../validation/AkunValidation';
import {Validation} from '../../validation/Validation';

export class DeleteAkunById {
  constructor(private readonly akunRepo: AkunRepository) {}

  async execute(id: string) {
    Validation.validate(AkunValidation.DELETE, {id});

    await this.akunRepo.verify(id);
    await this.akunRepo.deleteById(id);
  }
}
