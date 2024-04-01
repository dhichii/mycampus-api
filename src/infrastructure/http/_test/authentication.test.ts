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
      const authCookie = `j%3A%7B%22access%22%3A%22Bearer%20${accessToken}%22%2C%22refresh%22%3A%22Bearer%20${refreshToken}%22%7D`;

      // add token
      const today = new Date();
      today.setHours(today.getHours() + 1);
      await AuthenticationTestHelper.add([{
        token: refreshToken,
        expires_at: today,
      }]);

      const response = await supertest(initServer())
          .put('/api/v1/authentication/refresh')
          .set('Cookie', [`Authorization=${authCookie}`]);
      const authCookieResponse = response.header['set-cookie'][0];

      expect(response.status).toEqual(200);
      expect(authCookieResponse).toContain('Authorization');
      expect(authCookieResponse).toContain('access');
      expect(authCookieResponse).toContain('refresh');
      expect(authCookieResponse).toContain('Max-Age');
      expect(authCookieResponse).toContain('HttpOnly');
      expect(authCookieResponse).toContain('SameSite=Strict');
    });
  });
});
