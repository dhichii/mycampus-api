import express from 'express';
import {AkunRepositoryImpl}
  from '../../../../infrastructure/repository/AkunRepositoryImpl';
import {prismaClient}
  from '../../../../infrastructure/database/prisma';
import {LoginUsecase}
  from '../../../../application/usecase/akun/LoginUsecase';
import {AdminRepositoryImpl}
  from '../../../../infrastructure/repository/AdminRepositoryImpl';
import {GetAdminByIdUsecase}
  from '../../../../application/usecase/admin/GetByIdUsecase';
import {AddAuthenticationUsecase}
  from '../../../../application/usecase/authentication/AddUsecase';
import {AuthenticationRepositoryImpl}
  from '../../../../infrastructure/repository/AuthenticationRepositoryImpl';
import {AkunHandler} from './handler';
import {LogoutUsecase}
  from '../../../../application/usecase/akun/LogoutUsecase';
import {DeleteAuthenticationUsecase}
  from '../../../../application/usecase/authentication/DeleteUsecase';
import {authenticationMiddleware} from '../../middleware/authentication';
import {ChangeEmailUsecase}
  from '../../../../application/usecase/akun/ChangeEmailUsecase';
import {ChangePasswordUsecase}
  from '../../../../application/usecase/akun/ChangePasswordUsecase';

export function akunRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  // repo
  const akunRepo = new AkunRepositoryImpl(prismaClient);
  const adminRepo = new AdminRepositoryImpl(prismaClient);
  const authenticationRepo = new AuthenticationRepositoryImpl(prismaClient);

  // usecase
  const getAdminByIdUsecase = new GetAdminByIdUsecase(adminRepo, akunRepo);
  const addAuthenticationUsecase =
    new AddAuthenticationUsecase(authenticationRepo);
  const loginUsecase = new LoginUsecase(
      akunRepo,
      getAdminByIdUsecase,
      addAuthenticationUsecase,
  );
  const deleteAuthenticationUsecase =
    new DeleteAuthenticationUsecase(authenticationRepo);
  const logoutUsecase = new LogoutUsecase(deleteAuthenticationUsecase);
  const changeEmailUsecase = new ChangeEmailUsecase(akunRepo);
  const changePasswordUsecase = new ChangePasswordUsecase(akunRepo);

  const handler = new AkunHandler(
      loginUsecase,
      logoutUsecase,
      changeEmailUsecase,
      changePasswordUsecase,
  );

  router.route('/akun/login').post(handler.login);

  // route with login required
  router.use(authenticationMiddleware);
  router.post('/akun/logout', handler.logout);
  router.patch('/akun/email', handler.changeEmail);
  router.patch('/akun/password', handler.changePassword);

  return router;
}
