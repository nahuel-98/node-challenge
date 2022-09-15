import { expect, use } from 'chai';
import {
  createStubInstance,
  createSandbox,
  match,
  SinonSandbox,
  stub,
} from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import passport from 'passport';
import authenticateJwt from '../../../src/middlewares/authenticate-jwt.middleware';
import HttpError from '../../../src/errors/http.error';
import HttpStatus from '../../../src/models/enums/http-status.enum';
import User from '../../../src/models/user.model';

use(sinonChai);

describe('authenticateJwt tests', () => {
  const req = mockReq(),
    res = mockRes(),
    next = stub();

  let sandbox: SinonSandbox;

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    next.resetHistory();
  });

  describe('Valid token', () => {
    const mockToken = { id: 1, email: 'email@domain.com' };

    beforeEach(() => {
      sandbox
        .stub(passport, 'authenticate')
        .returns(() => ({}))
        .yields(null, mockToken, null);
    });

    it('should call next without arguments', async () => {
      const findUser = sandbox
        .stub(User, 'findByPk')
        .resolves(createStubInstance(User));

      await authenticateJwt(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly();

      expect(findUser).to.have.been.calledWith(mockToken.id);

      expect(req.user).to.equal(mockToken);
    });

    it('should call next with 401 error', async () => {
      sandbox.stub(User, 'findByPk').resolves(null);

      await authenticateJwt(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.UNAUTHORIZED)),
      );
    });
  });

  describe('Invalid token', () => {
    beforeEach(() => {
      sandbox
        .stub(passport, 'authenticate')
        .returns(() => ({}))
        .yields(null, null, null);
    });

    it('should call next with 401 error', async () => {
      await authenticateJwt(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.UNAUTHORIZED)),
      );
    });
  });

  describe('Error', () => {
    const err = new Error();

    beforeEach(() => {
      sandbox
        .stub(passport, 'authenticate')
        .returns(() => ({}))
        .yields(err, null, null);
    });

    it('should call next with error', async () => {
      await authenticateJwt(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });
});
