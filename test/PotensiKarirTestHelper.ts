import {prismaClient} from '../src/infrastructure/database/prisma';

export const PotensiKarirTestHelper = {
  async add(data = {
    id: 1,
    nama: 'EXAMPLE 1',
  }) {
    await prismaClient.potensiKarir.create({data});
  },
  async findById(id = 1) {
    return prismaClient.potensiKarir.findFirst({where: {id}});
  },
  async clean() {
    await prismaClient.potensiKarir.deleteMany();
  },
};
