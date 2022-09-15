import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';

/**
 * Transforms unhandled errors to HTTP 500 errors so they can be returned as JSON
 * by the next middleware.
 */
export default function fallbackErrorTransformer(
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  // the error has been already transformed
  if (err instanceof HttpError) {
    return next(err);
  }

  return next(
    new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Unknown error. Contact the system administrators.',
    ),
  );
}
