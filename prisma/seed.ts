import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`
  INSERT INTO jenjang (id, nama)
  VALUES
    (1, 'D1'),
    (2, 'D2'),
    (3, 'D3'),
    (4, 'S1'),
    (5, 'S2'),
    (6, 'S3');
  `;
}

main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
