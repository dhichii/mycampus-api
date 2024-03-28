import supertest from 'supertest';
import {AkunTestHelper} from '../../../../test/AkunTestHelper';
import {AdminTestHelper} from '../../../../test/AdminTestHelper';
import {initServer} from '../server';
import {v4 as uuid} from 'uuid';
import {Role} from '../../../util/enum';

describe('api/v1/admin endpoint', () => {
  afterEach(async () => {
    await AdminTestHelper.clean();
    await AkunTestHelper.clean();
  });

  describe('when POST /admin', () => {
    it('should return 400 when request invalid', async () => {
      const response = await supertest(initServer())
          .post('/api/v1/admin');

      const errors = response.body.errors;
      expect(response.status).toEqual(400);
      expect(errors[0].path[0]).toEqual('email');
    });

    it('should return 400 when email is already exist', async () => {
      const req = {
        nama: 'Admin Example',
        email: 'example@gmail.com',
        // eslint-disable-next-line max-len
        password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
        jenis_kelamin: 'L',
      };

      await AkunTestHelper.add([{
        id: uuid(),
        email: req.email,
        password: req.password,
        role: Role.ADMIN,
      }]);
      const response = await supertest(initServer())
          .post('/api/v1/admin')
          .send(req);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].message).toEqual('email is already exist');
    });

    it('should add admin successfully', async () => {
      const req = {
        nama: 'Admin Example',
        email: 'example@gmail.com',
        password: '12345678',
        jenis_kelamin: 'L',
      };

      const response = await supertest(initServer())
          .post('/api/v1/admin')
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
    it('should return all admin', async () => {
      const adminDatas = [
        {
          id: uuid(),
          nama: 'Admin Example',
          email: 'example1@gmail.com',
          // eslint-disable-next-line max-len
          password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
          jenis_kelamin: 'L' as 'L',
          role: Role.ADMIN as 'ADMIN',
        },
        {
          id: uuid(),
          nama: 'Admin Example',
          email: 'example2@gmail.com',
          // eslint-disable-next-line max-len
          password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
          jenis_kelamin: 'L' as 'L',
          role: Role.ADMIN as 'ADMIN',
        },
      ];
      await AkunTestHelper.add(adminDatas.map((data) => {
        return {
          id: data.id,
          email: data.email,
          password: data.password,
          role: data.role,
        };
      }));
      await AdminTestHelper.add(adminDatas.map((data) => {
        return {
          id: data.id,
          nama: data.nama,
          jenis_kelamin: data.jenis_kelamin,
        };
      }));

      const response = await supertest(initServer())
          .get('/api/v1/admin');

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
              .get('/api/v1/admin?search=x');

          expect(response.status).toEqual(200);
          expect(response.body.data.length).toEqual(0);
        },
    );

    it('should return 1 record when searched admin is found', async () => {
      await AkunTestHelper.add();
      await AdminTestHelper.add();

      const response = await supertest(initServer())
          .get('/api/v1/admin?search=tes');

      expect(response.status).toEqual(200);
      expect(response.body.data.length).toEqual(1);
    });
  });

  describe('when GET /admin/{id}', () => {
    it('should return 400 when id is invalid', async () => {
      const response = await supertest(initServer())
          .get('/api/v1/admin/s');
      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const id = uuid();

      const response = await supertest(initServer())
          .get(`/api/v1/admin/${id}`);

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('akun tidak ditemukan');
    } );

    it('should return admin', async () => {
      const id = uuid();

      await AkunTestHelper.add([{
        id: id,
        email: 'example1@gmail.com',
        // eslint-disable-next-line max-len
        password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
        role: Role.ADMIN,
      }]);
      await AdminTestHelper.add([{
        id: id,
        nama: 'Admin Example',
        jenis_kelamin: 'L',
      }]);

      const response = await supertest(initServer())
          .get(`/api/v1/admin/${id}`);

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
    it('should return 400 when id is invalid', async () => {
      const response = await supertest(initServer())
          .put('/api/v1/admin/s');
      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 400 when request invalid', async () => {
      const id = uuid();
      const response = await supertest(initServer())
          .put(`/api/v1/admin/${id}`);

      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('nama');
    });

    it('should return 404 when not found', async () => {
      const id = uuid();
      const response = await supertest(initServer())
          .put(`/api/v1/admin/${id}`)
          .send({
            nama: 'example',
            jenis_kelamin: 'L',
          });

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('akun tidak ditemukan');
    });

    it('should edit successfully', async () => {
      const id = uuid();
      const newNama = 'examples';
      const req = {
        nama: 'Admin Example',
        email: 'example1@gmail.com',
        // eslint-disable-next-line max-len
        password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
        jenis_kelamin: 'L' as 'L',
        role: Role.ADMIN as 'ADMIN',
      };

      await AkunTestHelper.add([{
        id,
        email: req.email,
        password: req.password,
        role: req.role,
      }]);
      await AdminTestHelper.add([{
        id,
        nama: req.nama,
        jenis_kelamin: req.jenis_kelamin,
      }]);

      const response = await supertest(initServer())
          .put(`/api/v1/admin/${id}`)
          .send({nama: newNama, jenis_kelamin: req.jenis_kelamin});

      const data = await AdminTestHelper.findById(id);

      expect(response.status).toEqual(200);
      expect(data?.nama).toEqual(newNama.toUpperCase());
    });
  });

  describe('when DELETE /admin/{id}', () => {
    it('should return 400 when id is invalid', async () => {
      const response = await supertest(initServer())
          .delete('/api/v1/admin/s');
      expect(response.status).toEqual(400);
      expect(response.body.errors[0].path[0]).toEqual('id');
    });

    it('should return 404 when not found', async () => {
      const id = uuid();
      const response = await supertest(initServer())
          .delete(`/api/v1/admin/${id}`);

      expect(response.status).toEqual(404);
      expect(response.body.errors[0].message).toEqual('akun tidak ditemukan');
    });

    it('should delete successfully', async () => {
      const id = uuid();
      const req = {
        nama: 'Admin Example',
        email: 'example1@gmail.com',
        // eslint-disable-next-line max-len
        password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
        jenis_kelamin: 'L' as 'L',
        role: Role.ADMIN as 'ADMIN',
      };

      await AkunTestHelper.add([{
        id,
        email: req.email,
        password: req.password,
        role: req.role,
      }]);
      await AdminTestHelper.add([{
        id,
        nama: req.nama,
        jenis_kelamin: req.jenis_kelamin,
      }]);

      const response = await supertest(initServer())
          .delete(`/api/v1/admin/${id}`);

      const akun = await AkunTestHelper.findById(id);
      const admin = await AdminTestHelper.findById(id);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(akun?.deleted_at).not.toBeNull();
      expect(admin?.deleted_at).not.toBeNull();
    });
  });
});
