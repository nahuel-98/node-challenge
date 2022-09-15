/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCharacterDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 30
 *           description: Character name.
 *           example: Simba
 *         imageUrl:
 *           type: string
 *           format: url
 *           maxLength: 2048
 *           description: Character image url.
 *           example: 'https://upload.wikimedia.org/wikipedia/en/9/94/Simba_%28_Disney_character_-_adult%29.png'
 *         age:
 *           type: integer
 *           description: Character age, in years.
 *           example: 4
 *         weight:
 *           type: integer
 *           description: Character weight, in kilograms
 *           example: 175
 *         history:
 *           type: string
 *           maxLength: 100
 *           description: Character's backstory and/or a summary of the character's involvement in the productions they took part of.
 *           example: He is the son of Mufasa and Sarabi, who was destined to rule the Pride Lands, as king.
 */

import { Expose } from 'class-transformer';
import { IsInt, IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';
import Trim from '../../../decorators/trim.decorator';

export default class UpdateCharacterDto {
  @Expose()
  @MaxLength(30)
  @Trim()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsUrl()
  @MaxLength(2048)
  @Trim()
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Expose()
  @IsInt()
  @IsOptional()
  age?: number;

  @Expose()
  @IsInt()
  @IsOptional()
  weight?: number;

  @Expose()
  @MaxLength(1000)
  @Trim()
  @IsString()
  @IsOptional()
  history?: string;
}
