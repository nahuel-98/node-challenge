/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           description: Movie unique ID.
 *           example: 1
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: Movie title.
 *           example: 'The Lion King'
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           format: url
 *           maxLength: 2048
 *           description: Movie poster URL.
 *           example: 'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Movie creation date.
 *           example: '2022-04-23T02:17:57.207Z'
 *       required:
 *         - title
 *
 *     MovieDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Movie'
 *         - type: object
 *           required:
 *             - genre
 *           properties:
 *             genre:
 *               $ref: '#/components/schemas/Genre'
 *             rating:
 *               type: number
 *               nullable: true
 *               minimum: 1
 *               maximum: 5
 *               description: Movie rating. Max 1 decimal place.
 *               example: 4.3
 */

import { Expose, Exclude, Transform, Type } from 'class-transformer';
import { col, fn } from 'sequelize';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  AllowNull,
  Table,
} from 'sequelize-typescript';
import HideNull from '../decorators/hide-null.decorator';
import Character from './character.model';
import Genre from './genre.model';
import MovieCharacter from './movie-character.model';

/**
 * Represents a movie or series.
 */
@Table({
  tableName: 'movies',
  updatedAt: false,
  indexes: [
    {
      name: 'title_idx',
      fields: [fn('to_tsvector', 'english', col('title'))],
      using: 'gin',
    },
  ],
})
export default class Movie extends Model {
  /**
   * Movie's unique id.
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
   * Title of the movie.
   *
   * @example 'The Lion King'
   */
  @Expose()
  @AllowNull(false)
  @Column(DataType.STRING(100))
  title!: string;

  /**
   * URL of the movie's poster.
   *
   * @example 'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg'
   */
  @Expose()
  @HideNull()
  @Column(DataType.STRING(2048))
  imageUrl!: string | null;

  /**
   * Id of the movie's genre.
   *
   * @example 1
   */
  @Exclude({ toPlainOnly: true })
  @ForeignKey(() => Genre)
  @AllowNull(false)
  @Column
  genreId!: number;

  /**
   * Genre of the movie.
   */
  @Expose()
  @BelongsTo(() => Genre)
  genre!: Genre;

  /**
   * Numeric rating of the movie.
   *
   * Varies from 1 to 5 (both inclusive).
   * Maximum 1 decimal place.
   *
   * @example 4.7
   */
  @Expose()
  @Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
  @HideNull()
  @Column(DataType.DECIMAL(2, 1))
  rating!: number | null;

  /**
   * Date when the movie was added to the database.
   *
   * @example '2022-04-23T02:17:57.207Z'
   */
  @Expose()
  @CreatedAt
  createdAt!: Date;

  /**
   * List of characters of the movie.
   */
  @Expose()
  @Type(() => Character)
  @BelongsToMany(() => Character, () => MovieCharacter)
  characters!: Character[];
}
