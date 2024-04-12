import supertest from 'supertest';
import {AkunTestHelper} from '../../../../test/AkunTestHelper';
import {OperatorTestHelper} from '../../../../test/OperatorTestHelper';
import {initServer} from '../server';
import {v4 as uuid} from 'uuid';
import {Role} from '../../../util/enum';
import {Jwt, JwtSignPayload} from '../../security/Jwt';
import {UniversitasTestHelper} from '../../../../test/UniversitasTestHelper';

describe('api/v1/operator endpoint', () => {
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

  // universitas data
  const universitasData = {
    id: 1,
    nama: 'UNIVERSITY OF EXAMPLE',
    alamat: 'TEST STREET',
    keterangan: 'TEST',
    logo_url: 'test.png',
  };

  // akun & operator data
  const ids = [uuid(), uuid()];
  const akunDatas = [
    {
      id: ids[0],
      email: 'example1@gmail.com',
      // eslint-disable-next-line max-len
      password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
      role: Role.OPERATOR as 'ADMIN',
    },
    {
      id: ids[1],
      email: 'example2@gmail.com',
      // eslint-disable-next-line max-len
      password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
      role: Role.OPERATOR as 'ADMIN',
    },
  ];
  const operatorDatas = [
    {
      id: ids[0],
      nama: 'OPERATOR EXAMPLE 1',
      jenis_kelamin: 'L' as 'L',
      id_universitas: universitasData.id,
    },
    {
      id: ids[1],
      nama: 'OPERATOR EXAMPLE 2',
      jenis_kelamin: 'L' as 'L',
      id_universitas: universitasData.id,
    },
  ];

  beforeAll(async () => {
    accessToken = await jwt.createAccessToken(signPayload);
    refreshToken = await jwt.createRefreshToken(signPayload);
    forbiddenAccessToken = await jwt.createAccessToken(forbiddenSignPayload);
    forbiddenRefreshToken = await jwt.createRefreshToken(forbiddenSignPayload);

    await UniversitasTestHelper.add([universitasData]);
  });

  afterAll(async () => {
    await UniversitasTestHelper.clean();
  });

  afterEach(async () => {
    await AkunTestHelper.clean();
  });

  describe('when POST /operator', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/operator');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/operator')
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
          .post('/api/v1/operator')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('email');
    });

    it('should add operator successfully', async () => {
      const req = {
        nama: 'Admin Example',
        email: 'example@gmail.com',
        password: '12345678',
        jenis_kelamin: 'L',
        id_universitas: universitasData.id,
      };

      const response = await supertest(initServer())
          .post('/api/v1/operator')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(req);

      expect(response.status).toEqual(201);
      expect(response.body.data.id).toBeDefined();
    });
  });

  describe('when GET /operator', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/operator');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/operator')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return all operator', async () => {
      await AkunTestHelper.add(akunDatas);
      await OperatorTestHelper.add(operatorDatas);

      const response = await supertest(initServer())
          .get('/api/v1/operator')
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
      expect(body.data.length).toEqual(operatorDatas.length);
    });

    it('should return 0 record when searched operator is not found',
        async () => {
          await AkunTestHelper.add();
          await OperatorTestHelper.add();

          const response = await supertest(initServer())
              .get('/api/v1/admin?search=x')
              .set('Cookie', [
                `Authorization=Bearer%20${accessToken}`,
                `r=Bearer%20${refreshToken}`,
              ]);

          expect(response.status).toEqual(200);
          expect(response.body.data.length).toEqual(0);
        },
    );

    it('should return 1 record when searched operator is found', async () => {
      await AkunTestHelper.add();
      await OperatorTestHelper.add();

      const response = await supertest(initServer())
          .get('/api/v1/operator?search=tes')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(1);
    });
  });

  describe('when GET /operator/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/operator/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/operator/x')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return 400 when id is invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/operator/s')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);
      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .get(`/api/v1/operator/${operatorDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('akun tidak ditemukan');
    } );

    it('should return operator', async () => {
      await AkunTestHelper.add([akunDatas[0]]);
      await OperatorTestHelper.add([operatorDatas[0]]);

      const response = await supertest(initServer())
          .get(`/api/v1/operator/${operatorDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const data = response.body.data;
      expect(response.status).toEqual(200);
      expect(data.id).toBeDefined();
      expect(data.nama).toBeDefined();
      expect(data.email).toBeDefined();
      expect(data.jenis_kelamin).toBeDefined();
      expect(data.created_at).toBeDefined();
      expect(data.universitas).toBeDefined();
      expect(data.universitas.id).toBeDefined();
      expect(data.universitas.nama).toBeDefined();
    });
  });

  describe('when PUT /operator/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/operator/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/operator/x')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return 400 when id is invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/operator/s')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);
      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .put(`/api/v1/operator/${operatorDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('nama');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .put(`/api/v1/operator/${operatorDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send({
            nama: 'example',
            jenis_kelamin: 'L',
            id_universitas: universitasData.id,
          });

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('akun tidak ditemukan');
    });

    it('should edit successfully', async () => {
      await AkunTestHelper.add([akunDatas[0]]);
      await OperatorTestHelper.add([operatorDatas[0]]);

      const response = await supertest(initServer())
          .put(`/api/v1/operator/${operatorDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(operatorDatas[0]);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });

  describe('when DELETE /operator/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/operator/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/operator/x')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return 400 when id is invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/operator/s')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);
      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .delete(`/api/v1/operator/${operatorDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('akun tidak ditemukan');
    });

    it('should delete successfully', async () => {
      await AkunTestHelper.add([akunDatas[0]]);
      await OperatorTestHelper.add([operatorDatas[0]]);

      const response = await supertest(initServer())
          .delete(`/api/v1/operator/${operatorDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });
});
