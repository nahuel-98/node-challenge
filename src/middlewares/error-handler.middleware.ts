import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/http.error';

/**
 * Returns the respose provided by an HttpError as JSON.
 */
export default function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  return res.status(err.getStatus()).json(err.getResponse());
}
