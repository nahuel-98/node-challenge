import { expect, use } from 'chai';
import { Association } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import sinonChai from 'sinon-chai';
import Character from '../../../src/models/character.model';
import Genre from '../../../src/models/genre.model';
import MovieCharacter from '../../../src/models/movie-character.model';
import Movie from '../../../src/models/movie.model';

use(sinonChai);

describe('character model tests', () => {
  it('a character should have many movies', () => {
    const sequelize = new Sequelize({ validateOnly: true });
    sequelize.addModels([Genre, Movie, MovieCharacter, Character]);

    expect(Character)
      .to.have.property('associations')
      .that.has.property('movies')
      .that.is.an.instanceOf(Association);

    expect(Character.associations.movies).to.have.property(
      'foreignKey',
      'characterId',
    );
    expect(Character.associations.movies).to.have.property(
      'associationType',
      'BelongsToMany',
    );
  });
});
