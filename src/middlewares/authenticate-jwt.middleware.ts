/**
 * @swagger
 * components:
 *   responses:
 *     Unauthorized:
 *       description: A valid bearer token was not provided in the request headers.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HttpError'
 *           example:
 *             statusCode: 401
 *             name: Unauthorized
 *             message: Invalid authentication token.
 */

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import '../auth/jwt.strategy';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';
import User from '../models/user.model';

/**
 * passport-jwt strategy with custom responses.
 */
function authenticateJwt(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  return passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err) {
      return next(err);
    }

    if (!(user && (await User.findByPk(user.id, { attributes: ['id'] })))) {
      return next(
        new HttpError(HttpStatus.UNAUTHORIZED, 'Invalid authentication token'),
      );
    }

    req.user = user;

    return next();
  })(req, res, next);
}

export default authenticateJwt;
