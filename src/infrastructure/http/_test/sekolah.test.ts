import supertest from 'supertest';
import {SekolahTestHelper} from '../../../../test/SekolahTestHelper';
import {initServer} from '../server';
import {v4 as uuid} from 'uuid';

describe('api/v1/sekolah endpoint', () => {
  afterEach(async () => {
    await SekolahTestHelper.clean();
  });

  describe('when POST /sekolah', () => {
    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/sekolah');

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('nama');
    });

    it('should return 400 when name is already exist', async () => {
      const nama = 'SEKOLAH NEGERI 1 XXX';
      await SekolahTestHelper.add([{id: uuid(), nama}]);
      const response = await supertest(initServer())
          .post('/api/v1/sekolah')
          .send({nama});

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].message).toEqual('nama is already exist');
    });

    it('should add sekolah successfully', async () => {
      const nama = 'SEKOLAH NEGERI 1 XXX';
      const response = await supertest(initServer())
          .post('/api/v1/sekolah')
          .send({nama});

      expect(response.status).toEqual(201);
      expect(response.body.data.nama).toEqual(nama);
    });
  });

  describe('when GET /sekolah', () => {
    it('should return all sekolah', async () => {
      const sekolahDatas = [
        {id: uuid(), nama: 'SEKOLAH 1'},
        {id: uuid(), nama: 'SEKOLAH 2'},
      ];
      await SekolahTestHelper.add(sekolahDatas);

      const response = await supertest(initServer())
          .get('/api/v1/sekolah');

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
          const sekolahDatas = [
            {id: uuid(), nama: 'SEKOLAH 1'},
          ];
          await SekolahTestHelper.add(sekolahDatas);

          const response = await supertest(initServer())
              .get('/api/v1/sekolah?search=x');

          expect(response.status).toEqual(200);
          expect(response.body.data.length).toEqual(0);
        },
    );

    it('should return 1 record when searched sekolah is found', async () => {
      const sekolahDatas = [
        {id: uuid(), nama: 'SEKOLAH 1'},
        {id: uuid(), nama: 'SEKOLAH 2'},
      ];
      await SekolahTestHelper.add(sekolahDatas);

      const response = await supertest(initServer())
          .get('/api/v1/sekolah?search=sekolah 1');

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(1);
    });
  });

  describe('when PUT /sekolah/{id}', () => {
    it('should return 400 when id is invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/sekolah/s');
      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when request invalid', async () => {
      const id = uuid();
      const response = await supertest(initServer())
          .put(`/api/v1/sekolah/${id}`);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('nama');
    });

    it('should return 404 when not found', async () => {
      const id = uuid();
      const response = await supertest(initServer())
          .put(`/api/v1/sekolah/${id}`)
          .send({nama: 'SEKOLAH NEGERI 1'});

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('sekolah not found');
    });

    it('should edit successfully', async () => {
      const id = uuid();
      const newNama = 'SEKOLAH NEGERI 1';
      const sekolahDatas = [
        {id, nama: 'SEKOLAH 1'},
      ];
      await SekolahTestHelper.add(sekolahDatas);

      const response = await supertest(initServer())
          .put(`/api/v1/sekolah/${id}`)
          .send({nama: newNama});

      const data = await SekolahTestHelper.findById(id);

      expect(response.status).toEqual(200);
      expect(data?.nama).toEqual(newNama);
    });
  });

  describe('when DELETE /sekolah/{id}', () => {
    it('should return 400 when id is invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/sekolah/s');
      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const id = uuid();
      const response = await supertest(initServer())
          .delete(`/api/v1/sekolah/${id}`);

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('sekolah not found');
    });

    it('should delete successfully', async () => {
      const id = uuid();
      const sekolahDatas = [
        {id, nama: 'SEKOLAH 1'},
      ];
      await SekolahTestHelper.add(sekolahDatas);

      const response = await supertest(initServer())
          .delete(`/api/v1/sekolah/${id}`);

      const sekolah = await SekolahTestHelper.findById(id);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(sekolah).toBeNull();
    });
  });
});
