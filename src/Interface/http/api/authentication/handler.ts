import {NextFunction, Request, Response} from 'express';
import {RefreshAuthenticationUsecase}
  from '../../../../application/usecase/authentication/RefreshUsecase';
import autoBind from 'auto-bind';
import {Jwt} from '../../../../infrastructure/security/Jwt';
import {JwtPayload} from 'jsonwebtoken';
import {verifyAuthorizationCookie} from '../../../../util/token';

export class AuthenticationHandler {
  constructor(
    private readonly refreshAuthenticationUsecase: RefreshAuthenticationUsecase,
  ) {
    autoBind(this);
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const {refresh} = verifyAuthorizationCookie(req.cookies.Authorization);

      const data = await this.refreshAuthenticationUsecase.execute(refresh);
      const refreshPayload = await new Jwt()
          .decode(data.refresh.split('Bearer ')[1]) as JwtPayload;

      res.cookie(
          'Authorization',
          data,
          {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: refreshPayload.exp,
          },
      ).json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }
}
