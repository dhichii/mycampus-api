import supertest from 'supertest';
import {initServer} from '../server';
import {Jwt, JwtSignPayload} from '../../security/Jwt';
import {v4 as uuid} from 'uuid';
import {Role} from '../../../util/enum';
import {
  Jenis_Universitas as JenisUniversitas,
  Jenis_Kelamin as JenisKelamin,
  Jenjang,
  Status_Prodi as StatusProdi,
  Agama,
  StatusPendaftaran,
} from '@prisma/client';
import {UniversitasTestHelper} from '../../../../test/UniversitasTestHelper';
import {ProdiTestHelper} from '../../../../test/ProdiTestHelper';
import {SekolahTestHelper} from '../../../../test/SekolahTestHelper';
import {AkunTestHelper} from '../../../../test/AkunTestHelper';
import {PendaftarTestHelper} from '../../../../test/PendaftarTestHelper';
import {PendaftaranTestHelper} from '../../../../test/PendaftaranTestHelper';

describe('api/v1/pendaftaran', () => {
// sekolah data
  const sekolahData = {
    id: uuid(),
    nama: 'SMA NEGERI 1 EXAMPLE',
  };

  // universitas data
  const universitasDatas = [
    {
      id: 1,
      nama: 'EXAMPLE 1',
      jenis: JenisUniversitas.NEGERI,
      alamat: 'tes st.',
      keterangan: 'tes',
      logo_url: 'tes.png',
    },
    {
      id: 2,
      nama: 'EXAMPLE 2',
      jenis: JenisUniversitas.NEGERI,
      alamat: 'tes st.',
      keterangan: 'tes',
      logo_url: 'tes.png',
    },
  ];

  // prodi data
  const prodiDatas = [
    {
      id: uuid(),
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
    {
      id: uuid(),
      nama: 'example 2',
      id_universitas: 2,
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

  // pendaftar data
  const idPendaftar = uuid();
  const akunPendaftar = {
    id: idPendaftar,
    email: 'example1@gmail.com',
    // eslint-disable-next-line max-len
    password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
    role: Role.PENDAFTAR as 'ADMIN',
  };

  const pendaftarData = {
    id: idPendaftar,
    id_sekolah: sekolahData.id,
    nama: 'TES',
    nisn: '21839829121998',
    nik: '2318989231291298',
    jenis_kelamin: JenisKelamin.L,
    kewarganegaraan: 'asdjasdj',
    tempat_lahir: 'asddas',
    tanggal_lahir: new Date(),
    agama: Agama.NONE,
    alamat_jalan: 'sdfsf',
    rt: '21',
    rw: '32',
    kelurahan: 'req.kelurahan.toUpperCase()',
    kecamatan: 'req.kecamatan.toUpperCase()',
    provinsi: 'req.provinsi.toUpperCase()',
    no_hp: 'req.no_hp',
    no_wa: 'req.no_wa',
  };

  // pendaftaran data
  const pendaftaranDatas = [
    {
      id: uuid(),
      id_pendaftar: pendaftarData.id,
      id_prodi: prodiDatas[0].id,
      jalur_pendaftaran: 'Mandiri',
    },
    {
      id: uuid(),
      id_pendaftar: pendaftarData.id,
      id_prodi: prodiDatas[1].id,
      jalur_pendaftaran: 'Mandiri',
    },
  ];

  // token payload data
  const pendaftar1Payload = {
    id: pendaftarData.id,
    role: Role.PENDAFTAR,
    id_sekolah: sekolahData.id,
  };

  const pendaftar2Payload = {
    id: uuid(),
    role: Role.PENDAFTAR,
    id_sekolah: sekolahData.id,
  };

  const operatorPayload = {
    id: uuid(),
    role: Role.OPERATOR,
    id_universitas: universitasDatas[0].id,
  };

  const pihakSekolahPayload = {
    id: uuid(),
    role: Role.SEKOLAH,
    id_sekolah: sekolahData.id,
  };

  const forbiddenPayload = {
    id: uuid(),
    role: 'OTHER',
  };

  // token data
  const jwt = new Jwt();

  const operatorSignPayload = jwt.mapJwtSignPayload(
    {...operatorPayload} as JwtSignPayload,
  );
  let operatorAccessToken = '';
  let operatorRefreshToken = '';

  const pendaftar1SignPayload = jwt.mapJwtSignPayload(
    {...pendaftar1Payload} as JwtSignPayload,
  );
  let pendaftar1AccessToken = '';
  let pendaftar1RefreshToken = '';

  const pendaftar2SignPayload = jwt.mapJwtSignPayload(
    {...pendaftar2Payload} as JwtSignPayload,
  );
  let pendaftar2AccessToken = '';
  let pendaftar2RefreshToken = '';

  const pihakSekolahSignPayload = jwt.mapJwtSignPayload(
    {...pihakSekolahPayload} as JwtSignPayload,
  );
  let pihakSekolahAccessToken = '';
  let pihakSekolahRefreshToken = '';

  const forbiddenSignPayload = jwt.mapJwtSignPayload(
    {...forbiddenPayload} as JwtSignPayload,
  );
  let forbiddenAccessToken = '';
  let forbiddenRefreshToken = '';

  const req = {
    id_prodi: prodiDatas[0].id,
    jalur_pendaftaran: 'Mandiri',
    status: StatusPendaftaran.Diproses,
  };

  beforeAll(async () => {
    pendaftar1AccessToken = await jwt.createAccessToken(pendaftar1SignPayload);
    pendaftar1RefreshToken = await jwt
        .createRefreshToken(pendaftar1SignPayload);
    operatorAccessToken = await jwt.createAccessToken(operatorSignPayload);
    operatorRefreshToken = await jwt.createRefreshToken(operatorSignPayload);
    pendaftar2AccessToken = await jwt.createAccessToken(pendaftar2SignPayload);
    pendaftar2RefreshToken = await jwt
        .createRefreshToken(pendaftar2SignPayload);
    pihakSekolahAccessToken = await jwt
        .createAccessToken(pihakSekolahSignPayload);
    pihakSekolahRefreshToken = await jwt
        .createRefreshToken(pihakSekolahSignPayload);
    forbiddenAccessToken = await jwt.createAccessToken(forbiddenSignPayload);
    forbiddenRefreshToken = await jwt.createRefreshToken(forbiddenSignPayload);

    await UniversitasTestHelper.add(universitasDatas);
    await ProdiTestHelper.add(prodiDatas[0]);
    await ProdiTestHelper.add(prodiDatas[1]);
    await SekolahTestHelper.add([sekolahData]);
    await AkunTestHelper.add([akunPendaftar]);
    await PendaftarTestHelper.add(pendaftarData);
  });

  afterAll(async () => {
    await UniversitasTestHelper.clean();
    await AkunTestHelper.clean();
    await SekolahTestHelper.clean();
  });

  afterEach(async () => {
    await PendaftaranTestHelper.clean();
  });

  describe('when POST /pendaftaran', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/pendaftaran');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/pendaftaran')
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
          .post('/api/v1/pendaftaran')
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('id_prodi');
    });

    it('should return 403 when already registered pendaftaran', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);

      const response = await supertest(initServer())
          .post('/api/v1/pendaftaran')
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ])
          .send(req);

      expect(response.status).toEqual(403);
      expect(response.body.errors[0].message)
          .toEqual('anda sudah mendaftar pada prodi ini');
    });

    it('should add pendaftaran successfully', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/pendaftaran')
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ])
          .send(req);

      expect(response.status).toEqual(201);
      expect(response.body.data.id).not.toBeNull();
    });
  });

  describe('when GET /pendaftaran', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/pendaftaran');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return all pendaftaran', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);
      await PendaftaranTestHelper.add(pendaftaranDatas[1]);

      const response = await supertest(initServer())
          .get('/api/v1/pendaftaran')
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ]);

      const body = response.body;
      const data = body.data;
      expect(response.status).toEqual(200);
      expect(body.limit).toBeDefined();
      expect(body.page).toBeDefined();
      expect(body.total_page).toBeDefined();
      expect(body.total_result).toBeDefined();
      expect(body.total_result).toBeDefined();
      expect(data.length).toEqual(pendaftaranDatas.length);
    });

    it('should return 0 data when accessed by pendaftar 2', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);
      await PendaftaranTestHelper.add(pendaftaranDatas[1]);

      const response = await supertest(initServer())
          .get('/api/v1/pendaftaran')
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar2AccessToken}`,
            `r=Bearer%20${pendaftar2RefreshToken}`,
          ]);

      const body = response.body;
      expect(response.status).toEqual(200);
      expect(body.data.length).toEqual(0);
    });

    it('should return 1 data when accessed by operator', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);
      await PendaftaranTestHelper.add(pendaftaranDatas[1]);

      const response = await supertest(initServer())
          .get('/api/v1/pendaftaran')
          .set('Cookie', [
            `Authorization=Bearer%20${operatorAccessToken}`,
            `r=Bearer%20${operatorRefreshToken}`,
          ]);

      const body = response.body;
      expect(response.status).toEqual(200);
      expect(body.data.length).toEqual(1);
    });

    it('should return 2 data when accessed by pihak sekolah', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);
      await PendaftaranTestHelper.add(pendaftaranDatas[1]);

      const response = await supertest(initServer())
          .get(`/api/v1/pendaftaran`)
          .set('Cookie', [
            `Authorization=Bearer%20${pihakSekolahAccessToken}`,
            `r=Bearer%20${pihakSekolahRefreshToken}`,
          ]);

      const body = response.body;
      expect(response.status).toEqual(200);
      expect(body.data.length).toEqual(2);
    });
  });

  describe('when GET /pendaftaran/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/pendaftaran/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 400 when id invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/pendaftaran/x')
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('id');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .get(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .get(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('pendaftaran tidak ditemukan');
    });

    // eslint-disable-next-line max-len
    it('should return 403 when accessed by others pendaftar', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);

      const response = await supertest(initServer())
          .get(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar2AccessToken}`,
            `r=Bearer%20${pendaftar2RefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should return pendaftaran successfully', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);

      const response = await supertest(initServer())
          .get(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ]);

      const data = response.body.data;
      const prodi = data.prodi;
      const universitas = prodi.universitas;
      const pendaftar = data.pendaftar;
      expect(response.status).toEqual(200);
      expect(data.id).toBeDefined();
      expect(data.jalur_pendaftaran).toBeDefined();
      expect(data.status).toBeDefined();
      expect(data.created_at).toBeDefined();
      expect(prodi).toBeDefined();
      expect(prodi.id).toBeDefined();
      expect(prodi.jenjang).toBeDefined();
      expect(prodi.nama).toBeDefined();
      expect(prodi.akreditasi).toBeDefined();
      expect(prodi.biaya_pendaftaran).toBeDefined();
      expect(prodi.ukt).toBeDefined();
      expect(universitas).toBeDefined();
      expect(universitas.id).toBeDefined();
      expect(universitas.nama).toBeDefined();
      expect(universitas.jenis).toBeDefined();
      expect(universitas.logo_url).toBeDefined();
      expect(pendaftar).toBeDefined();
      expect(pendaftar.id).toBeDefined();
      expect(pendaftar.nama).toBeDefined();
      expect(pendaftar.nisn).toBeDefined();
      expect(pendaftar.nik).toBeDefined();
      expect(pendaftar.email).toBeDefined();
      expect(pendaftar.jenis_kelamin).toBeDefined();
      expect(pendaftar.kewarganegaraan).toBeDefined();
      expect(pendaftar.tempat_lahir).toBeDefined();
      expect(pendaftar.tanggal_lahir).toBeDefined();
      expect(pendaftar.agama).toBeDefined();
      expect(pendaftar.alamat_jalan).toBeDefined();
      expect(pendaftar.rt).toBeDefined();
      expect(pendaftar.rw).toBeDefined();
      expect(pendaftar.kelurahan).toBeDefined();
      expect(pendaftar.kecamatan).toBeDefined();
      expect(pendaftar.provinsi).toBeDefined();
      expect(pendaftar.no_hp).toBeDefined();
      expect(pendaftar.no_wa).toBeDefined();
      expect(pendaftar.asal_sekolah).toBeDefined();
      expect(pendaftar.asal_sekolah.id).toBeDefined();
      expect(pendaftar.asal_sekolah.nama).toBeDefined();
    });
  });

  describe('when PUT /pendaftaran/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/pendaftaran/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/pendaftaran/x')
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
          .put('/api/v1/pendaftaran/x')
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when request invalid', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);

      const response = await supertest(initServer())
          .put(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('jalur_pendaftaran');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .put(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ])
          .send(req);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('pendaftaran tidak ditemukan');
    });

    it('should return 403 when accessed by other pendaftar', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);

      const response = await supertest(initServer())
          .put(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar2AccessToken}`,
            `r=Bearer%20${pendaftar2RefreshToken}`,
          ])
          .send(req);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should edit successfully', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);

      const response = await supertest(initServer())
          .put(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ])
          .send(req);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });

  describe('when DELETE /pendaftaran/{id}', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/pendaftaran/x');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/pendaftaran/x')
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
          .delete('/api/v1/pendaftaran/x')
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .delete(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('pendaftaran tidak ditemukan');
    });

    it('should return 403 when accessed by other pendaftar', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);

      const response = await supertest(initServer())
          .delete(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar2AccessToken}`,
            `r=Bearer%20${pendaftar2RefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should delete successfully', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);

      const response = await supertest(initServer())
          .delete(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}`)
          .set('Cookie', [
            `Authorization=Bearer%20${pendaftar1AccessToken}`,
            `r=Bearer%20${pendaftar1RefreshToken}`,
          ]);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  });

  describe('when PATCH /pendaftaran/{id}/status', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .patch('/api/v1/pendaftaran/x/status');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .patch('/api/v1/pendaftaran/x/status')
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
          .patch('/api/v1/pendaftaran/x/status')
          .set('Cookie', [
            `Authorization=Bearer%20${operatorAccessToken}`,
            `r=Bearer%20${operatorRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .patch(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}/status`)
          .set('Cookie', [
            `Authorization=Bearer%20${operatorAccessToken}`,
            `r=Bearer%20${operatorRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('status');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .patch(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}/status`)
          .set('Cookie', [
            `Authorization=Bearer%20${operatorAccessToken}`,
            `r=Bearer%20${operatorRefreshToken}`,
          ])
          .send(req);

      const errors = response.body.errors;
      expect(response.status).toEqual(404);
      expect(errors[0].message).toEqual('pendaftaran tidak ditemukan');
    });

    // eslint-disable-next-line max-len
    it('should return 403 when accessed by operator from other university', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[1]);

      const response = await supertest(initServer())
          .patch(`/api/v1/pendaftaran/${pendaftaranDatas[1].id}/status`)
          .set('Cookie', [
            `Authorization=Bearer%20${operatorAccessToken}`,
            `r=Bearer%20${operatorRefreshToken}`,
          ])
          .send(req);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should edit pendaftaran successfully', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);

      const response = await supertest(initServer())
          .patch(`/api/v1/pendaftaran/${pendaftaranDatas[0].id}/status`)
          .set('Cookie', [
            `Authorization=Bearer%20${operatorAccessToken}`,
            `r=Bearer%20${operatorRefreshToken}`,
          ])
          .send(req);

      const data = await PendaftaranTestHelper.findById(pendaftaranDatas[0].id);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(data?.status).toEqual(req.status);
    });
  });

  describe('when PATCH /pendaftaran/proses', () => {
    it('should return 401 when credentials invalid', async () => {
      const response = await supertest(initServer())
          .patch('/api/v1/pendaftaran/proses');

      const errors = response.body.errors;
      expect(response.status).toEqual(401);
      expect(errors[0].message)
          .toEqual('sesi kadaluarsa, silahkan login kembali');
    });

    it('should return 403 when role invalid', async () => {
      const response = await supertest(initServer())
          .patch('/api/v1/pendaftaran/proses')
          .set('Cookie', [
            `Authorization=Bearer%20${forbiddenAccessToken}`,
            `r=Bearer%20${forbiddenRefreshToken}`,
          ]);

      const errors = response.body.errors;
      expect(response.status).toEqual(403);
      expect(errors[0].message).toEqual('Anda tidak memiliki akses');
    });

    it('should proses successfully', async () => {
      await PendaftaranTestHelper.add(pendaftaranDatas[0]);

      const response = await supertest(initServer())
          .patch(`/api/v1/pendaftaran/proses`)
          .set('Cookie', [
            `Authorization=Bearer%20${operatorAccessToken}`,
            `r=Bearer%20${operatorRefreshToken}`,
          ])
          .send(req);

      const data = await PendaftaranTestHelper.findById(pendaftaranDatas[0].id);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(data?.status).toEqual(StatusPendaftaran.Diproses);
    });
  });

  it('should not proses the other university pendaftaran', async () => {
    await PendaftaranTestHelper.add(pendaftaranDatas[0]);
    await PendaftaranTestHelper.add(pendaftaranDatas[1]);

    const response = await supertest(initServer())
        .patch(`/api/v1/pendaftaran/proses`)
        .set('Cookie', [
          `Authorization=Bearer%20${operatorAccessToken}`,
          `r=Bearer%20${operatorRefreshToken}`,
        ])
        .send(req);

    const data1 = await PendaftaranTestHelper.findById(pendaftaranDatas[0].id);
    const data2 = await PendaftaranTestHelper.findById(pendaftaranDatas[1].id);

    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual('success');
    expect(data1?.status).toEqual(StatusPendaftaran.Diproses);
    expect(data2?.status).toEqual(StatusPendaftaran.Menunggu);
  });
});
