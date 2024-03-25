import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {AddAkunReq, mapAddAdkunReq} from '../../../domain/akun/entity/akun';
import {AkunValidation} from '../../validation/AkunValidation';
import {Validation} from '../../validation/Validation';

export class AddAkunUsecase {
  constructor(private readonly akunRepository: AkunRepository) {}

  async execute(payload: AddAkunReq) {
    Validation.validate(AkunValidation.ADD, payload);
    const input = await mapAddAdkunReq(payload);
    await this.akunRepository.add(input);
  }
}
