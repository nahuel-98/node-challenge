import { errorLogger as createErrorLogger } from 'express-winston';
import appConfig from '../config/app.config';
import HttpError from '../errors/http.error';
import logger from '../logger';

/**
 * Middleware for logging errors.
 */
const errorLogger = createErrorLogger({
  winstonInstance: logger,
  meta: appConfig.ENVIRONMENT !== 'production',
  skip: (_req, _res, err) => err instanceof HttpError, // skips handled exceptions
});

export default errorLogger;
