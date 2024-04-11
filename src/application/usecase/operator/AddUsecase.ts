import {Role} from '../../../util/enum';
import {AddAkunUsecase} from '../akun/AddUsecase';
import {v4 as uuid} from 'uuid';
import {prismaClient} from '../../../infrastructure/database/prisma';
import {Validation} from '../../validation/Validation';
import {OperatorRepository} from '../../../domain/operator/OperatorRepository';
import {
  AddOperatorReq,
  mapAddOperatorReq,
} from '../../../domain/operator/entity/operator';
import {OperatorValidation} from '../../validation/operator';

export class AddOperatorUsecase {
  constructor(
    private readonly operatorRepo: OperatorRepository,
    private readonly addAkunUsecase: AddAkunUsecase,
  ) {}

  async execute(payload: AddOperatorReq) {
    Validation.validate(OperatorValidation.ADD, payload);

    const id = uuid();
    const {email, password} = payload;
    await prismaClient.$transaction(async (tx) => {
      await this.addAkunUsecase
          .execute({id, email, password, role: Role.OPERATOR});
      await this.operatorRepo.add(mapAddOperatorReq(payload, id));
    });

    return id;
  }
}
