import { expect } from 'chai';
import { noCallThru } from 'proxyquire';
import { createStubInstance, stub } from 'sinon';
import User from '../../../src/models/user.model';

const proxyquire = noCallThru();

describe('user model tests', () => {
  const compareStub = stub();

  const UserModel: typeof User = proxyquire('../../../src/models/user.model', {
    bcrypt: {
      hash: stub().resolves('hashedPassword'),
      compare: compareStub,
    },
  }).default;

  describe('hashPassword', () => {
    it('should alter the password', async () => {
      const instance = createStubInstance(UserModel);

      await UserModel.hashPassword(instance);

      expect(instance.password).to.equal('hashedPassword');
    });
  });

  describe('checkUser', () => {
    const userFindOneStub = stub(UserModel, 'findOne');

    afterEach(() => {
      userFindOneStub.reset();
    });

    describe('User found', () => {
      const instance = createStubInstance(UserModel);

      beforeEach(() => {
        userFindOneStub.resolves(instance);
      });

      afterEach(() => {
        compareStub.reset();
      });

      it('passwords match - should return user', async () => {
        compareStub.resolves(true);

        expect(await UserModel.checkUser('abc@def.com', '1234')).to.equal(
          instance,
        );
      });

      it('passwords do not match - should return null', async () => {
        compareStub.resolves(false);

        expect(await UserModel.checkUser('abc@def.com', '1234')).to.be.null;
      });
    });

    it('user not found', () => {
      beforeEach(() => {
        userFindOneStub.resolves(null);
      });

      it('should return null', async () => {
        expect(await UserModel.checkUser('abc@def.com', '1234')).to.be.null;
      });
    });
  });
});
