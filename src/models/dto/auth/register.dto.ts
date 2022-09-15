/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterDto:
 *       allOf:
 *         - $ref: '#/components/schemas/LoginDto'
 *         - type: object
 *           properties:
 *             passwordConfirmation:
 *               type: string
 *               format: password
 *               writeOnly: true
 *               description: Password confirmation. Must be equal to password.
 *               example: ABCdef123!
 *           required:
 *             - passwordConfirmation
 */

import { Expose } from 'class-transformer';
import { IsString, Matches, MinLength } from 'class-validator';
import IsEqualToProperty from '../../../decorators/is-equal-to-property.decorator';
import LoginDto from './login.dto';

/**
 * Validates register request body.
 */
export default class RegisterDto extends LoginDto {
  @Matches(/[A-Z]/, {
    message: '$property must include at least one uppercase letter.',
  })
  @Matches(/[a-z]/, {
    message: '$property must include at least one lowercase letter.',
  })
  @Matches(/\d/, { message: '$property must include at least one number.' })
  @Matches(/[ -/:-@[-`{-~]/, {
    message: '$property must include at least one special character.',
  })
  @MinLength(8)
  password!: string;

  /**
   * Password confirmation.
   */
  @Expose()
  @IsString()
  @IsEqualToProperty('password', { message: 'passwords do not match.' })
  passwordConfirmation!: string;
}
