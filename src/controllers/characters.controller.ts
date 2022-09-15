/**
 * @swagger
 * components:
 *   links:
 *     GetAllCharacters:
 *       operationId: getAllCharacters
 *       parameters:
 *         name: '$response.body#/name'
 *         age: '$response.body#/age'
 *         weight: '$response.body#/weight'
 *       description: >
 *         The `name`, `age` and `weight` values returned in the response can be used
 *         as the query parameters of the same name in `GET /characters`
 *
 *     GetCharacterDetails:
 *       operationId: getCharacterDetails
 *       parameters:
 *         id: '$response.body#/id'
 *       description: >
 *         The `id` value returned in the response can be used as the `id` param
 *         in `GET /characters/{id}`
 *
 *     UpdateCharacter:
 *       operationId: updateCharacter
 *       parameters:
 *         id: '$response.body#/id'
 *       description: >
 *         The `id` value returned in the response can be used as the `id` param
 *         in `PATCH /characters/{id}`
 *
 *     DeleteCharacter:
 *       operationId: deleteCharacter
 *       parameters:
 *         id: '$response.body#/id'
 *       description: >
 *         The `id` value returned in the response can be used as the `id` param
 *         in `DELETE /characters/{id}`
 *
 *     RemoveCharacterFromMovieCharacterId:
 *       operationId: removeCharacterFromMovie
 *       parameters:
 *         characterId: '$response.body#/id'
 *       description:
 *         The `id` value returned in the response can be used as the `characterId` param
 *         in `DELETE /movies/{movieId}/characters/{characterId}`
 *
 *   responses:
 *     CharacterList:
 *       description: Paginated list of characters
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/PaginationResult'
 *               - type: object
 *                 properties:
 *                   data:
 *                     items:
 *                       $ref: '#/components/schemas/Character'
 *
 *     CharacterDetails:
 *       description: The found character
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CharacterDetails'
 *       links:
 *         getAllCharacters:
 *           $ref: '#/components/links/GetAllCharacters'
 *
 *     CharacterCreated:
 *       description: Character created successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 readOnly: true
 *                 description: Id of the created character.
 *                 example: 1
 *       links:
 *         getCharacterDetails:
 *           $ref: '#/components/links/GetCharacterDetails'
 *         updateCharacter:
 *           $ref: '#/components/links/UpdateCharacter'
 *         deleteCharacter:
 *           $ref: '#/components/links/DeleteCharacter'
 *         removeCharacterFromMovie:
 *           $ref: '#/components/links/RemoveCharacterFromMovieCharacterId'
 *
 *     CharacterUpdated:
 *       description: Character updated successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 default: Character updated.
 *
 *     CharacterDeleted:
 *       description: Character deleted successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 default: Character deleted.
 *
 *     CharacterNotFound:
 *       description: Character not found.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HttpError'
 *           example:
 *             statusCode: 404
 *             name: Not Found
 *             message: Character not found.
 *
 *     InvalidCharacterId:
 *       description: >
 *         The `characterId` provided in the request does not correspond to a character in the database.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HttpError'
 *           example:
 *             statusCode: 422
 *             name: Unproccessable Entity
 *             message: Character with id 1 does not exist.
 */

import { instanceToPlain } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';
import CharactersService from './services/characters.service';

@Service()
export default class CharactersController {
  constructor(private readonly service: CharactersService) {}

  /**
   * Returns a paginated list of characters.
   */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await this.service.findAll(req.query);

      return res
        .status(HttpStatus.OK)
        .json(instanceToPlain(result, { excludeExtraneousValues: true }));
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Returns the details of a character.
   */
  async findOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const character = await this.service.findOne(Number(req.params.id));

      if (character) {
        return res
          .status(HttpStatus.OK)
          .json(instanceToPlain(character, { excludeExtraneousValues: true }));
      }

      return next(new HttpError(HttpStatus.NOT_FOUND, 'Character not found.'));
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Creates a new character.
   */
  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const character = await this.service.create(req.body);

      return res.status(HttpStatus.CREATED).json({ id: character.id });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Updates an existing chartacter.
   */
  async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const updated = await this.service.update(
        Number(req.params.id),
        req.body,
      );

      if (!updated) {
        return next(
          new HttpError(HttpStatus.NOT_FOUND, 'Character not found.'),
        );
      }

      return res.status(HttpStatus.OK).json({ message: 'Character updated.' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Deletes a character.
   */
  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const deleted = await this.service.delete(Number(req.params.id));

      if (!deleted) {
        return next(
          new HttpError(HttpStatus.NOT_FOUND, 'Character not found.'),
        );
      }

      return res.status(HttpStatus.OK).json({ message: 'Character deleted.' });
    } catch (err) {
      return next(err);
    }
  }
}
