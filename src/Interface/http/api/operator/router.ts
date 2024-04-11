import express from 'express';
import {AkunRepositoryImpl}
  from '../../../../infrastructure/repository/AkunRepositoryImpl';
import {prismaClient} from '../../../../infrastructure/database/prisma';
import {AddAkunUsecase} from '../../../../application/usecase/akun/AddUsecase';
import {UniversitasRepositoryImpl}
  from '../../../../infrastructure/repository/UniversitasRepositoryImpl';
import {AddOperatorUsecase}
  from '../../../../application/usecase/operator/AddUsecase';
import {OperatorRepositoryImpl}
  from '../../../../infrastructure/repository/OperatorRepositoryImpl';
import {GetAlloperatorUsecase}
  from '../../../../application/usecase/operator/GetAllUsecase';
import {GetOperatorByIdUsecase}
  from '../../../../application/usecase/operator/GetByIdUsecase';
import {EditOperatorByIdUsecase}
  from '../../../../application/usecase/operator/EditByIdUsecase';
import {DeleteOperatorByIdUsecase}
  from '../../../../application/usecase/operator/DeleteByIdUsecase';
import {OperatorHandler} from './handler';
import {authenticationMiddleware} from '../../middleware/authentication';
import {authorizationMiddleware} from '../../middleware/authorization';
import {Role} from '../../../../util/enum';

export function operatorRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  // repo
  const akunRepo = new AkunRepositoryImpl(prismaClient);
  const operatorRepo = new OperatorRepositoryImpl(prismaClient);
  const universitasRepo = new UniversitasRepositoryImpl(prismaClient);

  // usecase
  const addAkunUsecase = new AddAkunUsecase(akunRepo);
  const addOperatorUsecase = new AddOperatorUsecase(
      operatorRepo,
      addAkunUsecase,
  );
  const getAllOperatorUsecase = new GetAlloperatorUsecase(
      operatorRepo,
      akunRepo,
      universitasRepo,
  );
  const getOperatorByIdUsecase = new GetOperatorByIdUsecase(
      operatorRepo,
      akunRepo,
      universitasRepo,
  );
  const editOperatorByIdUsecase = new EditOperatorByIdUsecase(operatorRepo);
  const deleteOperatorByIdUsecase = new DeleteOperatorByIdUsecase(
      operatorRepo,
      akunRepo,
  );

  const handler = new OperatorHandler(
      addOperatorUsecase,
      getAllOperatorUsecase,
      getOperatorByIdUsecase,
      editOperatorByIdUsecase,
      deleteOperatorByIdUsecase,
  );

  // routes
  router.route('/operator')
      .post(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN]),
          handler.add,
      )
      .get(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN]),
          handler.getAll,
      );
  router.route('/operator/:id')
      .get(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN]),
          handler.getById,
      )
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
