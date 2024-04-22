import autoBind from 'auto-bind';
import {AddPotensiKarirUsecase}
  from '../../../../application/usecase/potensi_karir/AddUsecase';
import {DeletePotensiKarirByIdUseCase}
  from '../../../../application/usecase/potensi_karir/DeleteByIdUsecase';
import {EditPotensiKarirByIdUseCase}
  from '../../../../application/usecase/potensi_karir/EditByIdUsecase';
import {GetAllPotensiKarirUseCase}
  from '../../../../application/usecase/potensi_karir/GetAllUsecase';
import {NextFunction, Request, Response} from 'express';
import {parseNumber} from '../../../../util/parser';

export class PotensiKarirHandler {
  constructor(
    private readonly addPotensiKarirUsecase: AddPotensiKarirUsecase,
    private readonly getAllPotensiKarirUsecase: GetAllPotensiKarirUseCase,
    private readonly editPotensiKarirByIdUsecase: EditPotensiKarirByIdUseCase,
    // eslint-disable-next-line max-len
    private readonly deletePotensiKarirByIdUsecase: DeletePotensiKarirByIdUseCase,
  ) {
    autoBind(this);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.addPotensiKarirUsecase.execute(req.body);
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
      const data = await this.getAllPotensiKarirUsecase.execute(payload);

      res.json({status: 'success', ...data});
    } catch (e) {
      next(e);
    }
  }

  async editById(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = {...req.body};
      payload.id = parseInt(req.params.id);
      await this.editPotensiKarirByIdUsecase.execute(payload);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.deletePotensiKarirByIdUsecase.execute(id);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }
}
