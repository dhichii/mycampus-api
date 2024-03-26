import {ZodType, z} from 'zod';

export class AdminValidation {
  static readonly ADD: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    nama: z.string().max(120),
    jenis_kelamin: z.enum(['L', 'P']),
  });

  static readonly GET_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
  });

  static readonly EDIT_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
    nama: z.string().max(120),
    jenis_kelamin: z.enum(['L', 'P']),
  });

  static readonly DELETE_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
  });
}
