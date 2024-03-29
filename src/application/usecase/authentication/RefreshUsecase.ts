import {Jwt, JwtSignPayload} from '../../../infrastructure/security/Jwt';
import {AddAuthenticationUsecase} from './AddUsecase';
import {GetAuthenticationUsecase} from './GetUsecase';

export class RefreshAuthenticationUsecase {
  constructor(
    private readonly getAuthenticationUsecase: GetAuthenticationUsecase,
    private readonly addAuthenticationUsecase: AddAuthenticationUsecase,
  ) {}

  async execute(refreshToken: string) {
    await this.getAuthenticationUsecase.execute(refreshToken);
    const jwt = new Jwt();
    const jwtPayload = await jwt.decode(refreshToken);
    const signPayload = jwt.mapJwtSignPayload(jwtPayload as JwtSignPayload);

    const access = await jwt.createAccessToken(signPayload);
    const refresh = await jwt.createRefreshToken(signPayload);

    await this.addAuthenticationUsecase.execute(refresh);

    return {access, refresh};
  }
}
