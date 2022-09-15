import { expect } from 'chai';
import { plainToInstance } from 'class-transformer';
import { Sequelize } from 'sequelize-typescript';
import { Association } from 'sequelize';
import Character from '../../../src/models/character.model';
import Genre from '../../../src/models/genre.model';
import MovieCharacter from '../../../src/models/movie-character.model';
import Movie from '../../../src/models/movie.model';

describe('movie model tests', () => {
  let sequelize: Sequelize;

  beforeEach(() => {
    sequelize = new Sequelize({ validateOnly: true });
    sequelize.addModels([Genre, Movie, MovieCharacter, Character]);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe('transform decorator', () => {
    it('should not tranform value rating is null', () => {
      const plain = { rating: null };

      expect(plainToInstance(Movie, plain)).to.have.property('rating', null);
    });

    it('should convert value to number is rating is string', () => {
      const plain = { rating: '4.4' };

      expect(plainToInstance(Movie, plain)).to.have.property('rating', 4.4);
    });
  });

  describe('associations', () => {
    it('many movies have a genre', () => {
      expect(Movie)
        .to.have.property('associations')
        .that.has.property('genre')
        .that.is.an.instanceOf(Association);

      expect(Movie.associations.genre).to.have.property(
        'associationType',
        'BelongsTo',
      );
      expect(Movie.associations.genre).to.have.property(
        'foreignKey',
        'genreId',
      );
    });

    it('many movies have many characters', () => {
      expect(Movie)
        .to.have.property('associations')
        .that.has.property('characters')
        .that.is.an.instanceOf(Association);

      expect(Movie.associations.characters).to.have.property(
        'associationType',
        'BelongsToMany',
      );
      expect(Movie.associations.characters).to.have.property(
        'foreignKey',
        'movieId',
      );
    });
  });
});
