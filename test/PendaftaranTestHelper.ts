/* istanbul ignore file */
import {prismaClient} from '../src/infrastructure/database/prisma';

export const PendaftaranTestHelper = {
  async add(data = {
    id: '51e399ac-7963-4a92-b327-ec3e4d888d4c',
    id_pendaftar: '51e399ac-7963-4a92-b327-ec3e4d888d4c',
    id_prodi: '51e399ac-7963-4a92-b327-ec3e4d888d4c',
    jalur_pendaftaran: 'Mandiri',
  }) {
    await prismaClient.pendaftaran.create({data});

    return data.id;
  },

  async findById(id = '51e399ac-7963-4a92-b327-ec3e4d888d4c') {
    const data = await prismaClient.pendaftaran.findUnique({where: {id}});

    return data;
  },

  async clean() {
    await prismaClient.pendaftaran.deleteMany();
  },
};
