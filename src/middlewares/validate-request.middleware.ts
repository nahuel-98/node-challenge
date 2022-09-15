/**
 * @swagger
 * components:
 *   responses:
 *     ValidationError:
 *       description: Validation error.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HttpError'
 *           example:
 *             statusCode: 400
 *             name: Bad Request
 *             errors:
 *               - example validation error
 */
import { ValidationError } from 'class-validator';
import { transformAndValidate, ClassType } from 'class-transformer-validator';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';

function isValidationErrorArray(obj: unknown): obj is ValidationError[] {
  return (
    Array.isArray(obj) && obj.every((item) => item instanceof ValidationError)
  );
}

type RequestField = 'body' | 'params' | 'query';

/**
 * Middleware for validating the request.
 * @param c Class to validate the field against.
 * @param field Request field to validate. Default 'body'
 * @param whitelist if set to true (default), the validator will strip the properties
 * not defined in the validator class from the request field.
 *
 * If the validation was successful, the field will be set to an instance of the validator class.
 * Else it will pass thw validation error to the error handler.
 */
export default function validateRequest(
  c: ClassType<object>,
  field: RequestField = 'body',
) {
  return async function performValidation(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    try {
      const validated = await transformAndValidate(c, req[field], {
        transformer: {
          exposeUnsetFields: false,
          excludeExtraneousValues: true,
        },
        validator: {
          validationError: {
            target: false,
            value: false,
          },
        },
      });

      req[field] = validated;

      return next();
    } catch (err) {
      if (isValidationErrorArray(err)) {
        const httpError = new HttpError(HttpStatus.BAD_REQUEST, {
          description: 'Validation error.',
          errors: err.flatMap((validationError) =>
            Object.values(validationError.constraints ?? {}),
          ),
        });

        return next(httpError);
      }

      return next(err);
    }
  };
}
