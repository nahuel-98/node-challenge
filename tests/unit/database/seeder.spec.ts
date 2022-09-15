import { expect } from 'chai';
import { createStubInstance } from 'sinon';
import { Umzug } from 'umzug';
import Seeder from '../../../src/database/seeder';
import UmzugFactory from '../../../src/database/umzug';

describe('Seeder test', () => {
  it('should run seeds', async () => {
    const umzugStub = createStubInstance(Umzug, { up: Promise.resolve([]) }),
      umzugFactoryStub = createStubInstance(UmzugFactory, {
        create: umzugStub,
      }),
      seeder = new Seeder(umzugFactoryStub);

    expect(await seeder.initialize()).to.deep.equal([]);
  });
});
