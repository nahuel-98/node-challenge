import { createLogger, format, transports } from 'winston';
import appConfig from '../config/app.config';

/**
 * Winston logger.
 */
const logger = createLogger({
  level: appConfig.ENVIRONMENT === 'debug' ? 'debug' : 'info',
  transports: [
    new transports.Console({ silent: appConfig.ENVIRONMENT === 'test' }),
  ],
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.prettyPrint({ colorize: true }),
  ),
});

export default logger;
