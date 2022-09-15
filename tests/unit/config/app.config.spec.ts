import { expect } from 'chai';
import mockedEnv, { RestoreFn } from 'mocked-env';
import { noPreserveCache } from 'proxyquire';

const proxyquire = noPreserveCache();

describe('app config tests', () => {
  let restore: RestoreFn;

  afterEach(() => {
    restore();
  });

  it('should use default config', () => {
    restore = mockedEnv({ clear: true });

    const { default: appConfig } = proxyquire(
      '../../../src/config/app.config',
      {},
    );

    expect(appConfig).to.deep.equal({
      ENVIRONMENT: 'production',
      PORT: 3000,
      JWT_SECRET_KEY: 'default',
      SENDGRID_API_KEY: '',
      SENDGRID_EMAIL: '',
    });
  });

  it('should use provided env variables', () => {
    restore = mockedEnv({
      NODE_ENV: 'debug',
      PORT: '5500',
      JWT_SECRET_KEY: 'abcdef',
      SENDGRID_API_KEY: 'SG.abcdef',
      SENDGRID_EMAIL: 'abc@def.com',
    });

    const { default: appConfig } = proxyquire(
      '../../../src/config/app.config',
      {},
    );

    expect(appConfig).to.deep.equal({
      ENVIRONMENT: 'debug',
      PORT: 5500,
      JWT_SECRET_KEY: 'abcdef',
      SENDGRID_API_KEY: 'SG.abcdef',
      SENDGRID_EMAIL: 'abc@def.com',
    });
  });
});
