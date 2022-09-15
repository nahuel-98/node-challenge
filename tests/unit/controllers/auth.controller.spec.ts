import { expect, use } from 'chai';
import { noCallThru } from 'proxyquire';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import AuthController from '../../../src/controllers/auth.controller';
import HttpStatus from '../../../src/models/enums/http-status.enum';

const proxyquire = noCallThru();

use(sinonChai);

describe('auth controller tests', () => {
  const mockToken = { id: 1, email: 'user@domain.com' };

  const req = mockReq({ user: mockToken, app: { emit: stub() } }),
    res = mockRes(),
    next = stub();

  const mockSign = stub();
  const AuthControllerStubbed = proxyquire(
    '../../../src/controllers/auth.controller',
    {
      jsonwebtoken: { sign: mockSign },
    },
  ).default;

  let controller: AuthController;

  beforeEach(() => {
    controller = new AuthControllerStubbed();
  });

  afterEach(() => {
    res.status.resetHistory();
    res.json.resetHistory();
    next.resetHistory();
  });

  describe('register', () => {
    it('should emit an event an return correct response', async () => {
      await controller.register(req, res);

      expect(req.app.emit).to.have.been.calledOnceWithExactly(
        'event:userCreated',
        mockToken.email,
      );
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.CREATED);
      expect(res.json).to.have.been.calledOnceWithExactly({ user: mockToken });
    });
  });

  describe('login', () => {
    afterEach(() => {
      mockSign.reset();
    });

    it('should return the signed token', () => {
      mockSign.returns('test');

      controller.login(req, res);

      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.OK);
      expect(res.json).to.have.been.calledOnceWithExactly({ token: 'test' });
    });
  });
});
