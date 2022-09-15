/**
 * @swagger
 * paths:
 *   /auth/register:
 *     post:
 *       tags:
 *         - auth
 *       summary: Creates a new account
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterDto'
 *       responses:
 *         201:
 *           $ref: '#/components/responses/UserRegistered'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         409:
 *           $ref: '#/components/responses/UserAlreadyExists'
 *
 *   /auth/login:
 *     post:
 *       tags:
 *         - auth
 *       summary: Logs in to an already created account
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginDto'
 *       responses:
 *         200:
 *           $ref: '#/components/responses/UserLoggedIn'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/InvalidLoginCredentials'
 *
 * components:
 *   responses:
 *     InvalidLoginCredentials:
 *       description: Invalid login credentials.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HttpError'
 *           example:
 *             statusCode: 401
 *             name: Unauthorized
 *             message: Invalid email or password.
 */

import passport from 'passport';
import { Service } from 'typedi';
import '../auth/local.strategy';
import AuthController from '../controllers/auth.controller';
import LoginDto from '../models/dto/auth/login.dto';
import RegisterDto from '../models/dto/auth/register.dto';
import validateRequest from '../middlewares/validate-request.middleware';
import CommonRoutes from './common.routes';

@Service({ id: 'routes', multiple: true })
export default class AuthRoutes extends CommonRoutes {
  constructor(private readonly controller: AuthController) {
    super('/auth');
    this.setUpRoutes();
  }

  protected setUpRoutes() {
    this.router.post(
      '/register',
      validateRequest(RegisterDto),
      passport.authenticate('register', { session: false }),
      this.controller.register,
    );
    this.router.post(
      '/login',
      validateRequest(LoginDto),
      passport.authenticate('login', { session: false }),
      this.controller.login,
    );
  }
}
