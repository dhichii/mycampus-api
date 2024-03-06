import {ZodType, z} from 'zod';

export class UniversitasValidation {
  static readonly ADD: ZodType = z.object({
    nama: z.string().min(20).max(120),
    alamat: z.string().min(20).max(255),
    keterangan: z.string(),
    logo_url: z.string().min(1).max(255),
  });

  static readonly GET_BY_ID: ZodType = z.object({
    id: z.number().min(1)},
  );

  static readonly EDIT_BY_ID: ZodType = z.object({
    id: z.number().min(1),
    nama: z.string().min(20).max(120),
    alamat: z.string().min(20).max(255),
    keterangan: z.string(),
  });

  static readonly DELETE_BY_ID: ZodType = z.object({
    id: z.number().min(1),
    path: z.string(),
  });

  static readonly EDIT_LOGO_BY_ID: ZodType = z.object({
    id: z.number().min(1),
    logo_url: z.string().min(1).max(255),
    path: z.string().min(1).max(255),
  });
}
