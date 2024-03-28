import {TokenExpiredError} from 'jsonwebtoken';
import {AuthenticationRepository}
  from '../../../domain/authentication/AuthenticationRepository';
import {Jwt} from '../../../infrastructure/security/Jwt';
import {ResponseError} from '../../../common/error/response-error';

export class GetAuthenticationUsecase {
  constructor(private readonly authenticationRepo: AuthenticationRepository) {}

  async execute(refreshToken: string) {
    await this.authenticationRepo.get(refreshToken);
    try {
      await new Jwt().verifyRefreshToken(refreshToken);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        await this.authenticationRepo.delete(refreshToken);
      }

      throw new ResponseError(401, 'sesi kadaluarsa, silahkan login kembali');
    }
  }
}
