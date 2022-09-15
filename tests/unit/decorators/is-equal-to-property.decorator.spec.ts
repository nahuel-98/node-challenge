import { expect } from 'chai';
import { validateSync } from 'class-validator';
import IsEqualToProperty from '../../../src/decorators/is-equal-to-property.decorator';

describe('@IsEqualToProperty tests', () => {
  class ExampleClass {
    password: string;

    @IsEqualToProperty('password')
    passwordConfirmation: string;

    constructor(password: string, passwordConfirmation: string) {
      this.password = password;
      this.passwordConfirmation = passwordConfirmation;
    }
  }

  it('should validate is passwords are equal', () => {
    const instance = new ExampleClass('12345', '12345');

    expect(validateSync(instance).length).to.equal(0);
  });

  it('should not validate is passwords are different', () => {
    const instance = new ExampleClass('12345', '123456');

    expect(validateSync(instance).length).to.equal(1);
  });
});
