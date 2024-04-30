import {ZodType, z} from 'zod';
import {DATE_REGEX, NUMBER_REGEX, PHONE_REGEX} from '../../util/regex';

export class PendaftarValidation {
  static readonly ADD: ZodType = z.object({
    nama: z.string().max(255),
    nisn: z.string().regex(NUMBER_REGEX, 'nisn harus berupa angka'),
    nik: z.string()
        .regex(NUMBER_REGEX, 'nik harus berupa angka')
        .min(16)
        .max(20),
    email: z.string().email().max(120),
    password: z.string().min(8).max(255),
    jenis_kelamin: z.enum(['L', 'P']),
    asal_sekolah: z.optional(z.string().min(10).max(255)),
    kewarganegaraan: z.string().max(50),
    tempat_lahir: z.string().max(255),
    tanggal_lahir: z.string().regex(DATE_REGEX, 'format tanggal tidak sesuai'),
    agama: z.enum([
      'ISLAM',
      'KRISTEN',
      'KATOLIK',
      'HINDU',
      'BUDDHA',
      'KONGHUCU',
      'NONE',
    ]),
    alamat_jalan: z.string().max(255),
    rt: z.string().regex(NUMBER_REGEX, 'rt harus berupa angka').max(4),
    rw: z.string().regex(NUMBER_REGEX, 'rw harus berupa angka').max(4),
    kelurahan: z.string().max(100),
    kecamatan: z.string().max(100),
    provinsi: z.string().max(100),
    no_hp: z.string()
        .regex(PHONE_REGEX, 'nomor tidak valid')
        .max(20),
    no_wa: z.optional(
        z.string()
            .regex(PHONE_REGEX, 'nomor tidak valid')
            .max(20),
    ),
  });

  static readonly GET_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
  });

  static readonly EDIT_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
    nama: z.string().max(255),
    nisn: z.string().regex(NUMBER_REGEX, 'nisn harus berupa angka'),
    nik: z.string()
        .regex(NUMBER_REGEX, 'nik harus berupa angka')
        .min(16)
        .max(20),
    jenis_kelamin: z.enum(['L', 'P']),
    asal_sekolah: z.optional(z.string().min(10).max(255)),
    kewarganegaraan: z.string().max(50),
    tempat_lahir: z.string().max(255),
    tanggal_lahir: z.string().regex(DATE_REGEX, 'format tanggal tidak sesuai'),
    agama: z.enum([
      'ISLAM',
      'KRISTEN',
      'KATOLIK',
      'HINDU',
      'BUDDHA',
      'KONGHUCU',
      'NONE',
    ]),
    alamat_jalan: z.string().max(255),
    rt: z.string().regex(NUMBER_REGEX, 'rt harus berupa angka').max(4),
    rw: z.string().regex(NUMBER_REGEX, 'rw harus berupa angka').max(4),
    kelurahan: z.string().max(100),
    kecamatan: z.string().max(100),
    provinsi: z.string().max(100),
    no_hp: z.string()
        .regex(PHONE_REGEX, 'nomor tidak valid')
        .max(20),
    no_wa: z.optional(
        z.string()
            .regex(PHONE_REGEX, 'nomor tidak valid')
            .max(20),
    ),
  });

  static readonly DELETE_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
  });
}
