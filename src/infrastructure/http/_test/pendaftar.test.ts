import supertest from 'supertest';
import {initServer} from '../server';
import {AkunTestHelper} from '../../../../test/AkunTestHelper';
import {Jwt, JwtSignPayload} from '../../security/Jwt';
import {v4 as uuid} from 'uuid';
import {Role} from '../../../util/enum';
import {SekolahTestHelper} from '../../../../test/SekolahTestHelper';
import {PendaftarTestHelper} from '../../../../test/PendaftarTestHelper';
import {Agama, Jenis_Kelamin as jenisKelamin} from '@prisma/client';

describe('api/v1/pendaftar endpoint', () => {
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

  // sekolah data
  const sekolahData = {
    id: uuid(),
    nama: 'SMA NEGERI 1 EXAMPLE',
  };

  // akun & pendaftar data
  const ids = [uuid(), uuid()];
  const akunDatas = [
    {
      id: ids[0],
      email: 'example1@gmail.com',
      // eslint-disable-next-line max-len
      password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
      role: Role.PENDAFTAR as 'ADMIN',
    },
    {
      id: ids[1],
      email: 'example2@gmail.com',
      // eslint-disable-next-line max-len
      password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
      role: Role.PENDAFTAR as 'ADMIN',
    },
  ];
  const pendaftarDatas = [
    {
      id: ids[0],
      id_sekolah: sekolahData.id,
      nama: 'EXAMPLE 1',
      nisn: '3981981298981311',
      nik: '3981981298981311',
      jenis_kelamin: jenisKelamin.L,
      kewarganegaraan: 'asdjasdj',
      tempat_lahir: 'asddas',
      tanggal_lahir: new Date(),
      agama: Agama.NONE,
      alamat_jalan: 'sdfsf',
      rt: '21',
      rw: '32',
      kelurahan: 'x',
      kecamatan: 'y',
      provinsi: 'z',
      no_hp: '+977962198',
      no_wa: '+977962198',
    },
    {
      id: ids[1],
      id_sekolah: sekolahData.id,
      nama: 'EXAMPLE 2',
      nisn: '3981981298981312',
      nik: '3981981298981312',
      jenis_kelamin: jenisKelamin.L,
      kewarganegaraan: 'asdjasdj',
      tempat_lahir: 'asddas',
      tanggal_lahir: new Date(),
      agama: Agama.NONE,
      alamat_jalan: 'sdfsf',
      rt: '21',
      rw: '32',
      kelurahan: 'x',
      kecamatan: 'y',
      provinsi: 'z',
      no_hp: '+8217127',
      no_wa: '+2187321798',
    },
  ];

  beforeAll(async () => {
    accessToken = await jwt.createAccessToken(signPayload);
    refreshToken = await jwt.createRefreshToken(signPayload);
    forbiddenAccessToken = await jwt.createAccessToken(forbiddenSignPayload);
    forbiddenRefreshToken = await jwt.createRefreshToken(forbiddenSignPayload);

    await SekolahTestHelper.add([sekolahData]);
  });

  afterAll(async () => {
    await SekolahTestHelper.clean();
  });

  afterEach(async () => {
    await AkunTestHelper.clean();
  });

  describe('when GET /pendaftar', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/pendaftar');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/pendaftar')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return all pendaftar', async () => {
      await AkunTestHelper.add(akunDatas);
      await PendaftarTestHelper.add(pendaftarDatas[0]);
      await PendaftarTestHelper.add(pendaftarDatas[1]);

      const response = await supertest(initServer())
          .get('/api/v1/pendaftar')
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
      expect(body.data.length).toEqual(pendaftarDatas.length);
    });

    it('should return 0 data when searched pendaftar is not found',
        async () => {
          await AkunTestHelper.add(akunDatas);
          await PendaftarTestHelper.add(pendaftarDatas[0]);
          await PendaftarTestHelper.add(pendaftarDatas[1]);

          const response = await supertest(initServer())
              .get('/api/v1/pendaftar?search=z')
              .set('Cookie', [
                `Authorization=Bearer%20${accessToken}`,
                `r=Bearer%20${refreshToken}`,
              ]);

          expect(response.status).toEqual(200);
          expect(response.body.data.length).toEqual(0);
        },
    );

    it('should return 1 data when searched pendaftar is found', async () => {
      await AkunTestHelper.add(akunDatas);
      await PendaftarTestHelper.add(pendaftarDatas[0]);
      await PendaftarTestHelper.add(pendaftarDatas[1]);

      const response = await supertest(initServer())
          .get('/api/v1/pendaftar?search=example 1')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(1);
    });
  });

  describe('when GET /pendaftar/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/pendaftar/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/pendaftar/x')
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
          .get('/api/v1/pendaftar/x')
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
          .get(`/api/v1/pendaftar/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('akun tidak ditemukan');
    });

    it('should return pendaftar successfully', async () => {
      await AkunTestHelper.add(akunDatas);
      await PendaftarTestHelper.add(pendaftarDatas[0]);

      const response = await supertest(initServer())
          .get(`/api/v1/pendaftar/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const data = response.body.data;
      expect(response.status).toEqual(200);
      expect(data.id).toBeDefined();
      expect(data.nama).toBeDefined();
      expect(data.nisn).toBeDefined();
      expect(data.nik).toBeDefined();
      expect(data.jenis_kelamin).toBeDefined();
      expect(data.kewarganegaraan).toBeDefined();
      expect(data.tempat_lahir).toBeDefined();
      expect(data.tanggal_lahir).toBeDefined();
      expect(data.agama).toBeDefined();
      expect(data.alamat_jalan).toBeDefined();
      expect(data.rt).toBeDefined();
      expect(data.rw).toBeDefined();
      expect(data.kelurahan).toBeDefined();
      expect(data.kecamatan).toBeDefined();
      expect(data.provinsi).toBeDefined();
      expect(data.no_hp).toBeDefined();
      expect(data.no_wa).toBeDefined();
      expect(data.created_at).toBeDefined();
    });
  });

  describe('when PUT /pendaftar/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/pendaftar/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/pendaftar/x')
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
          .put('/api/v1/pendaftar/x')
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
          .put(`/api/v1/pendaftar/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(pendaftarDatas[0]);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('akun tidak ditemukan');
    });

    it('should edit successfully', async () => {
      await AkunTestHelper.add(akunDatas);
      await PendaftarTestHelper.add(pendaftarDatas[0]);

      const response = await supertest(initServer())
          .put(`/api/v1/pendaftar/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ])
          .send(pendaftarDatas[0]);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });

  describe('when DELETE /pendaftar/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/pendaftar/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/pendaftar/x')
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
          .delete('/api/v1/pendaftar/x')
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
          .delete(`/api/v1/pendaftar/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('akun tidak ditemukan');
    });

    it('should delete successfully', async () => {
      await AkunTestHelper.add(akunDatas);
      await PendaftarTestHelper.add(pendaftarDatas[0]);

      const response = await supertest(initServer())
          .delete(`/api/v1/pendaftar/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });
});
