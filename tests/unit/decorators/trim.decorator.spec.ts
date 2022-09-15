import { expect } from 'chai';
import { plainToInstance } from 'class-transformer';
import Trim from '../../../src/decorators/trim.decorator';
expect;

describe('@Trim tests', () => {
  class ExampleClass {
    @Trim()
    foo!: string | number;

    @Trim()
    bar!: string | number;
  }

  it('should trim the props', () => {
    const plain = { foo: ' test  ', bar: 100 };

    expect({ ...plainToInstance(ExampleClass, plain) }).to.deep.equal({
      foo: 'test',
      bar: 100,
    });
  });
});
