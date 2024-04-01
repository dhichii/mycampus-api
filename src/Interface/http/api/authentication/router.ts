import express from 'express';
import {RefreshAuthenticationUsecase}
  from '../../../../application/usecase/authentication/RefreshUsecase';
import {AuthenticationRepositoryImpl}
  from '../../../../infrastructure/repository/AuthenticationRepositoryImpl';
import {prismaClient} from '../../../../infrastructure/database/prisma';
import {GetAuthenticationUsecase}
  from '../../../../application/usecase/authentication/GetUsecase';
import {AddAuthenticationUsecase}
  from '../../../../application/usecase/authentication/AddUsecase';
import {AuthenticationHandler} from './handler';

export function authenticationRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  // repo
  const authenticationRepo = new AuthenticationRepositoryImpl(prismaClient);

  // usecase
  const getAuthenticationUsecase =
    new GetAuthenticationUsecase(authenticationRepo);
  const addAuthenticationUsecase =
    new AddAuthenticationUsecase(authenticationRepo);
  const refreshAuthenticationUsecase = new RefreshAuthenticationUsecase(
      getAuthenticationUsecase,
      addAuthenticationUsecase,
  );

  const handler = new AuthenticationHandler(refreshAuthenticationUsecase);

  // routes
  router.route('/authentication/refresh').put(handler.refresh);

  return router;
}
