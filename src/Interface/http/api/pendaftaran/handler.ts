import autoBind from 'auto-bind';
import {AddPendaftaranUsecase}
  from '../../../../application/usecase/pendaftaran/AddUsecase';
import {GetAllPendaftaranUsecase}
  from '../../../../application/usecase/pendaftaran/GetAllUsecase';
import {GetPendaftaranByIdUsecase}
  from '../../../../application/usecase/pendaftaran/GetByIdUsecase';
import {EditPendaftaranByIdUsecase}
  from '../../../../application/usecase/pendaftaran/EditByIdUsecase';
import {DeletePendaftaranByIdUsecase}
  from '../../../../application/usecase/pendaftaran/DeleteByIdUsecase';
import {EditStatusPendaftaranByIdUsecase}
  from '../../../../application/usecase/pendaftaran/EditStatusByIdUsecase';
import {ProcessAllPendaftaranUsecase}
  from '../../../../application/usecase/pendaftaran/ProcessAllUsecase';
import {NextFunction, Request, Response} from 'express';
import {
  AddPendaftaranReq,
  DeletePendaftaranInput,
  EditPendaftaranReq,
  EditStatusPendaftaranReq,
  GetAllPendaftaranInput,
} from '../../../../domain/pendaftaran/entity/pendaftaran';
import {parseNumber} from '../../../../util/parser';
import {StatusPendaftaran} from '@prisma/client';

export class PendaftaranHandler {
  constructor(
    private readonly addPendaftaranUsecase: AddPendaftaranUsecase,
    private readonly getAllPendaftaranUsecase: GetAllPendaftaranUsecase,
    private readonly getPendaftaranByIdUsecase: GetPendaftaranByIdUsecase,
    private readonly editPendaftaranByIdUsecase: EditPendaftaranByIdUsecase,
    private readonly deletePendaftaranByIdUsecase: DeletePendaftaranByIdUsecase,
    // eslint-disable-next-line max-len
    private readonly editStatusPendaftaranByIdUsecase: EditStatusPendaftaranByIdUsecase,
    private readonly processAllPendaftaranUsecase: ProcessAllPendaftaranUsecase,
  ) {
    autoBind(this);
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: AddPendaftaranReq = {
        ...req.body,
        id_pendaftar: res.locals.access.id,
      };
      const data = await this.addPendaftaranUsecase.execute(payload);

      res.status(201).json({status: 'success', data});
    } catch (e) {
      next(e);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        limit,
        page,
        universitas,
        sekolah,
        prodi,
        status,
        nisn,
      } = req.query;

      const userData = res.locals.access;
      const input: GetAllPendaftaranInput = {
        limit: parseNumber('limit', limit as string) as number,
        page: parseNumber('page', page as string) as number,
        universitas: parseNumber('universitas', universitas as string),
        sekolah: sekolah as string,
        prodi: prodi as string,
        status: status as StatusPendaftaran,
        nisn: nisn as string,
      };

      const data = await this.getAllPendaftaranUsecase
          .execute({userData, input});

      res.json({status: 'success', ...data});
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const userData = res.locals.access;

      const data = await this.getPendaftaranByIdUsecase.execute({id, userData});
      res.json({status: 'success', data});
    } catch (e) {
      next(e);
    }
  }

  async editById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const userData = res.locals.access;
      const payload: EditPendaftaranReq = {
        id,
        userId: userData.id,
        role: userData.role,
        ...req.body,
      };

      await this.editPendaftaranByIdUsecase.execute(payload);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const userData = res.locals.access;
      const payload: DeletePendaftaranInput = {
        id,
        userId: userData.id,
        role: userData.role,
      };

      await this.deletePendaftaranByIdUsecase.execute(payload);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async editStatusById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const {role, id_universitas: idUniversitas} = res.locals.access;
      const {status} = req.body;
      const payload: EditStatusPendaftaranReq = {
        id,
        role,
        id_universitas: idUniversitas,
        status,
      };

      await this.editStatusPendaftaranByIdUsecase.execute(payload);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async processAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = res.locals.access;

      await this.processAllPendaftaranUsecase.execute(userData.id_universitas);

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }
}
