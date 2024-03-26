/* istanbul ignore file */
import {prismaClient} from '../src/infrastructure/database/prisma';

export const SekolahTestHelper = {
  async add(datas = [{
    id: '51e399ac-7963-4a92-b327-ec3e4d888d4c',
    nama: 'TES',
  }]) {
    await prismaClient.sekolah.createMany({data: datas});
  },
  async findById(id = '51e399ac-7963-4a92-b327-ec3e4d888d4c') {
    return prismaClient.sekolah.findFirst({where: {id: id}});
  },
  async clean() {
    await prismaClient.sekolah.deleteMany();
  },
};
