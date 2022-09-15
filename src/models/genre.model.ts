/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           description: Genre unique ID.
 *           example: 1
 *         name:
 *           type: string
 *           maxLength: 30
 *           description: Genre name
 *           example: Drama
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           format: url
 *           maxLength: 2048
 *           description: URL of an image representing the genre
 *           example: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Drama_Masks.svg'
 *       required:
 *         - name
 */

import { Expose, Type } from 'class-transformer';
import { col, fn } from 'sequelize';
import {
  Column,
  DataType,
  HasMany,
  Model,
  AllowNull,
  Table,
} from 'sequelize-typescript';
import HideNull from '../decorators/hide-null.decorator';
import Movie from './movie.model';

/**
 * Reprensents the genre of a movie or series.
 */
@Table({
  tableName: 'genres',
  timestamps: false,
  indexes: [
    {
      unique: true,
      name: 'unique_name',
      fields: [fn('lower', col('name'))],
    },
  ],
})
export default class Genre extends Model {
  /**
   * Genre's unique id.
   * @example 1
   */
  @Expose()
  @Column({
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
  })
  id!: number;

  /**
   * Name of the genre.
   *
   * @example 'Drama'
   */
  @Expose()
  @AllowNull(false)
  @Column(DataType.STRING(30))
  name!: string;

  /**
   * Url for the image of the genre.
   *
   * @example 'https://upload.wikimedia.org/wikipedia/commons/1/10/Drama_Masks.svg'
   */
  @Expose()
  @HideNull()
  @Column(DataType.STRING(2048))
  imageUrl!: string | null;

  /**
   * List of movies that belong to the genre.
   */
  @Expose()
  @Type(() => Movie)
  @HasMany(() => Movie)
  movies!: Movie[];
}
