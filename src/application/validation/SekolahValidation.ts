import {ZodType, z} from 'zod';

export class SekolahValidation {
  static readonly ADD: ZodType = z.object({
    nama: z.string().min(10).max(255),
  });
  static readonly EDIT_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
    nama: z.string().min(10).max(255),
  });

  static readonly DELETE_BY_ID: ZodType = z.object({
    id: z.string().uuid(),
  });
}
