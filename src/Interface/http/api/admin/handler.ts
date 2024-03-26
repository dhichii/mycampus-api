import autoBind from 'auto-bind';
import {NextFunction, Request, Response} from 'express';
import {AddAdminReq} from '../../../../domain/admin/entity/admin';
import {AddAdminUsecase}
  from '../../../../application/usecase/admin/AddUsecase';
import {GetAllAdminUsecase}
  from '../../../../application/usecase/admin/GetAllUsecase';
import {GetAdminByIdUsecase}
  from '../../../../application/usecase/admin/GetByIdUsecase';
import {EditAdminByIdUsecase}
  from '../../../../application/usecase/admin/EditByIdUsecase';
import {DeleteAdminByIdUsecase}
  from '../../../../application/usecase/admin/DeleteByIdUsecase';
import {parseNumber} from '../../../../util/parser';

export class AdminHandler {
  constructor(
    private readonly addAdminUsecase: AddAdminUsecase,
    private readonly getAllAdminUsecase: GetAllAdminUsecase,
    private readonly getAdminByIdUsecase: GetAdminByIdUsecase,
    private readonly editAdminByIdUsecase: EditAdminByIdUsecase,
    private readonly deleteAdminByIdUsecase: DeleteAdminByIdUsecase,
  ) {
    autoBind(this);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: AddAdminReq = {...req.body};
      await this.addAdminUsecase.execute(payload);

      res.status(201).json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParams = req.query;
      const search = queryParams.search as string;
      const limit = parseNumber('limit', queryParams.limit as string) as number;
      const page = parseNumber('page', queryParams.page as string) as number;
      const payload = {search, limit, page};
      const data = await this.getAllAdminUsecase.execute(payload);

      res.json({status: 'success', ...data});
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.getAdminByIdUsecase.execute(req.params.id);

      res.json({status: 'success', data});
    } catch (e) {
      next(e);
    }
  }

  async editById(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = {...req.body, id: req.params.id};
      await this.editAdminByIdUsecase.execute(payload);

      res.status(200).json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await this.deleteAdminByIdUsecase.execute(req.params.id);

      res.status(200).json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }
}
