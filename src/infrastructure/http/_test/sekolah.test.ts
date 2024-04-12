import supertest from 'supertest';
import {SekolahTestHelper} from '../../../../test/SekolahTestHelper';
import {initServer} from '../server';
import {v4 as uuid} from 'uuid';
import {Role} from '../../../util/enum';
import {Jwt, JwtSignPayload} from '../../security/Jwt';

describe('api/v1/sekolah endpoint', () => {
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

  const sekolahDatas = [
    {id: uuid(), nama: 'SEKOLAH 1'},
    {id: uuid(), nama: 'SEKOLAH 2'},
  ];

  beforeAll(async () => {
    accessToken = await jwt.createAccessToken(signPayload);
    refreshToken = await jwt.createRefreshToken(signPayload);
    forbiddenAccessToken = await jwt.createAccessToken(forbiddenSignPayload);
    forbiddenRefreshToken = await jwt.createRefreshToken(forbiddenSignPayload);
  });

  afterEach(async () => {
    await SekolahTestHelper.clean();
  });

  describe('when POST /sekolah', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/sekolah');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/sekolah')
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
          .post('/api/v1/sekolah')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('nama');
    });

    it('should return 400 when name is already exist', async () => {
      const nama = 'SEKOLAH NEGERI 1 XXX';
      await SekolahTestHelper.add([{id: uuid(), nama}]);
      const response = await supertest(initServer())
          .post('/api/v1/sekolah')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send({nama});

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].message).toEqual('nama is already exist');
    });

    it('should add sekolah successfully', async () => {
      const nama = 'SEKOLAH NEGERI 1 XXX';
      const response = await supertest(initServer())
          .post('/api/v1/sekolah')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send({nama});

      expect(response.status).toEqual(201);
      expect(response.body.data.nama).toEqual(nama);
    });
  });

  describe('when GET /sekolah', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/sekolah');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return all sekolah', async () => {
      await SekolahTestHelper.add(sekolahDatas);

      const response = await supertest(initServer())
          .get('/api/v1/sekolah')
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
      expect(body.data.length).toEqual(sekolahDatas.length);
    });

    it('should return 0 record when searched sekolah is not found',
        async () => {
          await SekolahTestHelper.add([sekolahDatas[0]]);

          const response = await supertest(initServer())
              .get('/api/v1/sekolah?search=x')
              .set('Cookie', [
                `Authorization=Bearer%20${accessToken}`,
                `r=Bearer%20${refreshToken}`,
              ]);

          expect(response.status).toEqual(200);
          expect(response.body.data.length).toEqual(0);
        },
    );

    it('should return 1 record when searched sekolah is found', async () => {
      await SekolahTestHelper.add(sekolahDatas);

      const response = await supertest(initServer())
          .get('/api/v1/sekolah?search=sekolah 1')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(1);
    });
  });

  describe('when PUT /sekolah/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/sekolah/s');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/sekolah/s')
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
          .put('/api/v1/sekolah/s')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);
      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .put(`/api/v1/sekolah/${sekolahDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('nama');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .put(`/api/v1/sekolah/${sekolahDatas[0].id}`)
          .send({nama: 'SEKOLAH NEGERI 1'})
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('sekolah not found');
    });

    it('should edit successfully', async () => {
      const newNama = 'SEKOLAH NEGERI 1';
      await SekolahTestHelper.add([sekolahDatas[0]]);

      const response = await supertest(initServer())
          .put(`/api/v1/sekolah/${sekolahDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send({nama: newNama});

      const data = await SekolahTestHelper.findById(sekolahDatas[0].id);

      expect(response.status).toEqual(200);
      expect(data?.nama).toEqual(newNama);
    });
  });

  describe('when DELETE /sekolah/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/sekolah/s');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/sekolah/s')
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
          .delete('/api/v1/sekolah/s')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);
      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .delete(`/api/v1/sekolah/${sekolahDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('sekolah not found');
    });

    it('should delete successfully', async () => {
      await SekolahTestHelper.add([sekolahDatas[0]]);

      const response = await supertest(initServer())
          .delete(`/api/v1/sekolah/${sekolahDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const sekolah = await SekolahTestHelper.findById(sekolahDatas[0].id);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(sekolah).toBeNull();
    });
  });
});
