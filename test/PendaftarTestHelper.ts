/* istanbul ignore file */
import {Jenis_Kelamin as jenisKelamin} from '@prisma/client';
import {prismaClient} from '../src/infrastructure/database/prisma';
import {Agama} from '@prisma/client';

export const PendaftarTestHelper = {
  async add(data = {
    id: '51e399ac-7963-4a92-b327-ec3e4d888d4c',
    id_sekolah: '51e399ac-7963-4a92-b327-ec3e4d888d4c',
    nama: 'TES',
    nisn: '21839829121998',
    nik: '2318989231291298',
    jenis_kelamin: jenisKelamin.L,
    kewarganegaraan: 'asdjasdj',
    tempat_lahir: 'asddas',
    tanggal_lahir: new Date(),
    agama: Agama.NONE,
    alamat_jalan: 'sdfsf',
    rt: '21',
    rw: '32',
    kelurahan: 'req.kelurahan.toUpperCase()',
    kecamatan: 'req.kecamatan.toUpperCase()',
    provinsi: 'req.provinsi.toUpperCase()',
    no_hp: 'req.no_hp',
    no_wa: 'req.no_wa',
  }) {
    await prismaClient.pendaftar.create({data});
  },
  async findById(id = '51e399ac-7963-4a92-b327-ec3e4d888d4c') {
    return prismaClient.pendaftar.findFirst({where: {id}});
  },
  async clean() {
    await prismaClient.pendaftar.deleteMany();
  },
};
