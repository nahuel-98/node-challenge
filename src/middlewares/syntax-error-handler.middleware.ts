import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';

/**
 * Sends an `HttpError` with a 400 status code to the next error handler when the request body receives malformed JSON.
 */
export default function syntaxErrorHandler(
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (err instanceof SyntaxError) {
    return next(new HttpError(HttpStatus.BAD_REQUEST, err.message));
  }

  return next(err);
}
