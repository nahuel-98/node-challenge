/**
 * @swagger
 * components:
 *   schemas:
 *     AddMovieCharacterDto:
 *       type: object
 *       properties:
 *         characterId:
 *           type: integer
 *           description: ID of the character to add to a movie.
 *           writeOnly: true
 *           example: 1
 *       required:
 *         - characterId
 */

import { Expose } from 'class-transformer';
import { IsInt } from 'class-validator';

/**
 * Validates request body when adding a character to a movie.
 */
export default class AddMovieCharacterDto {
  @Expose()
  @IsInt()
  characterId!: number;
}
