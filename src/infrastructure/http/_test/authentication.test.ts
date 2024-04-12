import supertest from 'supertest';
import {initServer} from '../server';
import {Jwt} from '../../security/Jwt';
import {AuthenticationTestHelper}
  from '../../../../test/AuthenticationTestHelper';

describe('api/v1/authentication endpoint', () => {
  afterEach(async () => {
    await AuthenticationTestHelper.clean();
  });

  describe('when PUT /refresh', () => {
    it('should return 401 when request invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/authentication/refresh');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should refresh token successfully', async () => {
      const payload = {id: 'x', nama: 'x', email: 'x', role: 'ADMIN'};
      const jwt = new Jwt();
      const accessToken = await jwt.createAccessToken(payload);
      const refreshToken = await jwt.createRefreshToken(payload);
      // eslint-disable-next-line max-len
      const authCookie = `Bearer%20${accessToken}`;
      const rCookie = `Bearer%20${refreshToken}`;

      // add token
      const today = new Date();
      today.setHours(today.getHours() + 1);
      await AuthenticationTestHelper.add([{
        token: refreshToken,
        expires_at: today,
      }]);

      const response = await supertest(initServer())
          .put('/api/v1/authentication/refresh')
          .set('Cookie', [
            `Authorization=${authCookie}`,
            `r=${rCookie}`,
          ]);

      const authCookieResponse = response.header['set-cookie'][0];
      const rCookieResponse = response.header['set-cookie'][1];

      expect(response.status).toEqual(200);
      expect(authCookieResponse).toContain('Authorization');
      expect(authCookieResponse).toContain('HttpOnly');
      expect(authCookieResponse).toContain('SameSite=Strict');
      expect(rCookieResponse).toContain('r');
      expect(rCookieResponse).toContain('HttpOnly');
      expect(rCookieResponse).toContain('SameSite=Strict');
    });
  });
});
