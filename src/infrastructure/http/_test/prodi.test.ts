import supertest from 'supertest';
import {initServer} from '../server';
import {UniversitasTestHelper} from '../../../../test/UniversitasTestHelper';
import {ProdiTestHelper} from '../../../../test/ProdiTestHelper';
import {Jwt, JwtSignPayload} from '../../security/Jwt';
import {v4 as uuid} from 'uuid';
import {Role} from '../../../util/enum';
import {
  Jenis_Universitas as JenisUniversitas,
  Jenjang,
  Status_Prodi as StatusProdi,
} from '@prisma/client';

describe('api/v1/prodi endpoint', () => {
  // admin data
  const adminPayload = {
    id: uuid(),
    role: Role.ADMIN,
  };

  // pendaftar data
  const pendaftarPayload = {
    id: uuid(),
    role: Role.PENDAFTAR,
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

  // pendaftar token data
  const pendaftarSignPayload = jwt.mapJwtSignPayload(
    {...pendaftarPayload} as JwtSignPayload,
  );
  let pendaftarAccessToken = '';
  let pendaftarRefreshToken = '';

  // forbidden token data
  const forbiddenSignPayload = jwt.mapJwtSignPayload(
    {...forbiddenPayload} as JwtSignPayload,
  );
  let forbiddenAccessToken = '';
  let forbiddenRefreshToken = '';

  const univData = {
    id: 1,
    nama: 'tes',
    jenis: JenisUniversitas.NEGERI,
    alamat: 'tes st.',
    keterangan: 'tes',
    logo_url: 'tes.png',
  };

  // prodi data
  const ids = [uuid(), uuid()];
  const prodiDatas = [
    {
      id: ids[0],
      nama: 'example 1',
      id_universitas: 1,
      kode_prodi: 12345678,
      jenjang: Jenjang.S1,
      status: StatusProdi.Aktif,
      akreditasi: 'Sangat Baik',
      biaya_pendaftaran: 200000.00,
      ukt: 15000000.00,
      keterangan: 'example',
      potensi_karir: [{nama: 'SQA'}],
    },
    {id: ids[1],
      nama: 'example 2',
      id_universitas: 1,
      kode_prodi: 12345678,
      jenjang: Jenjang.S1,
      status: StatusProdi.Tutup,
      akreditasi: 'Baik',
      biaya_pendaftaran: 200000.00,
      ukt: 15000000.00,
      keterangan: 'example',
      potensi_karir: [{nama: 'SQA'}],
    },
  ];

  beforeAll(async () => {
    accessToken = await jwt.createAccessToken(signPayload);
    refreshToken = await jwt.createRefreshToken(signPayload);
    pendaftarAccessToken = await jwt.createAccessToken(pendaftarSignPayload);
    pendaftarRefreshToken = await jwt.createRefreshToken(pendaftarSignPayload);
    forbiddenAccessToken = await jwt.createAccessToken(forbiddenSignPayload);
    forbiddenRefreshToken = await jwt.createRefreshToken(forbiddenSignPayload);

    await UniversitasTestHelper.add([univData]);
  });

  afterAll(async () => {
    await UniversitasTestHelper.clean();
  });

  afterEach(async () => {
    await ProdiTestHelper.clean();
  });

  describe('when POST /prodi', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/prodi');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/prodi')
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
          .post('/api/v1/prodi')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('nama');
    });

    it('should add prodi successfully', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/prodi')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]).send(prodiDatas[0]);

      expect(response.status).toEqual(201);
      expect(response.body.data.id).not.toBeNull();
    });
  });

  describe('when GET /prodi', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/prodi');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return all prodi', async () => {
      await ProdiTestHelper.add(prodiDatas[0]);
      await ProdiTestHelper.add(prodiDatas[1]);

      const response = await supertest(initServer())
          .get('/api/v1/prodi')
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
      expect(body.total_result).toBeDefined();
      expect(body.data.length).toEqual(prodiDatas.length);
    });

    it('should return 0 data when searched data is not found', async () => {
      await ProdiTestHelper.add(prodiDatas[0]);
      await ProdiTestHelper.add(prodiDatas[1]);

      const response = await supertest(initServer())
          .get('/api/v1/prodi?search=z')
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const body = response.body;
      expect(response.status).toEqual(200);
      expect(body.data.length).toEqual(0);
    });

    it('should return 1 data when searched data is found', async () => {
      await ProdiTestHelper.add(prodiDatas[0]);
      await ProdiTestHelper.add(prodiDatas[1]);

      const response = await supertest(initServer())
          .get(`/api/v1/prodi?search=${prodiDatas[0].nama}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const body = response.body;
      expect(response.status).toEqual(200);
      expect(body.data.length).toEqual(0);
    });

    it('should return 1 data when searched data is found', async () => {
      await ProdiTestHelper.add(prodiDatas[0]);
      await ProdiTestHelper.add(prodiDatas[1]);

      const response = await supertest(initServer())
          .get('/api/v1/prodi')
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftarAccessToken}`,
            `r=Bearer%20${pendaftarRefreshToken}`,
          ]);

      const body = response.body;
      expect(response.status).toEqual(200);
      expect(body.data.length).toEqual(1);
    });
  });

  describe('when GET /prodi/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/prodi/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 400 when id invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/prodi/x')
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
          .get(`/api/v1/prodi/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('prodi tidak ditemukan');
    });

    it('should return prodi successfully', async () => {
      await ProdiTestHelper.add(prodiDatas[0]);

      const response = await supertest(initServer())
          .get(`/api/v1/prodi/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const data = response.body.data;
      expect(response.status).toEqual(200);
      expect(data.id).toBeDefined();
      expect(data.nama).toBeDefined();
      expect(data.kode_prodi).toBeDefined();
      expect(data.jenjang).toBeDefined();
      expect(data.status).toBeDefined();
      expect(data.akreditasi).toBeDefined();
      expect(data.biaya_pendaftaran).toBeDefined();
      expect(data.ukt).toBeDefined();
      expect(data.keterangan).toBeDefined();
      expect(data.universitas).toBeDefined();
      expect(data.universitas).toBeDefined();
      expect(data.universitas.id).toBeDefined();
      expect(data.universitas.nama).toBeDefined();
      expect(data.universitas.jenis).toBeDefined();
      expect(data.universitas.logo_url).toBeDefined();
      expect(data.potensi_karir).toBeDefined();
      expect(data.potensi_karir[0].id).toBeDefined();
      expect(data.potensi_karir[0].nama).toBeDefined();
    });
  });

  describe('when PUT /prodi/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/prodi/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/prodi/x')
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
          .put('/api/v1/prodi/x')
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
          .put(`/api/v1/prodi/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]).send(prodiDatas[0]);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('prodi tidak ditemukan');
    });

    it('should return 400 when request invalid', async () => {
      await ProdiTestHelper.add(prodiDatas[0]);

      const response = await supertest(initServer())
          .put(`/api/v1/prodi/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('nama');
    });

    it('should edit successfully', async () => {
      await ProdiTestHelper.add(prodiDatas[0]);

      const response = await supertest(initServer())
          .put(`/api/v1/prodi/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]).send(prodiDatas[0]);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });

  describe('when DELETE /prodi/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/prodi/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/prodi/x')
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
          .delete('/api/v1/prodi/x')
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
          .delete(`/api/v1/prodi/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('prodi tidak ditemukan');
    });

    it('should delete successfully', async () => {
      await ProdiTestHelper.add(prodiDatas[0]);

      const response = await supertest(initServer())
          .delete(`/api/v1/prodi/${ids[0]}`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });

  describe('when PATCH /prodi/{id}/potensi-karir', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .patch('/api/v1/prodi/x/potensi-karir');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .patch('/api/v1/prodi/x/potensi-karir')
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
          .patch('/api/v1/prodi/x/potensi-karir')
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
          .patch(`/api/v1/prodi/${ids[0]}/potensi-karir`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]).send({potensi_karir: prodiDatas[0].potensi_karir});

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('prodi tidak ditemukan');
    });

    it('should return 400 when request invalid', async () => {
      await ProdiTestHelper.add(prodiDatas[0]);

      const response = await supertest(initServer())
          .patch(`/api/v1/prodi/${ids[0]}/potensi-karir`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('potensi_karir');
    });

    it('should edit prodi potensi karir successfully', async () => {
      const id = await ProdiTestHelper.add(prodiDatas[0]);
      const potensiKarir = [
        {nama: 'SQA'},
        {nama: 'Data Analyst'},
      ];

      const response = await supertest(initServer())
          .patch(`/api/v1/prodi/${ids[0]}/potensi-karir`)
          .set('Cookie', [
            `Authorization=Bearer%20${accessToken}`,
            `r=Bearer%20${refreshToken}`,
          ]).send({potensi_karir: potensiKarir});

      const data = await ProdiTestHelper.findById(id);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(data.potensi_karir?.length).toEqual(potensiKarir.length);
    });
  });
});
