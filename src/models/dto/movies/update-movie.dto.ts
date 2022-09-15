/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateMovieDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: Movie title.
 *           example: The Lion King
 *         imageUrl:
 *           type: string
 *           format: url
 *           maxLength: 2048
 *           description: Movie poster URL.
 *           example: 'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg'
 *         genreId:
 *           type: integer
 *           description: Movie genre ID.
 *           writeOnly: true
 *           example: 10
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Movie rating. Max 1 decimal place.
 *           example: 4.3
 */

import { Expose } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import Trim from '../../../decorators/trim.decorator';

export default class CreateMovieDto {
  /**
   * Title of the movie.
   *
   * @example 'The Lion King'
   */
  @Expose()
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(100)
  title?: string;

  /**
   * URL of the movie's poster.
   *
   * @example 'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg'
   */
  @Expose()
  @MaxLength(2048)
  @IsUrl()
  @Trim()
  @IsString()
  @IsOptional()
  imageUrl?: string;

  /**
   * Id of the movie's genre.
   *
   * @example 1
   */
  @Expose()
  @IsOptional()
  @IsInt()
  genreId?: number;

  /**
   * Numeric rating of the movie.
   *
   * Varies from 1 to 5 (both inclusive).
   * Maximum 1 decimal place.
   *
   * @example 4.7
   */
  @Expose()
  @IsOptional()
  @Min(1)
  @Max(5)
  @IsNumber(
    { maxDecimalPlaces: 1, allowInfinity: false, allowNaN: false },
    { message: '$property must be a number with no more than 1 decimal.' },
  )
  rating?: number;
}
