import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {LoginOutput, LoginReq} from '../../../domain/akun/entity/akun';
import {Bcrypt} from '../../../infrastructure/security/Bcrypt';
import {Jwt, JwtAccessPayload} from '../../../infrastructure/security/Jwt';
import {Role} from '../../../util/enum';
import {AkunValidation} from '../../validation/AkunValidation';
import {Validation} from '../../validation/Validation';
import {GetAdminByIdUsecase} from '../admin/GetByIdUsecase';
import {AddAuthenticationUsecase} from '../authentication/AddUsecase';

export class LoginUsecase {
  constructor(
    private readonly akunRepository: AkunRepository,
    private readonly getAdminByIdUsecase: GetAdminByIdUsecase,
    private readonly addAuthenticationUsecase: AddAuthenticationUsecase,
  ) {}

  async execute(payload: LoginReq) {
    Validation.validate(AkunValidation.LOGIN, payload);

    const {
      id,
      password: hashedPassword,
      role,
    }: LoginOutput = await this.akunRepository.login(payload.email);

    // compare password
    await new Bcrypt().compare(payload.password, hashedPassword);

    const jwt = new Jwt();

    // define access token payload
    let accessTokenPayload: JwtAccessPayload | undefined;
    switch (role) {
      case Role.ADMIN:
        const admin = await this.getAdminByIdUsecase.execute(id);
        accessTokenPayload = jwt.mapAccessPayload({
          id,
          nama: admin.nama,
          email: admin.email,
          role,
        });
        break;
      default:
        throw new Error(`role for user ${id} is invalid`);
    }

    const access = await jwt.createAccessToken(
      accessTokenPayload as JwtAccessPayload,
    );
    const refresh = await jwt.createRefreshToken(id);

    // store refresh token
    await this.addAuthenticationUsecase.execute(refresh);

    return {access, refresh};
  }
}
