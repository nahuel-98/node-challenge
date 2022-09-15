import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import HttpError from '../../../src/errors/http.error';
import logger from '../../../src/logger';
import errorLogger from '../../../src/middlewares/error-logger.middleware';

describe('error logger tests', () => {
  const loggerSpy = spy(logger, 'log');

  const req = mockReq(),
    res = mockRes(),
    next = stub();

  afterEach(() => {
    loggerSpy.resetHistory();
  });

  after(() => {
    loggerSpy.restore();
  });

  it('should not skip logging', () => {
    errorLogger(new Error(), req, res, next);

    expect(loggerSpy).to.have.been.calledOnce;
  });

  it('should skip logging', () => {
    errorLogger(new HttpError(), req, res, next);

    expect(loggerSpy).to.not.have.been.called;
  });
});
