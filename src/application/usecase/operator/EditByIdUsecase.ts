import {OperatorRepository} from '../../../domain/operator/OperatorRepository';
import {
  EditOperatorReq,
  mapEditOperatorReq,
} from '../../../domain/operator/entity/operator';
import {Validation} from '../../validation/Validation';
import {OperatorValidation} from '../../validation/operator';

export class EditOperatorByIdUsecase {
  constructor(private readonly operatorRepo: OperatorRepository) {}

  async execute(payload: EditOperatorReq) {
    Validation.validate(OperatorValidation.EDIT_BY_ID, payload);

    await this.operatorRepo.verify(payload.id);
    await this.operatorRepo.editById(payload.id, mapEditOperatorReq(payload));
  }
}
