/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - $ref: '#/components/schemas/LoginDto'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               readOnly: true
 *               description: User unique ID.
 *               example: 1
 */

import { compare, hash } from 'bcrypt';
import { col, fn } from 'sequelize';
import {
  BeforeCreate,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: false,
  indexes: [
    {
      name: 'email_idx',
      unique: true,
      fields: [fn('lower', col('email'))],
    },
  ],
})
export default class User extends Model {
  @Column({
    type: DataType.STRING(320),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @BeforeCreate
  static async hashPassword(instance: User) {
    instance.password = await hash(instance.password, 10);
  }

  /**
   * Checks if a combination of user and password exists.
   *
   * @returns The found `User` or `null` if the login credentials are invalid.
   */
  static async checkUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (user && !(await compare(password, user.password))) {
      return null;
    }

    return user;
  }
}
