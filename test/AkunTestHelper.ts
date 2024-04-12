/* istanbul ignore file */
import {Role} from '.prisma/client';
import {prismaClient} from '../src/infrastructure/database/prisma';

export const AkunTestHelper = {
  async add(datas = [{
    id: '51e399ac-7963-4a92-b327-ec3e4d888d4c',
    email: 'x@gmail.com',
    password: '$2a$12$rnT5tzFGh4HAYSCZfyz1XuaBU9BjwoySUsOk2jMZzhJ.ECBTFZxLO',
    role: Role.ADMIN,
  }]) {
    await prismaClient.akun.createMany({data: datas});
  },
  async findById(id = '51e399ac-7963-4a92-b327-ec3e4d888d4c') {
    return prismaClient.akun.findFirst({where: {id: id}});
  },
  async clean() {
    await prismaClient.akun.deleteMany();
  },
};
