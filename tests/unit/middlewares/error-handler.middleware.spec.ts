import { expect, use } from 'chai';
import { stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import errorHandler from '../../../src/middlewares/error-handler.middleware';
import HttpError from '../../../src/errors/http.error';
import HttpStatus from '../../../src/models/enums/http-status.enum';

use(sinonChai);

describe('error handler middleware tests', () => {
  const req = mockReq(),
    res = mockRes(),
    next = stub();

  it('should return the correct response', async () => {
    const err = new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong :(',
    );

    await errorHandler(err, req, res, next);

    expect(res.status).to.have.been.calledOnceWithExactly(err.getStatus());
    expect(res.json).to.have.been.calledOnceWithExactly(err.getResponse());
  });
});
