import express from 'express';
import {AkunRepositoryImpl}
  from '../../../../infrastructure/repository/AkunRepositoryImpl';
import {prismaClient} from '../../../../infrastructure/database/prisma';
import {AdminRepositoryImpl}
  from '../../../../infrastructure/repository/AdminRepositoryImpl';
import {AddAdminUsecase}
  from '../../../../application/usecase/admin/AddUsecase';
import {AddAkunUsecase} from '../../../../application/usecase/akun/AddUsecase';
import {AdminHandler} from './handler';
import {GetAllAdminUsecase}
  from '../../../../application/usecase/admin/GetAllUsecase';
import {GetAdminByIdUsecase}
  from '../../../../application/usecase/admin/GetByIdUsecase';
import {EditAdminByIdUsecase}
  from '../../../../application/usecase/admin/EditByIdUsecase';
import {DeleteAdminByIdUsecase}
  from '../../../../application/usecase/admin/DeleteByIdUsecase';
import {authenticationMiddleware} from '../../middleware/authentication';
import {Role} from '../../../../util/enum';
import {authorizationMiddleware} from '../../middleware/authorization';

export function adminRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  // repo
  const akunRepo = new AkunRepositoryImpl(prismaClient);
  const adminRepo = new AdminRepositoryImpl(prismaClient);

  // usecase
  const addAkunUsecase = new AddAkunUsecase(akunRepo);
  const addAdminUsecase = new AddAdminUsecase(adminRepo, addAkunUsecase);
  const getAllAdminUsecase = new GetAllAdminUsecase(adminRepo, akunRepo);
  const getAdminByIdUsecase = new GetAdminByIdUsecase(adminRepo, akunRepo);
  const editAdminByIdUsecase = new EditAdminByIdUsecase(adminRepo);
  const deleteAdminByIdUsecase = new DeleteAdminByIdUsecase(
      adminRepo, akunRepo,
  );

  const handler = new AdminHandler(
      addAdminUsecase,
      getAllAdminUsecase,
      getAdminByIdUsecase,
      editAdminByIdUsecase,
      deleteAdminByIdUsecase,
  );

  // routes
  router.route('/admin')
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
  router.route('/admin/:id')
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
