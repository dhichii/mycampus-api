import {UniversitasRepository}
  from '../../../domain/universitas/UniversitasRepository';
import {EditLogoUniversitasReq}
  from '../../../domain/universitas/entity/universitas';
import {deleteFile} from '../../../util/file';
import {UniversitasValidation} from '../../validation/UniversitasValidation';
import {Validation} from '../../validation/Validation';

export class EditLogoUniversitasByIdUsecase {
  constructor(private readonly universitasRepo: UniversitasRepository) {}

  async execute(payload: EditLogoUniversitasReq) {
    Validation.validate(UniversitasValidation.EDIT_LOGO_BY_ID, payload);
    const {id, path, logo} = payload;
    const {logo_url: oldLogoUrl} = await this.universitasRepo.getById(id);

    await this.universitasRepo.editLogoById(id, logo);
    await deleteFile(path + oldLogoUrl);
  }
}
