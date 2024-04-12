import {NextFunction, Request, Response} from 'express';
import {DeletePendaftarByIdUsecase}
  from '../../../../application/usecase/pendaftar/DeleteByIdUsecase';
import {EditPendaftarByIdUsecase}
  from '../../../../application/usecase/pendaftar/EditByIdUsecase';
import {GetAllPendaftarUsecase}
  from '../../../../application/usecase/pendaftar/GetAllUsecase';
import {GetPendaftarByIdUsecase}
  from '../../../../application/usecase/pendaftar/GetById';
import {parseNumber} from '../../../../util/parser';
import autoBind from 'auto-bind';

export class PendaftarHandler {
  constructor(
    private readonly getAllPendaftarUsecase: GetAllPendaftarUsecase,
    private readonly getPendaftarByIdUsecase: GetPendaftarByIdUsecase,
    private readonly editPendaftarByIdUsecase: EditPendaftarByIdUsecase,
    private readonly deletePendaftarByIdUsecase: DeletePendaftarByIdUsecase,
  ) {
    autoBind(this);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParams = req.query;
      const limit = parseNumber('limit', queryParams.limit as string) as number;
      const page = parseNumber('page', queryParams.page as string) as number;
      const data = await this.getAllPendaftarUsecase.execute({
        ...queryParams,
        limit,
        page,
      });

      res.json({status: 'success', ...data});
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.getPendaftarByIdUsecase.execute(req.params.id);

      res.json({status: 'success', data});
    } catch (e) {
      next(e);
    }
  }

  async editById(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = {...req.body, id: req.params.id};
      await this.editPendaftarByIdUsecase.execute(payload);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await this.deletePendaftarByIdUsecase.execute(req.params.id);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }
}
