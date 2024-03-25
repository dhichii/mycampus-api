import {ResponseError} from '../../../common/error/response-error';
import {AuthenticationRepository}
  from '../../../domain/authentication/AuthenticationRepository';
import {Jwt} from '../../../infrastructure/security/Jwt';

export class AddAuthenticationUsecase {
  constructor(private readonly authenticationRepo: AuthenticationRepository) {}

  async execute(refreshToken: string) {
    try {
      await new Jwt().verifyRefreshToken(refreshToken);
      await this.authenticationRepo.add(refreshToken);
    } catch {
      throw new ResponseError(401, 'sesi kadaluarsa, silahkan login kembali');
    }
  }
}
