/**
 * @swagger
 * components:
 *   schemas:
 *     Character:
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *           description: Character unique ID.
 *           example: 1
 *         name:
 *           type: string
 *           maxLength: 30
 *           description: Character name.
 *           example: Simba
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           format: url
 *           maxLength: 2048
 *           description: Character image url.
 *           example: 'https://upload.wikimedia.org/wikipedia/en/9/94/Simba_%28_Disney_character_-_adult%29.png'
 *       required:
 *         - name
 *
 *     CharacterDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Character'
 *         - $ref: '#/components/schemas/CreateCharacterDto'
 *         - type: object
 *           properties:
 *             imageUrl:
 *               nullable: true
 *             age:
 *               nullable: true
 *             weight:
 *               nullable: true
 *             history:
 *               nullable: true
 *             movies:
 *               type: array
 *               readOnly: true
 *               description: List of movies or series where the character was part of.
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */

import { Expose, Type } from 'class-transformer';
import { col, fn } from 'sequelize';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  AllowNull,
  Table,
} from 'sequelize-typescript';
import HideNull from '../decorators/hide-null.decorator';
import MovieCharacter from './movie-character.model';
import Movie from './movie.model';

/**
 * Represents a character who appears in a movie or series.
 */
@Table({
  tableName: 'characters',
  timestamps: false,
  indexes: [
    {
      name: 'name_idx',
      fields: [fn('to_tsvector', 'english', col('name'))],
      using: 'gin',
    },
  ],
})
export default class Character extends Model {
  /**
   * Character's unique id.
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
   * Character's name.
   *
   * @example 'Simba'
   */
  @Expose()
  @AllowNull(false)
  @Column(DataType.STRING(30))
  name!: string;

  /**
   * Url of the character's picture.
   *
   * @example 'https://upload.wikimedia.org/wikipedia/en/9/94/Simba_%28_Disney_character_-_adult%29.png'
   */
  @Expose()
  @HideNull()
  @Column(DataType.STRING(2048))
  imageUrl!: string | null;

  /**
   * Character's age, in years.
   */
  @Expose()
  @HideNull()
  @Column(DataType.INTEGER)
  age!: number | null;

  /**
   * Character's weight, in kilograms.
   */
  @Expose()
  @HideNull()
  @Column(DataType.INTEGER)
  weight!: number | null;

  /**
   * Character's backstory and/or a summary of the character's involvement in the
   * productions they took part of.
   */
  @Expose()
  @HideNull()
  @Column(DataType.STRING(1000))
  history!: string | null;

  /**
   * List of movies that the character participated on.
   */
  @Expose()
  @Type(() => Movie)
  @BelongsToMany(() => Movie, () => MovieCharacter)
  movies!: Movie[];
}
