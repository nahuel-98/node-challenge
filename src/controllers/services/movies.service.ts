import buildPaginator from 'pagination-apis';
import { col, fn, Op, where, WhereOptions } from 'sequelize';
import { Service } from 'typedi';
import Character from '../../models/character.model';
import Genre from '../../models/genre.model';
import Movie from '../../models/movie.model';
import MovieCharacter from '../../models/movie-character.model';
import AddMovieCharacterDto from '../../models/dto/movies/add-movie-character.dto';
import CreateMovieDto from '../../models/dto/movies/create-movie.dto';
import UpdateMovieDto from '../../models/dto/movies/update-movie.dto';
import FilterMovieDto from '../../models/dto/movies/filter-movie.dto';

@Service()
export default class MoviesService {
  /**
   * Returns paginated list of all movies.
   */
  async findAll(dto: FilterMovieDto) {
    const conditions = [];

    if (dto.title !== undefined) {
      conditions.push(
        where(fn('to_tsvector', col('title')), {
          [Op.match]: fn('plainto_tsquery', dto.title),
        }),
      );
    }

    if (dto.genre !== undefined) {
      conditions.push({ genreId: dto.genre });
    }

    const { limit, skip, paginate } = buildPaginator({
      page: dto.page,
      limit: dto.limit,
      url: '/movies',
    });

    const { count, rows } = await Movie.findAndCountAll({
      attributes: ['id', 'title', 'imageUrl', 'createdAt'],
      where: { [Op.and]: conditions },
      order: [['createdAt', dto.order]],
      limit,
      offset: skip,
    });

    return paginate(rows, count);
  }

  /**
   * Retuns a movie by its id.
   */
  findOne(id: number): Promise<Movie | null> {
    return Movie.findByPk(id, {
      include: [
        {
          model: Character,
          attributes: ['id', 'name', 'imageUrl'],
          through: { attributes: [] },
        },
        {
          model: Genre,
        },
      ],
    });
  }

  /**
   * Creates a new movie and saves it to the database.
   *
   * @returns The id of the created movie.
   */
  create(dto: CreateMovieDto): Promise<Movie> {
    return Movie.create({ ...dto });
  }

  /**
   * Updates a movie.
   *
   * @returns The updated entity, or `null` if it was not found.
   */
  async update(id: number, dto: UpdateMovieDto): Promise<Movie | null> {
    const movie = await Movie.findByPk(id);

    if (movie) {
      movie.setAttributes(dto);
      await movie.save();
    }

    return movie;
  }

  /**
   * Deletes a movie.
   *
   * @returns The number of deleted movies (0 or 1).
   */
  delete(id: number): Promise<number> {
    return Movie.destroy({ where: { id }, limit: 1 });
  }

  /**
   * Creates a new relation between a movie and a character and saves it to the db.
   *
   * @returns The created entity
   */
  addCharacter(
    id: number,
    { characterId }: AddMovieCharacterDto,
  ): Promise<MovieCharacter> {
    return MovieCharacter.create({ movieId: id, characterId });
  }

  /**
   * Removes a character from a movie.
   *
   * @returns The number of removed characters (0 or 1).
   */
  removeCharacter(movieId: number, characterId: number): Promise<number> {
    return MovieCharacter.destroy({
      where: { movieId, characterId },
      limit: 1,
    });
  }

  /**
   * Returns a boolean indicating if a movie exists.
   *
   * @param where Conditions to find a movie. If not specified, returns true if at least one movie exists in the db.
   * @example
   * const exists = await new MoviesService().exists({ id: 1 });
   */
  async exists(where?: WhereOptions<Movie>): Promise<boolean> {
    return Boolean(await Movie.findOne({ attributes: ['id'], where }));
  }
}
