import express from 'express';
import {prismaClient} from '../../../../infrastructure/database/prisma';
import {PendaftarRepositoryImpl}
  from '../../../../infrastructure/repository/PendaftarRepositoryImpl';
import {AkunRepositoryImpl}
  from '../../../../infrastructure/repository/AkunRepositoryImpl';
import {SekolahRepositoryImpl}
  from '../../../../infrastructure/repository/SekolahRepositoryImpl';
import {GetAllPendaftarUsecase}
  from '../../../../application/usecase/pendaftar/GetAllUsecase';
import {GetPendaftarByIdUsecase}
  from '../../../../application/usecase/pendaftar/GetById';
import {EditPendaftarByIdUsecase}
  from '../../../../application/usecase/pendaftar/EditByIdUsecase';
import {DeletePendaftarByIdUsecase}
  from '../../../../application/usecase/pendaftar/DeleteByIdUsecase';
import {PendaftarHandler} from './handler';
import {authenticationMiddleware} from '../../middleware/authentication';

export function pendaftarRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  // repo
  const pendaftarRepo = new PendaftarRepositoryImpl(prismaClient);
  const akunRepo = new AkunRepositoryImpl(prismaClient);
  const sekolahRepo = new SekolahRepositoryImpl(prismaClient);

  // usecase
  const getAllPendaftarUsecase = new GetAllPendaftarUsecase(
      pendaftarRepo,
      akunRepo,
      sekolahRepo,
  );
  const getPendaftarByIdUsecase = new GetPendaftarByIdUsecase(
      pendaftarRepo,
      akunRepo,
      sekolahRepo,
  );
  const editPendaftarByIdUsecase = new EditPendaftarByIdUsecase(pendaftarRepo);
  const deletePendaftarByIdUsecase = new DeletePendaftarByIdUsecase(
      pendaftarRepo,
      akunRepo,
  );

  const handler = new PendaftarHandler(
      getAllPendaftarUsecase,
      getPendaftarByIdUsecase,
      editPendaftarByIdUsecase,
      deletePendaftarByIdUsecase,
  );

  // routes
  router.use(authenticationMiddleware);
  router.route('/pendaftar')
      .get(handler.getAll);
  router.route('/pendaftar/:id')
      .get(handler.getById)
      .put(handler.editById)
      .delete(handler.deleteById);

  return router;
}
