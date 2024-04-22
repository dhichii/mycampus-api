import express from 'express';
import {prismaClient} from '../../../../infrastructure/database/prisma';
import {PotensiKarirHandler} from './handler';
import {authenticationMiddleware} from '../../middleware/authentication';
import {authorizationMiddleware} from '../../middleware/authorization';
import {Role} from '../../../../util/enum';
import {PotensiKarirRepositoryImpl}
  from '../../../../infrastructure/repository/PotensiKarirRepositoryImpl';
import {AddPotensiKarirUsecase}
  from '../../../../application/usecase/potensi_karir/AddUsecase';
import {GetAllPotensiKarirUseCase}
  from '../../../../application/usecase/potensi_karir/GetAllUsecase';
import {EditPotensiKarirByIdUseCase}
  from '../../../../application/usecase/potensi_karir/EditByIdUsecase';
import {DeletePotensiKarirByIdUseCase}
  from '../../../../application/usecase/potensi_karir/DeleteByIdUsecase';

export function potensiKarirRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  // repo
  const potensiKarirRepo = new PotensiKarirRepositoryImpl(prismaClient);

  // usecase
  const addPotensiKarirUsecase = new AddPotensiKarirUsecase(potensiKarirRepo);
  const getAllPotensiKarirUsecase = new GetAllPotensiKarirUseCase(
      potensiKarirRepo,
  );
  const editPotensiKarirByIdUsecase = new EditPotensiKarirByIdUseCase(
      potensiKarirRepo,
  );
  const deletePotensiKarirByIdUsecase = new DeletePotensiKarirByIdUseCase(
      potensiKarirRepo,
  );

  const handler = new PotensiKarirHandler(
      addPotensiKarirUsecase,
      getAllPotensiKarirUsecase,
      editPotensiKarirByIdUsecase,
      deletePotensiKarirByIdUsecase,
  );

  // routes
  router.route('/potensi-karir')
      .post(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN]),
          handler.add,
      )
      .get(authenticationMiddleware, handler.getAll);
  router.route('/potensi-karir/:id')
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

  return router;
}
