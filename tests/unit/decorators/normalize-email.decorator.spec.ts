import { expect } from 'chai';
import { instanceToPlain } from 'class-transformer';
import NormalizeEmail from '../../../src/decorators/normalize-email.decorator';

describe('@NormalizeEmail tests', () => {
  class ExampleClass {
    @NormalizeEmail()
    email?: string;
  }

  it('should normalize email', () => {
    const instance = new ExampleClass();
    instance.email = 'SOME.name+me@GMAIL.com';

    expect(instanceToPlain(instance)).to.deep.equal({
      email: 'somename@gmail.com',
    });
  });

  it('should skip undefined props', () => {
    const instance = new ExampleClass();
    instance.email = undefined;

    expect(instanceToPlain(instance)).to.deep.equal({ email: undefined });
  });
});
