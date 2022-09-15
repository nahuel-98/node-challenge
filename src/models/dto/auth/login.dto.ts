/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email.
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           writeOnly: true
 *           description: User password.
 *           example: ABCdef123!
 *       required:
 *         - email
 *         - password
 */

import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import NormalizeEmail from '../../../decorators/normalize-email.decorator';
import Trim from '../../../decorators/trim.decorator';

/**
 * Validates login request body.
 */
export default class LoginDto {
  /**
   * User email.
   */
  @Expose()
  @NormalizeEmail()
  @IsEmail()
  @Trim()
  email!: string;

  /**
   * User password.
   */
  @Expose()
  @IsString()
  password!: string;
}
