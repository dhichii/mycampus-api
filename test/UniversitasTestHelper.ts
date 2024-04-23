/* istanbul ignore file */
import {Jenis_Universitas as JenisUniversitas} from '@prisma/client';
import {prismaClient} from '../src/infrastructure/database/prisma';

export const UniversitasTestHelper = {
  async add(datas = [{
    id: 1,
    nama: 'tes',
    jenis: JenisUniversitas.NEGERI,
    alamat: 'tes st.',
    keterangan: 'tes',
    logo_url: 'tes.png',
  }]) {
    await prismaClient.universitas.createMany({data: datas});
  },

  async findById(id = 1) {
    return prismaClient.universitas.findFirst({where: {id: id}});
  },

  async clean() {
    await prismaClient.universitas.deleteMany();
  },
};
