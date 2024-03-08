import {UniversitasRepository}
  from '../../../domain/universitas/UniversitasRepository';
import {deleteFile} from '../../../util/file';
import {UniversitasValidation} from '../../validation/UniversitasValidation';
import {Validation} from '../../validation/Validation';

export class DeleteUniversitasByIdUsecase {
  constructor(private readonly universitasRepo: UniversitasRepository) {}

  async execute(id: number, path: string) {
    Validation.validate(UniversitasValidation.DELETE_BY_ID, {id, path});
    const {logo_url: url} = await this.universitasRepo.getById(id);
    await this.universitasRepo.deleteById(id);
    await deleteFile(path + url);
  }
}
