import { logger as createLogger } from 'express-winston';
import logger from '../logger';

/**
 * Middleware for logging HTTP requests.
 */
const requestLogger = createLogger({
  winstonInstance: logger,
  level: 'debug',
  msg: '{{res.statusCode}} {{req.method}} {{req.url}} - {{res.responseTime}}ms',
  colorize: true,
});

export default requestLogger;
