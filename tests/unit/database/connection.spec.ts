import { expect } from 'chai';
import { noCallThru } from 'proxyquire';

const proxyquire = noCallThru();

describe('DbConnection tests', () => {
  const Sequelize = function () {
    return undefined;
  };

  const DbConnection = proxyquire('../../../src/database/connection', {
    'sequelize-typescript': {
      Sequelize,
    },
  }).default;

  it('should return the database instance', () => {
    expect(new DbConnection().getConnection()).to.be.instanceOf(Sequelize);
  });
});
