import { expect, use } from 'chai';
import { stub, match } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { Expose } from 'class-transformer';
import { IsString, ValidationError } from 'class-validator';
import proxyquire from 'proxyquire';
import validateRequest from '../../../src/middlewares/validate-request.middleware';
import HttpError from '../../../src/errors/http.error';
import HttpStatus from '../../../src/models/enums/http-status.enum';

use(sinonChai);

describe('validate request middleware tests', () => {
  class ExampleClass {
    @Expose()
    @IsString()
    foo!: string;
  }

  const res = mockRes(),
    next = stub();

  afterEach(() => {
    next.resetHistory();
  });

  describe('validator not mocked', () => {
    it('should pass validation', async () => {
      const req = mockReq({ body: { foo: 'string' } });

      await validateRequest(ExampleClass)(req, res, next);

      expect(req.body).to.be.instanceof(ExampleClass);
      expect(next).to.have.been.calledOnceWithExactly();
    });

    it('should not pass validation', async () => {
      const req = mockReq({ body: { foo: 1234 } });

      await validateRequest(ExampleClass)(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.BAD_REQUEST))
          .and(
            match.has(
              'response',
              match.has(
                'errors',
                match.array.deepEquals(['foo must be a string']),
              ),
            ),
          ),
      );
    });
  });

  describe('validator mocked', () => {
    const validatorStub = stub(),
      validateRequest = proxyquire(
        '../../../src/middlewares/validate-request.middleware',
        {
          'class-transformer-validator': {
            transformAndValidate: validatorStub,
          },
        },
      ).default;

    const req = mockReq();

    afterEach(() => {
      validatorStub.reset();
    });

    it('should return empty error list on empty validation error', async () => {
      validatorStub.rejects([new ValidationError()]);

      await validateRequest(ExampleClass)(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.BAD_REQUEST))
          .and(
            match.has(
              'response',
              match.has('errors', match.array.deepEquals([])),
            ),
          ),
      );
    });

    it('should return next on error', async () => {
      const err = new Error();

      validatorStub.rejects(err);

      await validateRequest(ExampleClass)(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });
});
