import {NextFunction, Request, Response} from 'express';
import {ResponseError} from '../../../common/error/response-error';
import {Jwt} from '../../../infrastructure/security/Jwt';
import {verifyAuthorizationCookie} from '../../../util/token';

export const authenticationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
  try {
    const {access} = verifyAuthorizationCookie(req.cookies.Authorization);
    access.split('Bearer ')[1];

    const payload = await new Jwt().verifyAccessToken(access);
    res.locals.access = payload;
  } catch (e) {
    next(new ResponseError(401, 'sesi kadaluarsa, silahkan login kembali'));
  }

  next();
};
