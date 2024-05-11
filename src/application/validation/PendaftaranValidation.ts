import {StatusPendaftaran} from '@prisma/client';
import {ZodType, z} from 'zod';

export class PendaftaranValidation {
  static readonly ADD: ZodType = z.object({
    id_pendaftar: z.string().uuid(),
    id_prodi: z.string().uuid(),
    jalur_pendaftaran: z.string(),
  });

  static readonly GET_BY_ID : ZodType = z.object({
    id: z.string().uuid(),
    userData: z.object({
      id: z.string().uuid(),
      role: z.string(),
      id_universitas: z.number().optional(),
      id_sekolah: z.string().optional(),
    }),
  });

  static readonly EDIT_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    role: z.string(),
    jalur_pendaftaran: z.string(),
  });

  static readonly DELETE_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
  });

  static readonly EDIT_STATUS_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
    role: z.string(),
    id_universitas: z.number(),
    status: z.enum([
      StatusPendaftaran.Diproses,
      StatusPendaftaran.Ditolak,
      StatusPendaftaran.Lulus,
      StatusPendaftaran.Menunggu,
    ]),
  });

  static readonly PROCESS_ALL: ZodType = z.object({
    id_universitas: z.number(),
  });
}
