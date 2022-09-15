import { expect } from 'chai';
import { instanceToPlain } from 'class-transformer';
import HideNull from '../../../src/decorators/hide-null.decorator';

describe('@HideNull tests', () => {
  class ExampleClass {
    @HideNull()
    public nullableProp: string | null;

    public nonNullableProp: string;

    public constructor(nullableProp: string | null, nonNullableProp: string) {
      this.nullableProp = nullableProp;
      this.nonNullableProp = nonNullableProp;
    }
  }

  it('should hide prop set to null', () => {
    const instance = new ExampleClass(null, 'test');

    expect(
      instanceToPlain(instance, { exposeUnsetFields: false }),
    ).to.deep.equal({ nonNullableProp: 'test' });
  });

  it('should not hide prop if it is not null', () => {
    const instance = new ExampleClass('not null', 'test');

    expect(
      instanceToPlain(instance, { exposeUnsetFields: false }),
    ).to.deep.equal({ nullableProp: 'not null', nonNullableProp: 'test' });
  });
});
