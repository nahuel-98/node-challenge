import { expect } from 'chai';
import HttpError from '../../../src/errors/http.error';
import HttpStatus from '../../../src/models/enums/http-status.enum';

describe('HTTP Error', () => {
  it('No arguments', () => {
    const error = new HttpError();

    expect({ ...error }).to.deep.equal({
      name: 'HttpError',
      message: `HTTP Error ${HttpStatus.INTERNAL_SERVER_ERROR}`,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      response: undefined,
    });

    expect(error.getResponse()).to.deep.equal({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      name: 'Internal Server Error',
    });

    expect(error.getStatus()).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('Only status', () => {
    const error = new HttpError(HttpStatus.NOT_FOUND);

    expect({ ...error }).to.deep.equal({
      name: 'HttpError',
      message: `HTTP Error ${HttpStatus.NOT_FOUND}`,
      status: HttpStatus.NOT_FOUND,
      response: undefined,
    });

    expect(error.getResponse()).to.deep.equal({
      statusCode: HttpStatus.NOT_FOUND,
      name: 'Not Found',
    });

    expect(error.getStatus()).to.equal(HttpStatus.NOT_FOUND);
  });

  it('Status and response', () => {
    const error = new HttpError(HttpStatus.NOT_FOUND, 'Entity not found.');

    expect({ ...error }).to.deep.equal({
      name: 'HttpError',
      message: `HTTP Error ${HttpStatus.NOT_FOUND}`,
      status: HttpStatus.NOT_FOUND,
      response: 'Entity not found.',
    });

    expect(error.getResponse()).to.deep.equal({
      statusCode: HttpStatus.NOT_FOUND,
      name: 'Not Found',
      message: 'Entity not found.',
    });

    expect(error.getStatus()).to.equal(HttpStatus.NOT_FOUND);
  });
});
