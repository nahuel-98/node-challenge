import { expect } from 'chai';
import { noCallThru } from 'proxyquire';
import { createStubInstance } from 'sinon';
import DbConnection from '../../../src/database/connection';

const proxyquire = noCallThru();

describe('UmzugFactory tests', () => {
  const Umzug = function () {
    return undefined;
  };

  const UmzugFactory = proxyquire('../../../src/database/umzug', {
    umzug: {
      Umzug,
      SequelizeStorage: function () {
        return undefined;
      },
    },
  }).default;

  it('should return the database instance', () => {
    const umzug = new UmzugFactory(createStubInstance(DbConnection)).create('');

    expect(umzug).to.be.instanceOf(Umzug);
  });
});
