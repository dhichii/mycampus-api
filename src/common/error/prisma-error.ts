import {Prisma} from '@prisma/client';
import {ResponseError} from './response-error';

export function isPrismaError(e: any) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      throw new ResponseError(400, `${e.meta?.target} must be unique`);
    }
  }
}
