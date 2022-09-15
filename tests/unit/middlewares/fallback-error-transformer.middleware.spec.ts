import { expect, use } from 'chai';
import { stub, match } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import fallbackErrorTransformer from '../../../src/middlewares/fallback-error-transformer.middleware';
import HttpError from '../../../src/errors/http.error';
import HttpStatus from '../../../src/models/enums/http-status.enum';

use(sinonChai);

describe('fallback error transformer middleware tests', () => {
  const req = mockReq(),
    res = mockRes(),
    next = stub();

  afterEach(() => {
    next.resetHistory();
  });

  it('should call next with the error unchanged', async () => {
    const err = new HttpError(HttpStatus.NOT_FOUND, 'Entity not found.');

    await fallbackErrorTransformer(err, req, res, next);

    expect(next).to.have.been.calledOnceWithExactly(err);
  });

  it('should call next changing the error', async () => {
    const err = new Error();

    await fallbackErrorTransformer(err, req, res, next);

    expect(next).to.have.been.calledOnceWithExactly(
      match
        .instanceOf(HttpError)
        .and(match.has('status', HttpStatus.INTERNAL_SERVER_ERROR)),
    );
  });
});
