import {ZodType, z} from 'zod';

export class PotensiKarirValidation {
  static readonly ADD: ZodType = z.object({
    nama: z.string().max(255),
  });

  static readonly EDIT_BY_ID: ZodType = z.object({
    id: z.number(),
    nama: z.string().max(255),
  });

  static readonly DELETE_BY_ID: ZodType = z.object({
    id: z.number(),
  });
}
