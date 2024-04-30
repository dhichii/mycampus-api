import {ZodType, z} from 'zod';

export class Prodivalidation {
  static readonly ADD: ZodType = z.object({
    nama: z.string().max(255),
    id_universitas: z.number(),
    kode_prodi: z.number(),
    jenjang: z.enum(['D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3']),
    status: z.enum(['Aktif', 'Tutup']),
    akreditasi: z.string(),
    biaya_pendaftaran: z.number(),
    ukt: z.number(),
    keterangan: z.string(),
    potensi_karir: z.array(
        z.object({
          nama: z.string().max(255),
        }),
    ),
  });

  static readonly GET_ALL: ZodType = z.object({
    search: z.string().toUpperCase().optional(),
    limit: z.number(),
    page: z.number(),
    universitas: z.number().optional(),
    jenis_universitas: z.string().optional(),
    status: z.string().optional(),
    min_ukt: z.number().optional(),
    max_ukt: z.number().optional(),
  });

  static readonly GET_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
  });

  static readonly EDIT_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
    nama: z.string().max(255),
    id_universitas: z.number(),
    kode_prodi: z.number(),
    jenjang: z.enum(['D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3']),
    status: z.enum(['Aktif', 'Tutup']),
    akreditasi: z.string(),
    biaya_pendaftaran: z.number(),
    ukt: z.number(),
    keterangan: z.string(),
  });

  static readonly EDIT_PRODI_POTENSI_KARIR: ZodType = z.object({
    id: z.string().uuid(),
    potensi_karir: z.array(
        z.object({
          nama: z.string().max(255),
        }),
    ),
  });

  static readonly DELETE_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
  });
}
