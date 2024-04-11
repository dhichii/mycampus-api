import autoBind from 'auto-bind';
import {NextFunction, Request, Response} from 'express';
import {parseNumber} from '../../../../util/parser';
import {AddOperatorUsecase}
  from '../../../../application/usecase/operator/AddUsecase';
import {GetAlloperatorUsecase}
  from '../../../../application/usecase/operator/GetAllUsecase';
import {GetOperatorByIdUsecase}
  from '../../../../application/usecase/operator/GetByIdUsecase';
import {EditOperatorByIdUsecase}
  from '../../../../application/usecase/operator/EditByIdUsecase';
import {DeleteOperatorByIdUsecase}
  from '../../../../application/usecase/operator/DeleteByIdUsecase';

export class OperatorHandler {
  constructor(
    private readonly addOperatorUsecase: AddOperatorUsecase,
    private readonly getAllOperatorUsecase: GetAlloperatorUsecase,
    private readonly getOperatorByIdUsecase: GetOperatorByIdUsecase,
    private readonly editOperatorByIdUsecase: EditOperatorByIdUsecase,
    private readonly deleteOperatorByIdUsecase: DeleteOperatorByIdUsecase,
  ) {
    autoBind(this);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const id = await this.addOperatorUsecase.execute(req.body);

      res.status(201).json({status: 'success', data: {id}});
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
      const data = await this.getAllOperatorUsecase.execute(payload);

      res.json({status: 'success', ...data});
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.getOperatorByIdUsecase.execute(req.params.id);

      res.json({status: 'success', data});
    } catch (e) {
      next(e);
    }
  }

  async editById(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = {...req.body, id: req.params.id};
      await this.editOperatorByIdUsecase.execute(payload);

      res.status(200).json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await this.deleteOperatorByIdUsecase.execute(req.params.id);

      res.status(200).json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }
}
