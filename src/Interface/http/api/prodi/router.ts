import express from 'express';
import {ProdiRepositoryImpl}
  from '../../../../infrastructure/repository/ProdiRepositoryImpl';
import {prismaClient}
  from '../../../../infrastructure/database/prisma';
import {AddProdiUsecase}
  from '../../../../application/usecase/prodi/AddUsecase';
import {UniversitasRepositoryImpl}
  from '../../../../infrastructure/repository/UniversitasRepositoryImpl';
import {GetAllProdiUsecase}
  from '../../../../application/usecase/prodi/GetAllUsecase';
import {GetProdiByIdUsecase}
  from '../../../../application/usecase/prodi/GetByIdUsecase';
import {EditProdiByIdUsecase}
  from '../../../../application/usecase/prodi/EditByIdUsecase';
import {DeleteProdiByIdUsecase}
  from '../../../../application/usecase/prodi/DeleteByIdUsecase';
import {EditProdiPotensiKarirUsecase}
  from '../../../../application/usecase/prodi/EditPotensiKarirUsecase';
import {ProdiHandler} from './handler';
import {authenticationMiddleware} from '../../middleware/authentication';
import {authorizationMiddleware} from '../../middleware/authorization';
import {Role} from '../../../../util/enum';

export function prodiRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  // repo
  const prodiRepo = new ProdiRepositoryImpl(prismaClient);
  const univRepo = new UniversitasRepositoryImpl(prismaClient);

  // usecase
  const addProdiUsecase = new AddProdiUsecase(prodiRepo, univRepo);
  const getAllProdiUsecase = new GetAllProdiUsecase(prodiRepo);
  const getProdiByIdUsecase = new GetProdiByIdUsecase(prodiRepo);
  const editProdiByIdUsecase = new EditProdiByIdUsecase(prodiRepo);
  const deleteProdiByIdUsecase = new DeleteProdiByIdUsecase(prodiRepo);
  const editProdiPotensiKarirUsecase = new EditProdiPotensiKarirUsecase(
      prodiRepo,
  );

  const handler = new ProdiHandler(
      addProdiUsecase,
      getAllProdiUsecase,
      getProdiByIdUsecase,
      editProdiByIdUsecase,
      deleteProdiByIdUsecase,
      editProdiPotensiKarirUsecase,
  );

  // routes
  router.route('/prodi')
      .post(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN]),
          handler.add,
      )
      .get(authenticationMiddleware, handler.getAll);
  router.route('/prodi/:id')
      .get(authenticationMiddleware, handler.getById)
      .put(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN]),
          handler.editById,
      )
      .delete(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN]),
          handler.deleteById,
      );
  router.route('/prodi/:id/potensi-karir')
      .patch(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN]),
          handler.editPotensiKarir,
      );

  return router;
}
