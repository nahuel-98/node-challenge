import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { Logger } from 'winston';

describe('logger tests', () => {
  it('should be called with non debug info', () => {
    const logger: Logger = proxyquire('../../../src/logger', {
      '../config/app.config': {
        default: {
          ENVIRONMENT: 'development',
        },
      },
    }).default;

    expect(logger.level).to.equal('info');
  });

  it('should be called with debug info', () => {
    const logger: Logger = proxyquire('../../../src/logger', {
      '../config/app.config': {
        default: {
          ENVIRONMENT: 'debug',
        },
      },
    }).default;

    expect(logger.level).to.equal('debug');
  });
});
