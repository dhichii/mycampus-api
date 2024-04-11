import {AkunRepository} from '../../../domain/akun/AkunRepository';
import {LoginOutput, LoginReq} from '../../../domain/akun/entity/akun';
import {Bcrypt} from '../../../infrastructure/security/Bcrypt';
import {Jwt, JwtSignPayload} from '../../../infrastructure/security/Jwt';
import {Role} from '../../../util/enum';
import {AkunValidation} from '../../validation/AkunValidation';
import {Validation} from '../../validation/Validation';
import {GetAdminByIdUsecase} from '../admin/GetByIdUsecase';
import {AddAuthenticationUsecase} from '../authentication/AddUsecase';
import {GetPendaftarByIdUsecase} from '../pendaftar/GetById';

export class LoginUsecase {
  constructor(
    private readonly akunRepository: AkunRepository,
    private readonly getAdminByIdUsecase: GetAdminByIdUsecase,
    private readonly getPendaftarByIdUsecase: GetPendaftarByIdUsecase,
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
    let jwtSignPayload: JwtSignPayload | undefined;
    switch (role) {
      case Role.ADMIN:
        const admin = await this.getAdminByIdUsecase.execute(id);
        jwtSignPayload = jwt.mapJwtSignPayload({
          id,
          nama: admin.nama,
          email: admin.email,
          role,
        });
        break;
      case Role.PENDAFTAR:
        const pendaftar = await this.getPendaftarByIdUsecase.execute(id);
        jwtSignPayload = jwt.mapJwtSignPayload({
          id,
          nama: pendaftar.nama,
          email: pendaftar.email,
          role: role,
        });
        break;
      default:
        throw new Error(`role for user ${id} is invalid`);
    }

    const access = await jwt.createAccessToken(
      jwtSignPayload as JwtSignPayload,
    );
    const refresh = await jwt.createRefreshToken(
      jwtSignPayload as JwtSignPayload,
    );

    // store refresh token
    await this.addAuthenticationUsecase.execute(refresh);

    return {access: 'Bearer ' + access, refresh: 'Bearer ' + refresh};
  }
}
