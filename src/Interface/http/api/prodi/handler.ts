import autoBind from 'auto-bind';
import {AddProdiUsecase}
  from '../../../../application/usecase/prodi/AddUsecase';
import {DeleteProdiByIdUsecase}
  from '../../../../application/usecase/prodi/DeleteByIdUsecase';
import {EditProdiByIdUsecase}
  from '../../../../application/usecase/prodi/EditByIdUsecase';
import {EditProdiPotensiKarirUsecase}
  from '../../../../application/usecase/prodi/EditPotensiKarirUsecase';
import {GetAllProdiUsecase}
  from '../../../../application/usecase/prodi/GetAllUsecase';
import {GetProdiByIdUsecase}
  from '../../../../application/usecase/prodi/GetByIdUsecase';
import {NextFunction, Request, Response} from 'express';
import {parseNumber} from '../../../../util/parser';
import {GetAllProdiInput} from '../../../../domain/prodi/entity/prodi';
import {
  Jenis_Universitas as JenisUniversitas,
  Status_Prodi as StatusProdi,
} from '@prisma/client';
import {Role} from '../../../../util/enum';

export class ProdiHandler {
  constructor(
    private readonly addProdiUsecase: AddProdiUsecase,
    private readonly getAllProdiUsecase: GetAllProdiUsecase,
    private readonly getProdiByIdUsecase: GetProdiByIdUsecase,
    private readonly editProdiByIdUsecase: EditProdiByIdUsecase,
    private readonly deleteProdiByIdUsecase: DeleteProdiByIdUsecase,
    private readonly editProdiPotensiKarirUsecase: EditProdiPotensiKarirUsecase,
  ) {
    autoBind(this);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.addProdiUsecase.execute(req.body);

      res.status(201).json({status: 'success', data});
    } catch (e) {
      next(e);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        search,
        limit,
        page,
        universitas,
        jenis_universitas: jenisUniversitas,
        status,
        min_ukt: minUkt,
        max_ukt: maxUkt,
      } = req.query;

      const payload: GetAllProdiInput = {
        search: search as string,
        limit: parseNumber('limit', limit as string) as number,
        page: parseNumber('page', page as string) as number,
        universitas: universitas as number | undefined,
        jenis_universitas: jenisUniversitas as JenisUniversitas | undefined,
        status: status as StatusProdi | undefined,
        min_ukt: minUkt as number | undefined,
        max_ukt: maxUkt as number | undefined,
      };

      // pendaftar user should only see the aktif prodi
      if (res.locals.access.role == Role.PENDAFTAR) {
        payload.status = StatusProdi.Aktif;
      }

      const data = await this.getAllProdiUsecase.execute(payload);

      res.json({status: 'success', ...data});
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = await this.getProdiByIdUsecase.execute(id);

      res.json({status: 'success', data});
    } catch (e) {
      next(e);
    }
  }

  async editById(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = {...req.body, id: req.params.id};
      await this.editProdiByIdUsecase.execute(payload);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async editPotensiKarir(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = {
        potensi_karir: req.body.potensi_karir,
        id: req.params.id,
      };
      await this.editProdiPotensiKarirUsecase.execute(payload);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await this.deleteProdiByIdUsecase.execute(id);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }
}
