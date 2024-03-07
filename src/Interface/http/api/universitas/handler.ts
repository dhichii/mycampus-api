import {NextFunction, Request, Response} from 'express';
import {AddUniversitasUsecase}
  from '../../../../application/usecase/universitas/AddUsecase';
import {AddUniversitasReq, EditLogoUniversitasReq}
  from '../../../../domain/universitas/entity/universitas';
import {deleteFile} from '../../../../util/file';
import autoBind from 'auto-bind';
import {GetUniversitasByIdUsecase}
  from '../../../../application/usecase/universitas/GetByIdUsecase';
import {GetAllUniversitasUsecase}
  from '../../../../application/usecase/universitas/GetAllUsecase';
import {DeleteUniversitasByIdUsecase}
  from '../../../../application/usecase/universitas/DeleteByIdUsecase';
import {EditUniversitasByIdUsecase}
  from '../../../../application/usecase/universitas/EditByIdUsecase';
import {EditLogoUniversitasByIdUsecase}
  from '../../../../application/usecase/universitas/EditLogoByIdUsecase';

export class UniversitasHandler {
  constructor(
    private readonly logoPath: string,
    private readonly addUniversitasUsecase: AddUniversitasUsecase,
    private readonly getAllUniversitasUsecase: GetAllUniversitasUsecase,
    private readonly getUniversitasByIdUsecase: GetUniversitasByIdUsecase,
    private readonly editUniversitasByIdUsecase: EditUniversitasByIdUsecase,
    private readonly deleteUniversitasByIdUsecase: DeleteUniversitasByIdUsecase,
    // eslint-disable-next-line max-len
    private readonly editLogoUniversitasByIdUsecase: EditLogoUniversitasByIdUsecase,
  ) {
    autoBind(this);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = {
        ...req.body,
        logo_url: req.file?.filename,
      } as AddUniversitasReq;
      const data = await this.addUniversitasUsecase.execute(payload);
      res.status(201).json({status: 'success', data});
    } catch (e) {
      if (req.file) {
        await deleteFile(req.file?.path as string);
      }
      next(e);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.getAllUniversitasUsecase.execute();
      res.status(200).json({data});
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.getUniversitasByIdUsecase.execute(id);
      res.status(200).json({status: 'success', data});
    } catch (e) {
      next(e);
    }
  }

  async editById(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      payload.id = parseInt(req.params.id);
      await this.editUniversitasByIdUsecase.execute(payload);
      res.status(200).json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.deleteUniversitasByIdUsecase.execute(id, this.logoPath);
      res.status(200).json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async editLogoById(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = {
        id: parseInt(req.params.id),
        path: this.logoPath,
        logo_url: req.file?.filename,
      } as EditLogoUniversitasReq;
      await this.editLogoUniversitasByIdUsecase.execute(payload);
      res.status(200).json({status: 'success'});
    } catch (e) {
      await deleteFile(req.file?.path as string);
      next(e);
    }
  }
}
