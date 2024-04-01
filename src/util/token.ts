import {ResponseError} from '../common/error/response-error';

export function verifyAuthorizationCookie(auth?: any) {
  const errMessage = new ResponseError(
      401,
      'sesi kadaluarsa, silahkan login kembali',
  );

  if (!auth) throw errMessage;

  const {access, refresh} = auth;
  if (!access || !refresh) throw errMessage;

  const [accessBearer, accessToken] = access.split(' ');
  if (accessBearer !== 'Bearer') throw errMessage;

  const [refreshBearer, refreshToken] = refresh.split(' ');
  if (refreshBearer !== 'Bearer') throw errMessage;

  return {access: accessToken, refresh: refreshToken};
}
