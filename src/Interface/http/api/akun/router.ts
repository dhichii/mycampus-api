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
import {PendaftarRepositoryImpl}
  from '../../../../infrastructure/repository/PendaftarRepositoryImpl';
import {AddPendaftarUsecase}
  from '../../../../application/usecase/pendaftar/AddUsecase';
import {AddSekolahUsecase}
  from '../../../../application/usecase/sekolah/AddUsecase';
import {SekolahRepositoryImpl}
  from '../../../../infrastructure/repository/SekolahRepositoryImpl';
import {AddAkunUsecase} from '../../../../application/usecase/akun/AddUsecase';
import {GetPendaftarByIdUsecase}
  from '../../../../application/usecase/pendaftar/GetById';
import {GetOperatorByIdUsecase}
  from '../../../../application/usecase/operator/GetByIdUsecase';
import {OperatorRepositoryImpl}
  from '../../../../infrastructure/repository/OperatorRepositoryImpl';
import {UniversitasRepositoryImpl}
  from '../../../../infrastructure/repository/UniversitasRepositoryImpl';

export function akunRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  // repo
  const akunRepo = new AkunRepositoryImpl(prismaClient);
  const adminRepo = new AdminRepositoryImpl(prismaClient);
  const pendaftarRepo = new PendaftarRepositoryImpl(prismaClient);
  const sekolahRepo = new SekolahRepositoryImpl(prismaClient);
  const operatorRepo = new OperatorRepositoryImpl(prismaClient);
  const universitasRepo = new UniversitasRepositoryImpl(prismaClient);
  const authenticationRepo = new AuthenticationRepositoryImpl(prismaClient);

  // usecase
  const getAdminByIdUsecase = new GetAdminByIdUsecase(adminRepo, akunRepo);
  const getPendaftarByIdUsecase = new GetPendaftarByIdUsecase(
      pendaftarRepo,
      akunRepo,
      sekolahRepo,
  );
  const getOperatorByIdUsecase = new GetOperatorByIdUsecase(
      operatorRepo,
      akunRepo,
      universitasRepo,
  );
  const addAuthenticationUsecase =
    new AddAuthenticationUsecase(authenticationRepo);
  const loginUsecase = new LoginUsecase(
      akunRepo,
      getAdminByIdUsecase,
      getPendaftarByIdUsecase,
      getOperatorByIdUsecase,
      addAuthenticationUsecase,
  );
  const deleteAuthenticationUsecase =
    new DeleteAuthenticationUsecase(authenticationRepo);
  const logoutUsecase = new LogoutUsecase(deleteAuthenticationUsecase);
  const changeEmailUsecase = new ChangeEmailUsecase(akunRepo);
  const changePasswordUsecase = new ChangePasswordUsecase(akunRepo);
  const addSekolahUsecase = new AddSekolahUsecase(sekolahRepo);
  const addAkunUsecase = new AddAkunUsecase(akunRepo);
  const addPendaftarUsecase = new AddPendaftarUsecase(
      pendaftarRepo,
      sekolahRepo,
      addSekolahUsecase,
      addAkunUsecase,
  );

  const handler = new AkunHandler(
      loginUsecase,
      logoutUsecase,
      changeEmailUsecase,
      changePasswordUsecase,
      addPendaftarUsecase,
  );

  router.post('/akun/login', handler.login);
  router.post('/akun/register/pendaftar', handler.registerPendaftar);

  // route with login required
  router.post('/akun/logout', authenticationMiddleware, handler.logout);
  router.patch('/akun/email', authenticationMiddleware, handler.changeEmail);
  router.patch(
      '/akun/password',
      authenticationMiddleware,
      handler.changePassword,
  );

  return router;
}
