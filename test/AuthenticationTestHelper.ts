/* istanbul ignore file */
import {prismaClient} from '../src/infrastructure/database/prisma';

export const AuthenticationTestHelper = {
  async add(datas: {token: string, expires_at: Date}[]) {
    await prismaClient.authentication.createMany({data: datas});
  },
  async findToken(token: string) {
    return prismaClient.authentication.findFirst({where: {token}});
  },
  async clean() {
    await prismaClient.authentication.deleteMany();
  },
};
