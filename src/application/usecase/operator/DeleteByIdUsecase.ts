import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {OperatorRepository} from '../../../domain/operator/OperatorRepository';
import {prismaClient} from '../../../infrastructure/database/prisma';
import {Validation} from '../../validation/Validation';
import {OperatorValidation} from '../../validation/operator';

export class DeleteOperatorByIdUsecase {
  constructor(
    private readonly operatorRepo: OperatorRepository,
    private readonly akunRepo: AkunRepository,
  ) {}

  async execute(id: string) {
    Validation.validate(OperatorValidation.DELETE_BY_ID, {id});

    await this.akunRepo.verify(id);
    await this.operatorRepo.verify(id);

    await prismaClient.$transaction(async (tx) => {
      await this.akunRepo.deleteById(id);
      await this.operatorRepo.deleteById(id);
    });
  }
}
