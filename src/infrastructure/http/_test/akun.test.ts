import supertest from 'supertest';
import {initServer} from '../server';
import {AkunTestHelper} from '../../../../test/AkunTestHelper';
import {AdminTestHelper} from '../../../../test/AdminTestHelper';
import {AuthenticationTestHelper}
  from '../../../../test/AuthenticationTestHelper';
import {Jwt, JwtSignPayload} from '../../security/Jwt';
import {JwtPayload} from 'jsonwebtoken';

describe('api/v1/akun endpoint', () => {
  afterEach(async () => {
    await AkunTestHelper.clean();
    await AuthenticationTestHelper.clean();
  });

  describe('when POST /akun/login', () => {
    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/akun/login');

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('email');
      expect(errors[1].path[0]).toEqual('password');
    });

    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/akun/login')
          .send({email: 'x@gmail.com', password: '1324532142'});

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message).toEqual('email atau password salah');
    });

    it('should login successfully', async () => {
      await AkunTestHelper.add();
      await AdminTestHelper.add();

      const req = {email: 'x@gmail.com', password: '12345678'};

      const response = await supertest(initServer())
          .post('/api/v1/akun/login')
          .send(req);

      const authCookieResponse = response.header['set-cookie'][0];
      const rCookieResponse = response.header['set-cookie'][1];

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(authCookieResponse).toContain('Authorization');
      expect(authCookieResponse).toContain('HttpOnly');
      expect(authCookieResponse).toContain('SameSite=Strict');
      expect(rCookieResponse).toContain('r');
      expect(rCookieResponse).toContain('HttpOnly');
      expect(rCookieResponse).toContain('SameSite=Strict');
    });
  });

  describe('when POST /akun/logout', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/akun/logout');

      expect(response.status).toEqual(401);
      expect(response.body.errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 401 when token is not found', async () => {
      await AkunTestHelper.add();
      await AdminTestHelper.add();
      const admin = await AdminTestHelper.findById();

      const jwt = new Jwt();
      const signPayload = jwt.mapJwtSignPayload({...admin} as JwtSignPayload);
      const accessToken = await jwt.createAccessToken(signPayload);
      const refreshToken = await jwt.createRefreshToken(signPayload);

      const response = await supertest(initServer())
          .post('/api/v1/akun/logout')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(401);
      expect(response.body.errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should logout successfully', async () => {
      await AkunTestHelper.add();
      await AdminTestHelper.add();
      const admin = await AdminTestHelper.findById();

      const jwt = new Jwt();
      const signPayload = jwt.mapJwtSignPayload({...admin} as JwtSignPayload);
      const accessToken = await jwt.createAccessToken(signPayload);
      const refreshToken = await jwt.createRefreshToken(signPayload);
      const {exp} = await jwt.decode(refreshToken) as JwtPayload;

      await AuthenticationTestHelper.add([{
        token: refreshToken,
        expires_at: new Date(exp as number / 1000000),
      }]);

      const response = await supertest(initServer())
          .post('/api/v1/akun/logout')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const storedToken = await AuthenticationTestHelper
          .findToken(refreshToken);

      expect(response.status).toEqual(201);
      expect(storedToken).toBeNull();
      expect(response.header['set-cookie']).toEqual([
        'Authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      ]);
    });
  });

  describe('when PATCH /akun/email', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .patch('/api/v1/akun/email');

      expect(response.status).toEqual(401);
      expect(response.body.errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 400 when request invalid', async () => {
      await AkunTestHelper.add();
      await AdminTestHelper.add();

      const admin = await AdminTestHelper.findById();

      const jwt = new Jwt();
      const signPayload = jwt.mapJwtSignPayload({
        ...admin,
        email: 'x@gmail.com',
      } as JwtSignPayload);
      const accessToken = await jwt.createAccessToken(signPayload);
      const refreshToken = await jwt.createRefreshToken(signPayload);

      const response = await supertest(initServer())
          .patch('/api/v1/akun/email')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0])
          .toEqual('email');
    });

    it('should not return cookie when new email is same as old email',
        async () => {
          await AkunTestHelper.add();
          await AdminTestHelper.add();
          const admin = await AdminTestHelper.findById();

          const req = {email: 'z@gmail.com'};

          const jwt = new Jwt();
          const signPayload = jwt.mapJwtSignPayload({
            ...admin,
            email: req.email,
          } as JwtSignPayload);
          const accessToken = await jwt.createAccessToken(signPayload);
          const refreshToken = await jwt.createRefreshToken(signPayload);
          const {exp} = await jwt.decode(refreshToken) as JwtPayload;

          await AuthenticationTestHelper.add([{
            token: refreshToken,
            expires_at: new Date(exp as number / 1000000),
          }]);

          const response = await supertest(initServer())
              .patch('/api/v1/akun/email')
              .set('Cookie', [
                `Authorization=Bearer%20${accessToken}`,
                `r=Bearer%20${refreshToken}`,
              ])
              .send(req);

          expect(response.status).toEqual(200);
          expect(response.header['set-cookie']).toBeUndefined();
        },
    );

    it('should change email successfully', async () => {
      await AkunTestHelper.add();
      await AdminTestHelper.add();
      const admin = await AdminTestHelper.findById();

      const jwt = new Jwt();
      const signPayload = jwt.mapJwtSignPayload({...admin} as JwtSignPayload);
      const accessToken = await jwt.createAccessToken(signPayload);
      const refreshToken = await jwt.createRefreshToken(signPayload);
      const {exp} = await jwt.decode(refreshToken) as JwtPayload;

      await AuthenticationTestHelper.add([{
        token: refreshToken,
        expires_at: new Date(exp as number / 1000000),
      }]);

      const req = {email: 'z@gmail.com'};

      const response = await supertest(initServer())
          .patch('/api/v1/akun/email')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(req);

      const akun = await AkunTestHelper.findById();
      const authCookieResponse = response.header['set-cookie'][0];
      const rCookieResponse = response.header['set-cookie'][1];

      expect(response.status).toEqual(200);
      expect(akun?.email).toEqual(req.email);
      expect(authCookieResponse).not.toContain(accessToken);
      expect(rCookieResponse).not.toContain(refreshToken);
    });
  });

  describe('when PATCH /akun/password', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .patch('/api/v1/akun/password');

      expect(response.status).toEqual(401);
      expect(response.body.errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 400 when request invalid', async () => {
      await AkunTestHelper.add();
      await AdminTestHelper.add();

      const admin = await AdminTestHelper.findById();

      const jwt = new Jwt();
      const signPayload = jwt.mapJwtSignPayload({...admin} as JwtSignPayload);
      const accessToken = await jwt.createAccessToken(signPayload);
      const refreshToken = await jwt.createRefreshToken(signPayload);

      const response = await supertest(initServer())
          .patch('/api/v1/akun/password')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0])
          .toEqual('password');
    });

    it('should change password successfully', async () => {
      await AkunTestHelper.add();
      await AdminTestHelper.add();
      const akun = await AkunTestHelper.findById();
      const admin = await AdminTestHelper.findById();

      const jwt = new Jwt();
      const signPayload = jwt.mapJwtSignPayload({...admin} as JwtSignPayload);
      const accessToken = await jwt.createAccessToken(signPayload);
      const refreshToken = await jwt.createRefreshToken(signPayload);
      const {exp} = await jwt.decode(refreshToken) as JwtPayload;

      await AuthenticationTestHelper.add([{
        token: refreshToken,
        expires_at: new Date(exp as number / 1000000),
      }]);

      const req = {password: '12345678'};

      const response = await supertest(initServer())
          .patch('/api/v1/akun/password')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(req);

      const updatedAkun = await AkunTestHelper.findById();

      expect(response.status).toEqual(200);
      expect(akun?.password).not.toEqual(updatedAkun?.password);
    });
  });
});
