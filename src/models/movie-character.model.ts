import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';
import Character from './character.model';
import Movie from './movie.model';

/**
 * Represents the relation between Movies and Characters.
 */
@Table({ tableName: 'movies-characters', timestamps: false })
export default class MovieCharacter extends Model {
  @ForeignKey(() => Movie)
  @Column
  movieId!: number;

  @ForeignKey(() => Character)
  @Column
  characterId!: number;
}
