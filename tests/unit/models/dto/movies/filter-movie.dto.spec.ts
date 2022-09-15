import { expect } from 'chai';
import { plainToInstance } from 'class-transformer';
import FilterMovieDto from '../../../../../src/models/dto/movies/filter-movie.dto';

describe('FilterMovieDto tests', () => {
  describe('genre', () => {
    it('should skip transformation on undefined', () => {
      const plain = {};

      const instance = plainToInstance(FilterMovieDto, plain, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });

      expect(instance).to.not.have.property('genre');
    });

    it('should convert numeric strings to numbers', () => {
      const plain = { genre: '123' };

      const instance = plainToInstance(FilterMovieDto, plain);

      expect(instance).to.have.property('genre', 123);
    });

    it('should convert non numeric strings to null', () => {
      const plain = { genre: '' };

      const instance = plainToInstance(FilterMovieDto, plain);

      expect(instance).to.have.deep.property('genre', null);
    });

    it('should also work with arrays', () => {
      const plain = { genre: ['123', '456'] };

      const instance = plainToInstance(FilterMovieDto, plain);

      expect(instance).to.have.property('genre', 123);
    });
  });

  describe('order', () => {
    it('should be ASC', () => {
      const plain = {};

      const instance = plainToInstance(FilterMovieDto, plain);

      expect(instance).to.have.property('order', 'ASC');
    });

    it('should be DESC', () => {
      const plain = { order: 'desc' };

      const instance = plainToInstance(FilterMovieDto, plain);

      expect(instance).to.have.property('order', 'DESC');
    });
  });
});
