import {ResponseError} from '../../common/error/response-error';
import {verifyAuthorizationCookie} from '../token';

describe('verifyAuthorizationCookie', () => {
  it('should return 401 error when Authorization is undefined', async () => {
    let auth;
    try {
      verifyAuthorizationCookie(auth);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ResponseError);
      expect(e.status).toEqual(401);
      expect(e.message).toEqual('sesi kadaluarsa, silahkan login kembali');
    }
  });

  it('should return 401 error when access token is undefined', async () => {
    const auth = {access: 'x'};
    try {
      verifyAuthorizationCookie(auth);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ResponseError);
      expect(e.status).toEqual(401);
      expect(e.message).toEqual('sesi kadaluarsa, silahkan login kembali');
    }
  });

  it('should return 401 error when refresh token is undefined', async () => {
    const auth = {refresh: 'z'};
    try {
      verifyAuthorizationCookie(auth);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ResponseError);
      expect(e.status).toEqual(401);
      expect(e.message).toEqual('sesi kadaluarsa, silahkan login kembali');
    }
  });

  it('should return 401 error when access token is not a Bearer', async () => {
    const auth = {access: 'x', refresh: 'Bearer z'};
    try {
      verifyAuthorizationCookie(auth);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ResponseError);
      expect(e.status).toEqual(401);
      expect(e.message).toEqual('sesi kadaluarsa, silahkan login kembali');
    }
  });

  it('should return 401 error when refresh token is not a Bearer', async () => {
    const auth = {access: 'Bearer x', refresh: 'z'};
    try {
      verifyAuthorizationCookie(auth);
    } catch (e: any) {
      expect(e).toBeInstanceOf(ResponseError);
      expect(e.status).toEqual(401);
      expect(e.message).toEqual('sesi kadaluarsa, silahkan login kembali');
    }
  });

  it('should return token successfully', async () => {
    const auth = {access: 'Bearer x', refresh: 'Bearer z'};
    const expectedResponse = {access: 'x', refresh: 'z'};

    const response = verifyAuthorizationCookie(auth);

    expect(response).toStrictEqual(expectedResponse);
  });
});
