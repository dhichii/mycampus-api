import {NextFunction, Request, Response} from 'express';
import {ResponseError} from '../../../common/error/response-error';
import {ZodError} from 'zod';

export const errorMiddleware = async (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction) => {
  if (error) {
    let status: number;
    if (error instanceof ResponseError) {
      status = error.status;
    } else if (error instanceof ZodError) {
      status = 400;
    } else {
      status = 500;
    }

    res.status(status).json({error: error.message});
  }
};
