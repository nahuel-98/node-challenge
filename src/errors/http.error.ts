/**
 * @swagger
 * components:
 *   schemas:
 *     HttpError:
 *       type: object
 *       required:
 *         - statusCode
 *         - name
 *       properties:
 *         statusCode:
 *           type: integer
 *           default: 500
 *           description: Error status code
 *         name:
 *           type: string
 *           default: Internal Server Error
 *           description: Short generic description of the error
 *         message:
 *           oneOf:
 *             - type: string
 *             - type: object
 *           default: Unknown error. Contact the system administrators.
 *           description: More detailed description of the error
 */

import { STATUS_CODES } from 'http';
import HttpStatus from '../models/enums/http-status.enum';

/**
 * Pattern for error JSON responses.
 */
type JsonResponse = {
  statusCode: number;
  name: string;
  message?: string | Record<string, unknown>;
};

/**
 * Standarized responses to HTTP errors.
 *
 * Based on Nest.js `HttpException` class.
 * @see [Original source code](https://github.com/nestjs/nest/blob/master/packages/common/exceptions/http.exception.ts)
 */
export default class HttpError extends Error {
  /**
   * Instantiate a new HTTP Exception.
   *
   * @example
   * `throw new HttpError()`
   *
   * @usageNotes
   * The constructor arguments define the response and the HTTP response status code.
   * - The `status` argument defines the HTTP Status Code.
   * - The `response` argument defines the JSON response body.
   *
   * By default, the JSON response body contains two properties:
   * - `statusCode`: the Http Status Code.
   * - `name`: short description of the HTTP error. For example, if the status code is 500,
   * the name would be 'Internal Server Error'.
   *
   * You can add a more detailed description by suppling it to the second constructor parameter.
   * It will appear in the JSON response body as the `message` property.
   *
   * @param [status=500] HTTP response status code.
   * @param response string or object describing the error condition.
   */
  constructor(
    private readonly status = HttpStatus.INTERNAL_SERVER_ERROR,
    private readonly response?: string | Record<string, unknown>,
  ) {
    super();
    this.message = `HTTP Error ${this.status}`;
    this.name = this.constructor.name;
  }

  /**
   * Gets the formatted JSON response.
   */
  public getResponse(): JsonResponse {
    const res: JsonResponse = {
      statusCode: this.status,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      name: STATUS_CODES[this.status]!,
    };

    if (this.response) {
      res.message = this.response;
    }

    return res;
  }

  /**
   * Gets the status code.
   */
  public getStatus(): number {
    return this.status;
  }
}
