import { expect } from 'chai';
import mockedEnv, { RestoreFn } from 'mocked-env';
import { noPreserveCache } from 'proxyquire';

const proxyquire = noPreserveCache().noCallThru();

describe('db config tests', () => {
  let restore: RestoreFn;

  afterEach(() => {
    restore();
  });

  it('should use default config', () => {
    restore = mockedEnv({ clear: true });

    const dbConfig = proxyquire('../../../src/config/db.config', {}).default;

    expect(dbConfig).to.have.property('host', 'postgres');
    expect(dbConfig).to.have.property('port', 5432);
    expect(dbConfig).to.have.property('database', 'movies-api');
    expect(dbConfig).to.have.property('username', 'postgres');
    expect(dbConfig).to.have.property('password', 'admin');
  });

  it('should use provided env variables', () => {
    restore = mockedEnv({
      DB_HOST: 'localhost',
      DB_PORT: '5433',
      DB_NAME: 'abcdef',
      DB_USER: 'user',
      DB_PASS: 'password',
    });

    const dbConfig = proxyquire('../../../src/config/db.config', {}).default;

    expect(dbConfig).to.have.property('host', 'localhost');
    expect(dbConfig).to.have.property('port', 5433);
    expect(dbConfig).to.have.property('database', 'abcdef');
    expect(dbConfig).to.have.property('username', 'user');
    expect(dbConfig).to.have.property('password', 'password');
  });
});
