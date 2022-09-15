import { expect } from 'chai';
import { plainToInstance } from 'class-transformer';
import NormalizeQueryParamString from '../../../src/decorators/normalize-query-param-string.decorator';

describe('@NormalizeQueryParamString tests', () => {
  class ExampleClass {
    @NormalizeQueryParamString()
    foo?: string;

    @NormalizeQueryParamString()
    bar?: string;

    @NormalizeQueryParamString()
    baz?: string;
  }

  it('should convert props to strings', () => {
    const plain = { foo: null, bar: false, baz: ['test'] };

    expect({ ...plainToInstance(ExampleClass, plain) }).to.deep.equal({
      foo: null,
      bar: 'false',
      baz: 'test',
    });
  });
});
