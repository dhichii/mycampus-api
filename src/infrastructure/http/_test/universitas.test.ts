import supertest from 'supertest';
import {initServer} from '../server';
import {UniversitasTestHelper} from '../../../../test/UniversitasTestHelper';
import {TestFileHelper} from '../../../../test/TestFileHelper';

describe('api/v1/universitas endpoint', () => {
  afterEach(async () => {
    await UniversitasTestHelper.clean();
  });

  describe('when POST /universitas', () => {
    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/universitas')
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
        nama: 'nama=xxdsffjhgfhgdsfdfdsgf',
        alamat: 'xxdsffjhgfhgdsfdfdsgf',
        keterangan: 'xxdsffjhgfhgdsfdfdsgf',
      };
      const response = await supertest(initServer())
          .post('/api/v1/universitas')
          .field(request)
          .attach('logo', 'test/test-img.png');

      const {id, nama, alamat, keterangan, logo_url: logo} = response.body.data;

      // delete uploaded img
      await TestFileHelper.delete(logo);

      expect(response.status).toEqual(201);
      expect(response.body.data).toBeDefined();
      expect(id).toBeDefined();
      expect(nama).toEqual(request.nama);
      expect(alamat).toEqual(request.alamat);
      expect(keterangan).toEqual(request.keterangan);
      expect(logo).toBeDefined();
    });
  });

  describe('when GET /universitas', () => {
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
          .get('/api/v1/universitas');

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toBe(univDatas.length);
      expect(response.body.data).toStrictEqual(univDatas);
    });
  });

  describe('when GET /universitas/{id}', () => {
    it('should return 400 when id is not a number', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/universitas/s');

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/universitas/1');

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
          .get('/api/v1/universitas/1');

      expect(response.status).toEqual(200);
      expect(response.body.data).toStrictEqual(univData[0]);
    });
  });

  describe('when PUT /universitas/{id}', () => {
    it('should return 400 when id is not a number', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/universitas/s');

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/universitas/1');

      expect(response.status).toEqual(400);
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/universitas/1')
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
        nama: 'nama=xxdsffjhgfhgdsfdfdsgf',
        alamat: 'xxdsffjhgfhgdsfdfdsgf',
        keterangan: 'xxdsffjhgfhgdsfdfdsgf',
      };

      const response = await supertest(initServer())
          .put(`/api/v1/universitas/${univData[0].id}`)
          .field(request);

      const universitas = await UniversitasTestHelper.findById(univData[0].id);

      expect(response.status).toEqual(200);
      expect(response.body.status).toBe('success');
      expect(universitas?.nama).toBe(request.nama);
      expect(universitas?.alamat).toBe(request.alamat);
      expect(universitas?.keterangan).toBe(request.keterangan);
    });
  });

  describe('when DELETE /universitas/{id}', () => {
    it('should return 400 when id is not a number', async () => {
      const response = await supertest(initServer())
          .delete(`/api/v1/universitas/s`);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/universitas/1');

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
          .delete(`/api/v1/universitas/${univData[0].id}`);

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
    it('should return 400 when id is not a number', async () => {
      const response = await supertest(initServer())
          .patch(`/api/v1/universitas/s/logo`);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when logo is empty', async () => {
      const response = await supertest(initServer())
          .patch(`/api/v1/universitas/1/logo`);

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
