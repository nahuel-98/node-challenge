import { expect } from 'chai';
import { plainToInstance } from 'class-transformer';
import NumericFilter from '../../../src/models/types/numeric-filter.type';
import ToNumericFilter from '../../../src/decorators/to-numeric-filter.decorator';

describe('@ToNumericFilter tests', () => {
  class ExampleClass {
    @ToNumericFilter()
    foo?: NumericFilter | null;

    @ToNumericFilter()
    bar?: NumericFilter | null;
  }

  it('values are unset', () => {
    const plain = { foo: null, bar: undefined };

    expect({ ...plainToInstance(ExampleClass, plain) }).to.deep.equal({
      foo: null,
      bar: undefined,
    });
  });

  it('values are strings', () => {
    const plain = { foo: '1234', bar: '' };

    expect({ ...plainToInstance(ExampleClass, plain) }).to.deep.equal({
      foo: { eq: 1234 },
      bar: { eq: null },
    });
  });

  it('values are arrays', () => {
    const plain = { foo: ['1234'], bar: [''] };
    it;

    expect({ ...plainToInstance(ExampleClass, plain) }).to.deep.equal({
      foo: { eq: 1234 },
      bar: { eq: null },
    });
  });

  it('values are objects', () => {
    const plain = {
      foo: { gte: '4', lte: '45' },
      bar: { eq: ['123'], lte: false, gte: ['fff'] },
    };

    expect({ ...plainToInstance(ExampleClass, plain) }).to.deep.equal({
      foo: { gte: 4, lte: 45 },
      bar: { eq: 123, lte: null, gte: null },
    });
  });

  it('values are of the wrong type', () => {
    const plain = { foo: { invalidProp: '123' }, bar: true };

    expect({ ...plainToInstance(ExampleClass, plain) }).to.deep.equal({
      foo: {},
      bar: {},
    });
  });
});
