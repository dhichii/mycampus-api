/* istanbul ignore file */
import {Jenis_Kelamin as jenisKelamin} from '.prisma/client';
import {prismaClient} from '../src/infrastructure/database/prisma';

export const OperatorTestHelper = {
  async add(datas = [{
    id: '51e399ac-7963-4a92-b327-ec3e4d888d4c',
    nama: 'TES',
    jenis_kelamin: jenisKelamin.L,
    id_universitas: 1,
  }]) {
    await prismaClient.operator.createMany({data: datas});
  },
  async findById(id = '51e399ac-7963-4a92-b327-ec3e4d888d4c') {
    return prismaClient.operator.findFirst({where: {id: id}});
  },
  async clean() {
    await prismaClient.operator.deleteMany();
  },
};
