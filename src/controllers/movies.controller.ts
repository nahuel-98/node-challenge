/**
 * @swagger
 * components:
 *   links:
 *     GetAllMovies:
 *       operationId: getAllMovies
 *       parameters:
 *         title: '$response.body#/title'
 *         genre: '$response.body#/genre/id'
 *       description: >
 *         The `title` and `genre.id` values returned in the response body can be used as the `title`
 *         and `genre` query params, respectively, in `GET /movies`.
 *
 *     GetMovieDetails:
 *       operationId: getMovieDetails
 *       parameters:
 *         id: '$response.body#/id'
 *       description: >
 *         The `id` value returned in the response can be used as the `id` param
 *         in `GET /movies/{id}`
 *
 *     UpdateMovie:
 *       operationId: updateMovie
 *       parameters:
 *         id: '$response.body#/id'
 *       description: >
 *         The `id` value returned in the response can be used as the `id` param
 *         in `PATCH /movies/{id}`
 *
 *     DeleteMovie:
 *       operationId: deleteMovie
 *       parameters:
 *         id: '$response.body#/id'
 *       description: >
 *         The `id` value returned in the response can be used as the `id` param
 *         in `DELETE /movies/{id}`
 *
 *     AddCharacterToMovie:
 *       operationId: addCharacterToMovie
 *       parameters:
 *         id: '$response.body#/id'
 *       description: >
 *         The `id` value returned in the response can be used as the `id` param
 *         in `POST /movies/{id}/characters`
 *
 *     RemoveCharacterFromMovieMovieId:
 *       operationId: removeCharacterFromMovie
 *       parameters:
 *         movieId: '$response.body#/id'
 *       description:
 *         The `id` value returned in the response can be used as the `movieId` param
 *         in `DELETE /movies/{movieId}/characters/characterId`
 *
 *   responses:
 *     MovieList:
 *       description: Paginated list of movies.
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/PaginationResult'
 *               - type: object
 *                 properties:
 *                   data:
 *                     items:
 *                       $ref: '#/components/schemas/Movie'
 *
 *     MovieDetails:
 *       description: The found movie.
 *       links:
 *         getAllMovies:
 *           $ref: '#/components/links/GetAllMovies'
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieDetails'
 *
 *     MovieCreated:
 *       description: Movie created successfully.
 *       links:
 *         getMovieDetails:
 *           $ref: '#/components/links/GetMovieDetails'
 *         updateMovie:
 *           $ref: '#/components/links/UpdateMovie'
 *         deleteMovie:
 *           $ref: '#/components/links/DeleteMovie'
 *         addCharacterToMovie:
 *           $ref: '#/components/links/AddCharacterToMovie'
 *         removeCharacterFromMovie:
 *           $ref: '#/components/links/RemoveCharacterFromMovieMovieId'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 readOnly: true
 *                 description: Id of the created movie.
 *                 example: 1
 *
 *     MovieUpdated:
 *       description: Movie updated successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 default: Movie updated.
 *
 *     MovieDeleted:
 *       description: Movie deleted successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 default: Movie deleted.
 *
 *     MovieNotFound:
 *       description: Movie not found.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HttpError'
 *           example:
 *             statusCode: 404
 *             name: Not Found
 *             message: Movie not found.
 *
 *     InvalidGenreId:
 *       description: The `genreId` provided in the request does not correspond to a genre in the database.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HttpError'
 *           example:
 *             statusCode: 422
 *             name: Unproccessable Entity
 *             message: Genre with id 10 does not exist.
 *
 *     MovieCharacterAdded:
 *       description: Character added to movie successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 default: Character added to movie
 *
 *     MovieCharacterAlreadyAdded:
 *       description: The character is already added to the movie.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HttpError'
 *           example:
 *             statusCode: 409
 *             name: Conflict
 *             message: The character is already added to the movie.
 *
 *     MovieCharacterRemoved:
 *       description: Character removed from movie successfully.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 default: Character removed from movie.
 *
 *     MovieCharacterNotFound:
 *       description: Movie or character not found.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HttpError'
 *           examples:
 *             movieNotFound:
 *               summary: Movie was not found in the database
 *               value:
 *                 statusCode: 404
 *                 name: Not Found
 *                 message: Movie not found.
 *             characterNotFound:
 *               summary: Character was not found in the movie
 *               value:
 *                 statusCode: 404
 *                 name: Not Found
 *                 message: Character not found.
 */

import { instanceToPlain } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { Service } from 'typedi';
import FilterMovieDto from '../models/dto/movies/filter-movie.dto';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';
import MoviesService from './services/movies.service';

@Service()
export default class MoviesController {
  constructor(private readonly service: MoviesService) {}

  /**
   * Returns all the movies.
   */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await this.service.findAll(
        req.query as unknown as FilterMovieDto,
      );

      return res
        .status(HttpStatus.OK)
        .json(instanceToPlain(result, { excludeExtraneousValues: true }));
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Returns the details of a movie.
   */
  async findOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const movie = await this.service.findOne(Number(req.params.id));

      if (movie) {
        return res
          .status(HttpStatus.OK)
          .json(instanceToPlain(movie, { excludeExtraneousValues: true }));
      }

      return next(new HttpError(HttpStatus.NOT_FOUND, 'Movie not found.'));
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Creates a new movie.
   */
  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const movie = await this.service.create(req.body);

      return res.status(HttpStatus.CREATED).json({ id: movie.id });
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        return next(
          new HttpError(
            HttpStatus.UNPROCESSABLE_ENTITY,
            `Genre with id ${req.body.genreId} does not exist.`,
          ),
        );
      }

      return next(err);
    }
  }

  /**
   * Updates an existing movie.
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
        return next(new HttpError(HttpStatus.NOT_FOUND, 'Movie not found.'));
      }

      return res.status(HttpStatus.OK).json({ message: 'Movie updated.' });
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        return next(
          new HttpError(
            HttpStatus.UNPROCESSABLE_ENTITY,
            `Genre with id ${req.body.genreId} does not exist.`,
          ),
        );
      }

      return next(err);
    }
  }

  /**
   * Deletes a movie.
   */
  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const deleted = await this.service.delete(Number(req.params.id));

      if (!deleted) {
        return next(new HttpError(HttpStatus.NOT_FOUND, 'Movie not found.'));
      }

      return res.status(HttpStatus.OK).json({ message: 'Movie deleted.' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Adds a character to a movie
   */
  async addCharacter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      if (!(await this.service.exists({ id: Number(req.params.id) }))) {
        return next(new HttpError(HttpStatus.NOT_FOUND, 'Movie not found.'));
      }

      await this.service.addCharacter(Number(req.params.id), req.body);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Character added to movie' });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return next(
          new HttpError(
            HttpStatus.CONFLICT,
            'The character is already added to the movie.',
          ),
        );
      }

      if (err instanceof ForeignKeyConstraintError) {
        return next(
          new HttpError(
            HttpStatus.UNPROCESSABLE_ENTITY,
            `Character with id ${req.body.characterId} does not exist.`,
          ),
        );
      }

      return next(err);
    }
  }

  /**
   * Removes a character from a movie.
   */
  async removeCharacter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const deleted = await this.service.removeCharacter(
        Number(req.params.movieId),
        Number(req.params.characterId),
      );

      if (!deleted) {
        const entity = (await this.service.exists({
          id: Number(req.params.movieId),
        }))
          ? 'Character'
          : 'Movie';

        return next(
          new HttpError(HttpStatus.NOT_FOUND, `${entity} not found.`),
        );
      }

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Character removed from movie.' });
    } catch (err) {
      return next(err);
    }
  }
}
