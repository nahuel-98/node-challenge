/**
 * @swagger
 * paths:
 *   /characters:
 *     get:
 *       tags:
 *         - characters
 *       operationId: getAllCharacters
 *       summary: Gets all characters
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *             description: Page number of the paginated result
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             minimum: 1
 *             maximum: 50
 *             default: 50
 *             description: Maximum number of items per page
 *         - in: query
 *           name: name
 *           schema:
 *             type: string
 *           description: Filter by name
 *         - in: query
 *           name: age
 *           schema:
 *             oneOf:
 *               - type: integer
 *               - $ref: '#/components/schemas/NumericFilter'
 *           description: >
 *             Filter by age. Can be an integer to just search for characters whose age equals the
 *             input value or an object as indicated in the `NumericFilter` schema to specify ranges.
 *         - in: query
 *           name: weight
 *           schema:
 *             oneOf:
 *               - type: integer
 *               - $ref: '#/components/schemas/NumericFilter'
 *           description: >
 *             Filter by weight. Can be an integer to just search for characters whose weight equals the
 *             input value or an object as indicated in the `NumericFilter` schema to specify ranges.
 *         - in: query
 *           name: movies
 *           schema:
 *             type: array
 *             items:
 *               type: integer
 *           description: >
 *             Filter by movies (using their ids) where the characters appeared.
 *             If more than one movie id is supplied, it will select characters who appeared
 *             in at least one of those movies
 *       responses:
 *         200:
 *           $ref: '#/components/responses/CharacterList'
 *
 *     post:
 *       tags:
 *         - characters
 *       summary: Creates a new character
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCharacterDto'
 *       responses:
 *         201:
 *           $ref: '#/components/responses/CharacterCreated'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *
 *   /characters/{id}:
 *     get:
 *       tags:
 *         - characters
 *       operationId: getCharacterDetails
 *       summary: Gets a character's details by its id
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Character id
 *       responses:
 *         200:
 *           $ref: '#/components/responses/CharacterDetails'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         404:
 *           $ref: '#/components/responses/CharacterNotFound'
 *
 *     patch:
 *       tags:
 *         - characters
 *       operationId: updateCharacter
 *       summary: Updates a character
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Character id
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateCharacterDto'
 *       responses:
 *         200:
 *           $ref: '#/components/responses/CharacterUpdated'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         404:
 *           $ref: '#/components/responses/CharacterNotFound'
 *
 *     delete:
 *       tags:
 *         - characters
 *       operationId: deleteCharacter
 *       summary: Deletes a character
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: Character id
 *       responses:
 *         200:
 *           $ref: '#/components/responses/CharacterDeleted'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         404:
 *           $ref: '#/components/responses/CharacterNotFound'
 */

import { Service } from 'typedi';
import authenticateJwt from '../middlewares/authenticate-jwt.middleware';
import validateRequest from '../middlewares/validate-request.middleware';
import CharactersController from '../controllers/characters.controller';
import IdParamDto from '../models/dto/id-param.dto';
import CreateCharacterDto from '../models/dto/characters/create-character.dto';
import FilterCharacterDto from '../models/dto/characters/filter-character.dto';
import UpdateCharacterDto from '../models/dto/characters/update-character.dto';
import CommonRoutes from './common.routes';

@Service({ id: 'routes', multiple: true })
export default class CharactersRoutes extends CommonRoutes {
  constructor(private readonly controller: CharactersController) {
    super('/characters');
    this.setUpRoutes();
  }

  protected setUpRoutes() {
    this.router.get(
      '/',
      validateRequest(FilterCharacterDto, 'query'),
      this.controller.findAll.bind(this.controller),
    );

    this.router.get(
      '/:id',
      validateRequest(IdParamDto, 'params'),
      this.controller.findOne.bind(this.controller),
    );

    this.router.post(
      '/',
      authenticateJwt,
      validateRequest(CreateCharacterDto),
      this.controller.create.bind(this.controller),
    );

    this.router.patch(
      '/:id',
      authenticateJwt,
      validateRequest(IdParamDto, 'params'),
      validateRequest(UpdateCharacterDto),
      this.controller.update.bind(this.controller),
    );

    this.router.delete(
      '/:id',
      authenticateJwt,
      validateRequest(IdParamDto, 'params'),
      this.controller.delete.bind(this.controller),
    );
  }
}
