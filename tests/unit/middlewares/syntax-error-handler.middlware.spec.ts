import { expect, use } from 'chai';
import { stub, match } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import syntaxErrorHandler from '../../../src/middlewares/syntax-error-handler.middleware';
import HttpError from '../../../src/errors/http.error';
import HttpStatus from '../../../src/models/enums/http-status.enum';

use(sinonChai);

describe('syntax error transformer middleware tests', () => {
  const req = mockReq(),
    res = mockRes(),
    next = stub();

  afterEach(() => {
    next.resetHistory();
  });

  it('should call next with the error unchanged', async () => {
    const err = new Error();

    await syntaxErrorHandler(err, req, res, next);

    expect(next).to.have.been.calledOnceWithExactly(err);
  });

  it('should call next changing the error', async () => {
    const err = new SyntaxError();

    await syntaxErrorHandler(err, req, res, next);

    expect(next).to.have.been.calledOnceWithExactly(
      match
        .instanceOf(HttpError)
        .and(match.has('status', HttpStatus.BAD_REQUEST)),
    );
  });
});
