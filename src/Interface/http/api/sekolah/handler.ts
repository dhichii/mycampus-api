import autoBind from 'auto-bind';
import {AddSekolahUsecase}
  from '../../../../application/usecase/sekolah/AddUsecase';
import {GetAllSekolahUsecase}
  from '../../../../application/usecase/sekolah/GetAllUsecase';
import {EditSekolahByIdUsecase}
  from '../../../../application/usecase/sekolah/EditByIdUsecase';
import {NextFunction, Request, Response} from 'express';
import {parseNumber} from '../../../../util/parser';
import {DeleteSekolahByIdUsecase}
  from '../../../../application/usecase/sekolah/DeleteByIdUsecase';

export class SekolahHandler {
  constructor(
    private readonly addSekolahUsecase: AddSekolahUsecase,
    private readonly getAllSekolahUsecase: GetAllSekolahUsecase,
    private readonly editSekolahByIdUsecase: EditSekolahByIdUsecase,
    private readonly deleteSekolahByIdUsecase: DeleteSekolahByIdUsecase,
  ) {
    autoBind(this);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.addSekolahUsecase.execute(req.body);
      res.status(201).json({status: 'success', data});
    } catch (e) {
      next(e);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParam = req.query;
      const search = queryParam.search as string;
      const limit = parseNumber('limit', queryParam.limit as string) as number;
      const page = parseNumber('page', queryParam.page as string) as number;
      const payload = {search, limit, page};
      const data = await this.getAllSekolahUsecase.execute(payload);
      res.json({status: 'success', ...data});
    } catch (e) {
      next(e);
    }
  }

  async editById(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = {...req.body};
      payload.id = req.params.id;
      await this.editSekolahByIdUsecase.execute(payload);
      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await this.deleteSekolahByIdUsecase.execute(id);
      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }
}
