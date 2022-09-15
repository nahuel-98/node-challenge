/**
 * @swagger
 * components:
 *   responses:
 *     UserRegistered:
 *       description: The account was registered successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 $ref: '#/components/schemas/User'
 *
 *     UserLoggedIn:
 *       description: User logged in successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The generated JWT for the user.
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.gzAorqvnGloYu17fanX-yhDQlpQK18C5M64gkcmhrqQ
 *
 *     UserAlreadyExists:
 *       description: An user with the provided email already exists.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             statusCode: 409
 *             name: Conflict
 *             message: Email is already in use.
 */

import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import appConfig from '../config/app.config';
import HttpStatus from '../models/enums/http-status.enum';
import User from '../models/user.model';

/**
 * Controller for auth routes.
 */
@Service()
export default class AuthController {
  /**
   * Creates new account.
   */
  async register(req: Request, res: Response): Promise<Response> {
    req.app.emit('event:userCreated', (req.user as User).email);

    return res.status(HttpStatus.CREATED).json({ user: req.user });
  }

  /**
   * Logs in to a created account.
   */
  login(req: Request, res: Response): Response {
    const token = sign({ user: req.user }, appConfig.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    return res.status(HttpStatus.OK).json({ token });
  }
}
