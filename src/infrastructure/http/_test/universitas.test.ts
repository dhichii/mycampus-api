import supertest from 'supertest';
import {initServer} from '../server';
import {UniversitasTestHelper} from '../../../../test/UniversitasTestHelper';
import {TestFileHelper} from '../../../../test/TestFileHelper';
import {Jwt, JwtSignPayload} from '../../security/Jwt';
import {v4 as uuid} from 'uuid';
import {Role} from '../../../util/enum';

describe('api/v1/universitas endpoint', () => {
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

  beforeAll(async () => {
    accessToken = await jwt.createAccessToken(signPayload);
    refreshToken = await jwt.createRefreshToken(signPayload);
    forbiddenAccessToken = await jwt.createAccessToken(forbiddenSignPayload);
    forbiddenRefreshToken = await jwt.createRefreshToken(forbiddenSignPayload);
  });

  afterEach(async () => {
    await UniversitasTestHelper.clean();
  });

  describe('when POST /universitas', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/universitas');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/universitas')
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
          .post('/api/v1/universitas')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .field({nama: '0', alamat: '0'});

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('nama');
      expect(errors[1].path[0]).toEqual('alamat');
      expect(errors[2].path[0]).toEqual('keterangan');
      expect(errors[3].path[0]).toEqual('logo');
    });

    it('should add universitas successfully', async () => {
      const request = {
        nama: 'xxdsffjhgfhgdsfdfdsgf',
        alamat: 'xxdsffjhgfhgdsfdfdsgf',
        keterangan: 'xxdsffjhgfhgdsfdfdsgf',
      };
      const response = await supertest(initServer())
          .post('/api/v1/universitas')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .field(request)
          .attach('logo', 'test/test-img.png');

      const {id, nama, alamat, keterangan, logo_url: logo} = response.body.data;

      // delete uploaded img
      await TestFileHelper.delete(logo);

      expect(response.status).toEqual(201);
      expect(response.body.data).toBeDefined();
      expect(id).toBeDefined();
      expect(nama).toEqual(request.nama.toUpperCase());
      expect(alamat).toEqual(request.alamat);
      expect(keterangan).toEqual(request.keterangan);
      expect(logo).toBeDefined();
    });
  });

  describe('when GET /universitas', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/universitas');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return all universitas', async () => {
      const univData = {
        nama: 'tes',
        alamat: 'tes',
        keterangan: 'tes',
        logo_url: 'tes',
      };
      const univDatas = [
        {id: 1, ...univData},
        {id: 2, ...univData},
      ];

      await UniversitasTestHelper.add(univDatas);

      const response = await supertest(initServer())
          .get('/api/v1/universitas')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toBe(univDatas.length);
      expect(response.body.data).toStrictEqual(univDatas);
    });
  });

  describe('when GET /universitas/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/universitas/s');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 400 when id is not a number', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/universitas/s')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/universitas/1')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should return universitas', async () => {
      const univData = [{
        id: 1,
        nama: 'tes',
        alamat: 'tes',
        keterangan: 'tes',
        logo_url: 'tes',
      }];

      await UniversitasTestHelper.add(univData);

      const response = await supertest(initServer())
          .get('/api/v1/universitas/1')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.data).toStrictEqual(univData[0]);
    });
  });

  describe('when PUT /universitas/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/universitas/s');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/universitas/s')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return 400 when id is not a number', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/universitas/s')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/universitas/1')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/universitas/1')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .field({
            nama: 'nama=xxdsffjhgfhgdsfdfdsgf',
            alamat: 'xxdsffjhgfhgdsfdfdsgf',
            keterangan: 'xxdsffjhgfhgdsfdfdsgf',
          });

      expect(response.status).toEqual(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should edit successfully', async () => {
      const univData = [{
        id: 1,
        nama: 'tes',
        alamat: 'tes',
        keterangan: 'tes',
        logo_url: 'tes',
      }];

      await UniversitasTestHelper.add(univData);

      const request = {
        nama: 'xxdsffjhgfhgdsfdfdsgf',
        alamat: 'xxdsffjhgfhgdsfdfdsgf',
        keterangan: 'xxdsffjhgfhgdsfdfdsgf',
      };

      const response = await supertest(initServer())
          .put(`/api/v1/universitas/${univData[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .field(request);

      const universitas = await UniversitasTestHelper.findById(univData[0].id);

      expect(response.status).toEqual(200);
      expect(response.body.status).toBe('success');
      expect(universitas?.nama).toBe(request.nama.toUpperCase());
      expect(universitas?.alamat).toBe(request.alamat);
      expect(universitas?.keterangan).toBe(request.keterangan);
    });
  });

  describe('when DELETE /universitas/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/universitas/s');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/universitas/s')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return 400 when id is not a number', async () => {
      const response = await supertest(initServer())
          .delete(`/api/v1/universitas/s`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/universitas/1')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should delete successfully', async () => {
      const logoUrl = await TestFileHelper.copy();
      const univData = [{
        id: 1,
        nama: 'tes',
        alamat: 'tes',
        keterangan: 'tes',
        logo_url: logoUrl,
      }];

      await UniversitasTestHelper.add(univData);

      const response = await supertest(initServer())
          .delete(`/api/v1/universitas/${univData[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      if (response.body.errors) {
        await TestFileHelper.delete();
      }

      const universitas = await UniversitasTestHelper.findById(univData[0].id);

      expect(response.status).toEqual(200);
      expect(response.body.status).toBe('success');
      expect(universitas).toBeNull();
    });
  });

  describe('when PATCH /universitas/{id}/logo', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .patch('/api/v1/universitas/s/logo');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .patch('/api/v1/universitas/s/logo')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return 400 when id is not a number', async () => {
      const response = await supertest(initServer())
          .patch(`/api/v1/universitas/s/logo`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when logo is empty', async () => {
      const response = await supertest(initServer())
          .patch(`/api/v1/universitas/1/logo`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('logo');
    });

    it('should edit logo successfully', async () => {
      const fileName = new Date().toString + '.png';
      const logoUrl = await TestFileHelper.copy(fileName);
      const univData = [{
        id: 1,
        nama: 'tes',
        alamat: 'tes',
        keterangan: 'tes',
        logo_url: logoUrl,
      }];

      await UniversitasTestHelper.add(univData);

      const response = await supertest(initServer())
          .patch(`/api/v1/universitas/1/logo`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .attach('logo', 'test/test-img.png');

      if (response.body.errors) {
        await TestFileHelper.delete(fileName);
      }

      const universitas = await UniversitasTestHelper.findById(univData[0].id);

      await TestFileHelper.delete(universitas?.logo_url);

      expect(response.status).toEqual(200);
      expect(response.body.status).toBe('success');
      expect(universitas?.logo_url).not.toEqual(logoUrl);
    });
  });
});
