import supertest from 'supertest';
import {initServer} from '../server';
import {Jwt, JwtSignPayload} from '../../security/Jwt';
import {v4 as uuid} from 'uuid';
import {Role} from '../../../util/enum';
import {PotensiKarirTestHelper} from '../../../../test/PotensiKarirTestHelper';

describe('api/v1/potensi-karir endpoint', () => {
  // admin data
  const adminPayload = {
    id: uuid(),
    role: Role.ADMIN,
  };

  // forbidden role data
  const forbiddenPayload = {
    id: uuid(),
    role: Role.OPERATOR,
  };

  // token data
  const jwt = new Jwt();
  const signPayload = jwt.mapJwtSignPayload(
    {...adminPayload} as JwtSignPayload,
  );
  let accessToken = '';
  let refreshToken = '';

  // forbidden token data
  const forbiddenSignPayload = jwt.mapJwtSignPayload(
    {...forbiddenPayload} as JwtSignPayload,
  );
  let forbiddenAccessToken = '';
  let forbiddenRefreshToken = '';

  // potensi karir data
  const ids = [12, 23];
  const potensiKarirDatas = [
    {
      id: ids[0],
      nama: 'EXAMPLE 1',
    },
    {
      id: ids[1],
      nama: 'EXAMPLE 2',
    },
  ];

  const req = {
    nama: 'SOFTWARE ENGINEER',
  };

  beforeAll(async () => {
    accessToken = await jwt.createAccessToken(signPayload);
    refreshToken = await jwt.createRefreshToken(signPayload);
    forbiddenAccessToken = await jwt.createAccessToken(forbiddenSignPayload);
    forbiddenRefreshToken = await jwt.createRefreshToken(forbiddenSignPayload);
  });

  afterEach(async () => {
    await PotensiKarirTestHelper.clean();
  });

  describe('when POST /potensi-karir', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/potensi-karir');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/potensi-karir')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/potensi-karir')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('nama');
    });

    it('should return 400 when name is already exist', async () => {
      await PotensiKarirTestHelper.add(potensiKarirDatas[0]);
      const response = await supertest(initServer())
          .post('/api/v1/potensi-karir')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(potensiKarirDatas[0]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].message).toEqual('nama is already exist');
    });

    it('should add potensi karir successfully', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/potensi-karir')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(req);

      expect(response.status).toEqual(201);
      expect(response.body.data.id).not.toBeNull();
    });
  });

  describe('when GET /potensi-karir', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/potensi-karir');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return all potensi karir', async () => {
      await PotensiKarirTestHelper.add(potensiKarirDatas[0]);
      await PotensiKarirTestHelper.add(potensiKarirDatas[1]);

      const response = await supertest(initServer())
          .get('/api/v1/potensi-karir')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const body = response.body;
      expect(response.status).toEqual(200);
      expect(body.limit).toBeDefined();
      expect(body.page).toBeDefined();
      expect(body.total_page).toBeDefined();
      expect(body.total_result).toBeDefined();
      expect(body.data.length).toEqual(potensiKarirDatas.length);
    });

    it('should return 0 data when searched potensi karir is not found',
        async () => {
          await PotensiKarirTestHelper.add(potensiKarirDatas[0]);
          await PotensiKarirTestHelper.add(potensiKarirDatas[1]);

          const response = await supertest(initServer())
              .get('/api/v1/potensi-karir?search=z')
              .set('Cookie', [
                `Authorization=Bearer%20${accessToken}`,
                `r=Bearer%20${refreshToken}`,
              ]);

          expect(response.status).toEqual(200);
          expect(response.body.data.length).toEqual(0);
        },
    );

    // eslint-disable-next-line max-len
    it('should return 1 data when searched potensi karir is found', async () => {
      await PotensiKarirTestHelper.add(potensiKarirDatas[0]);
      await PotensiKarirTestHelper.add(potensiKarirDatas[1]);

      const response = await supertest(initServer())
          .get('/api/v1/potensi-karir?search=example 1')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(1);
    });
  });

  describe('when PUT /potensi-karir/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/potensi-karir/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/potensi-karir/x')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return 400 when id invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/potensi-karir/x')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .put(`/api/v1/potensi-karir/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('nama');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .put(`/api/v1/potensi-karir/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(potensiKarirDatas[0]);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('potensi karir tidak ditemukan');
    });

    it('should return 400 when name is already exist', async () => {
      await PotensiKarirTestHelper.add(potensiKarirDatas[0]);
      await PotensiKarirTestHelper.add(potensiKarirDatas[1]);
      const response = await supertest(initServer())
          .post('/api/v1/potensi-karir')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(potensiKarirDatas[1]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].message).toEqual('nama is already exist');
    });

    it('should edit successfully', async () => {
      await PotensiKarirTestHelper.add({
        id: ids[0],
        nama: req.nama,
      });

      const response = await supertest(initServer())
          .put(`/api/v1/potensi-karir/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(potensiKarirDatas[0]);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });

  describe('when DELETE /potensi-karir/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/potensi-karir/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/potensi-karir/x')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return 400 when id invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/potensi-karir/x')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .delete(`/api/v1/potensi-karir/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('potensi karir tidak ditemukan');
    });

    it('should delete successfully', async () => {
      await PotensiKarirTestHelper.add(potensiKarirDatas[0]);

      const response = await supertest(initServer())
          .delete(`/api/v1/potensi-karir/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });
});
