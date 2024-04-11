import {NextFunction, Request, Response} from 'express';
import {ResponseError} from '../../../common/error/response-error';

export const authorizationMiddleware = (roles: string[]) => {
  return async (
      req: Request,
      res: Response,
      next: NextFunction,
  ) => {
    if (!roles.includes(res.locals.access.role)) {
      next(new ResponseError(403, 'Anda tidak memiliki akses'));
    }

    next();
  };
};
