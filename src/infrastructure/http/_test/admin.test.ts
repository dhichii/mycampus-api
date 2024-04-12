import supertest from 'supertest';
import {AkunTestHelper} from '../../../../test/AkunTestHelper';
import {AdminTestHelper} from '../../../../test/AdminTestHelper';
import {initServer} from '../server';
import {v4 as uuid} from 'uuid';
import {Role} from '../../../util/enum';
import {Jwt, JwtSignPayload} from '../../security/Jwt';

describe('api/v1/admin endpoint', () => {
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

  const ids = [uuid(), uuid()];
  const akunDatas = [
    {
      id: ids[0],
      email: 'example1@gmail.com',
      // eslint-disable-next-line max-len
      password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
      role: Role.ADMIN as 'ADMIN',
    },
    {
      id: ids[1],
      email: 'example2@gmail.com',
      // eslint-disable-next-line max-len
      password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
      role: Role.ADMIN as 'ADMIN',
    },
  ];
  const adminDatas = [
    {
      id: ids[0],
      nama: 'Admin Example',
      jenis_kelamin: 'L' as 'L',
    },
    {
      id: ids[1],
      nama: 'Admin Example',
      jenis_kelamin: 'L' as 'L',
    },
  ];

  const req = {
    nama: 'Admin Example',
    email: 'example1@gmail.com',
    // eslint-disable-next-line max-len
    password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
    jenis_kelamin: 'L',
  };

  beforeAll(async () => {
    accessToken = await jwt.createAccessToken(signPayload);
    refreshToken = await jwt.createRefreshToken(signPayload);
    forbiddenAccessToken = await jwt.createAccessToken(forbiddenSignPayload);
    forbiddenRefreshToken = await jwt.createRefreshToken(forbiddenSignPayload);
  });

  afterEach(async () => {
    await AkunTestHelper.clean();
  });

  describe('when POST /admin', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/admin');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/admin')
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
          .post('/api/v1/admin')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('email');
    });

    it('should return 400 when email is already exist', async () => {
      await AkunTestHelper.add([akunDatas[0]]);
      const response = await supertest(initServer())
          .post('/api/v1/admin')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(req);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].message).toEqual('email is already exist');
    });

    it('should add admin successfully', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/admin')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(req);

      const admin = await AdminTestHelper.findById(response.body.data.id);
      const akun = await AkunTestHelper.findById(response.body.data.id);

      expect(response.status).toEqual(201);
      expect(response.body.data.id).toBeDefined();
      expect(admin?.nama).toEqual(req.nama.toUpperCase());
      expect(akun?.email).toEqual(req.email);
      expect(akun?.password).not.toEqual(req.password);
      expect(admin?.jenis_kelamin).toEqual(req.jenis_kelamin);
    });
  });

  describe('when GET /admin', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/admin');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/admin')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return all admin', async () => {
      await AkunTestHelper.add(akunDatas);
      await AdminTestHelper.add(adminDatas);

      const response = await supertest(initServer())
          .get('/api/v1/admin')
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
      expect(body.data.length).toEqual(adminDatas.length);
    });

    it('should return 0 record when searched admin is not found',
        async () => {
          await AkunTestHelper.add();
          await AdminTestHelper.add();

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

    it('should return 1 record when searched admin is found', async () => {
      await AkunTestHelper.add();
      await AdminTestHelper.add();

      const response = await supertest(initServer())
          .get('/api/v1/admin?search=tes')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(1);
    });
  });

  describe('when GET /admin/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/admin/s');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/admin/s')
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
          .get('/api/v1/admin/s')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .get(`/api/v1/admin/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('akun tidak ditemukan');
    } );

    it('should return admin', async () => {
      await AkunTestHelper.add([akunDatas[0]]);
      await AdminTestHelper.add([adminDatas[0]]);

      const response = await supertest(initServer())
          .get(`/api/v1/admin/${adminDatas[0].id}`)
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
    });
  });

  describe('when PUT /admin/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/admin/s');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/admin/s')
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
          .put('/api/v1/admin/s')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .put(`/api/v1/admin/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('nama');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .put(`/api/v1/admin/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(req);

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('akun tidak ditemukan');
    });

    it('should edit successfully', async () => {
      const newNama = 'examples';

      await AkunTestHelper.add([akunDatas[0]]);
      await AdminTestHelper.add([adminDatas[0]]);

      const response = await supertest(initServer())
          .put(`/api/v1/admin/${adminDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send({nama: newNama, jenis_kelamin: req.jenis_kelamin});

      const data = await AdminTestHelper.findById(adminDatas[0].id);

      expect(response.status).toEqual(200);
      expect(data?.nama).toEqual(newNama.toUpperCase());
    });
  });

  describe('when DELETE /admin/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/admin/s');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/admin/s')
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
          .delete('/api/v1/admin/s')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .delete(`/api/v1/admin/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('akun tidak ditemukan');
    });

    it('should delete successfully', async () => {
      await AkunTestHelper.add([akunDatas[0]]);
      await AdminTestHelper.add([adminDatas[0]]);

      const response = await supertest(initServer())
          .delete(`/api/v1/admin/${adminDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const akun = await AkunTestHelper.findById(adminDatas[0].id);
      const admin = await AdminTestHelper.findById(adminDatas[0].id);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(akun?.deleted_at).not.toBeNull();
      expect(admin?.deleted_at).not.toBeNull();
    });
  });
});
