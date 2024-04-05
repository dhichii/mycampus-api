import {NextFunction, Request, Response} from 'express';
import {LoginUsecase} from '../../../../application/usecase/akun/LoginUsecase';
import {LogoutUsecase}
  from '../../../../application/usecase/akun/LogoutUsecase';
import autoBind from 'auto-bind';
import {JwtPayload} from 'jsonwebtoken';
import {Jwt} from '../../../../infrastructure/security/Jwt';
import {ChangeEmailUsecase}
  from '../../../../application/usecase/akun/ChangeEmailUsecase';
import {ChangePasswordUsecase}
  from '../../../../application/usecase/akun/ChangePasswordUsecase';

export class AkunHandler {
  constructor(
    private readonly loginUsecase: LoginUsecase,
    private readonly logoutUsecase: LogoutUsecase,
    private readonly changeEmailUsecase: ChangeEmailUsecase,
    private readonly changePasswordUsecase: ChangePasswordUsecase,
  ) {
    autoBind(this);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.loginUsecase.execute(req.body);
      const refreshPayload = await new Jwt()
          .decode(data.refresh.split('Bearer ')[1]) as JwtPayload;

      res.status(201)
          .cookie(
              'Authorization',
              data.access,
              {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: refreshPayload.exp,
              },
          ).cookie(
              'r',
              data.refresh,
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

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refresh = req.cookies.r.split('Bearer ')[1];
      await this.logoutUsecase.execute(refresh);

      res.status(201).clearCookie('Authorization').json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }

  async changeEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const {id, email} = res.locals.access;
      const newEmail = req.body.email;
      if (newEmail === email) {
        res.json({status: 'success'});
      } else {
        await this.changeEmailUsecase.execute({id, email: newEmail});

        res.locals.access.email = newEmail;

        const jwt = new Jwt();
        const accessToken = await jwt.createAccessToken(
            jwt.mapJwtSignPayload(res.locals.access),
        );
        const refreshToken = await jwt.createRefreshToken(
            jwt.mapJwtSignPayload(res.locals.access),
        );
        const refreshPayload = await jwt.decode(refreshToken) as JwtPayload;

        res.cookie(
            'Authorization',
            'Bearer ' + accessToken,
            {
              httpOnly: true,
              sameSite: 'strict',
              maxAge: refreshPayload.exp,
            },
        ).cookie(
            'r',
            'Bearer ' + refreshToken,
            {
              httpOnly: true,
              sameSite: 'strict',
              maxAge: refreshPayload.exp,
            },
        ).json({status: 'success'});
      }
    } catch (e) {
      next(e);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.access.id;
      const password = req.body.password;
      await this.changePasswordUsecase.execute({id, password});

      res.json({status: 'success'});
    } catch (e) {
      next(e);
    }
  }
}
