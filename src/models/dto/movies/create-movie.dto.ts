/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMovieDto:
 *       allOf:
 *         - $ref: '#/components/schemas/UpdateMovieDto'
 *         - type: object
 *           required:
 *             - title
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
  @Trim()
  @IsString()
  @MaxLength(100)
  title!: string;

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
  @IsInt()
  genreId!: number;

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
