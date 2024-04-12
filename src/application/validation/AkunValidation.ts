import {Role} from '../../util/enum';
import {ZodType, z} from 'zod';

export class AkunValidation {
  static readonly LOGIN: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  static readonly ADD: ZodType = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum([Role.ADMIN, Role.OPERATOR, Role.PENDAFTAR, Role.SEKOLAH]),
  });

  static readonly CHANGE_EMAIL: ZodType = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
  });

  static readonly CHANGE_PASSWORD: ZodType = z.object({
    id: z.string().uuid(),
    password: z.string().min(8),
  });

  static readonly DELETE: ZodType = z.object({
    id: z.string().uuid(),
  });
}
