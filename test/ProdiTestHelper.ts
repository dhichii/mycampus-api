/* istanbul ignore file */

import {Jenjang, Status_Prodi as StatusProdi} from '@prisma/client';
import {prismaClient} from '../src/infrastructure/database/prisma';

export const ProdiTestHelper = {
  async add(data = {
    id: '51e399ac-7963-4a92-b327-ec3e4d888d4c',
    nama: 'example',
    id_universitas: 1,
    kode_prodi: 12345678,
    jenjang: 'S1' as Jenjang,
    status: 'Aktif' as StatusProdi,
    akreditasi: 'Sangat Baik',
    biaya_pendaftaran: 200000.00,
    ukt: 15000000.00,
    keterangan: 'example',
    potensi_karir: [{nama: 'SQA'}],
  }) {
    const potensiKarirData = data.potensi_karir.map((value) => {
      const nama = value.nama;

      return {
        potensi_karir: {
          connectOrCreate: {
            where: {nama},
            create: {nama},
          },
        },
      };
    });

    await prismaClient.prodi.create({
      data: {
        ...data,
        potensi_karir: {
          create: potensiKarirData,
        },
      },
    });

    return data.id;
  },

  async findById(id = '51e399ac-7963-4a92-b327-ec3e4d888d4c') {
    const data = await prismaClient.prodi.findFirst({
      where: {id},
      include: {
        potensi_karir: {
          include: {potensi_karir: true},
        },
        universitas: true,
      },
    });

    return {
      ...data,
      potensi_karir: data?.potensi_karir.map((potensiKarir) => {
        return potensiKarir.potensi_karir;
      }),
    };
  },

  async clean() {
    await prismaClient.prodi.deleteMany();
  },
};
