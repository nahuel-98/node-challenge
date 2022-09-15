import { expect } from 'chai';
import { plainToInstance } from 'class-transformer';
import FilterCharacterDto from '../../../../../src/models/dto/characters/filter-character.dto';

describe('FilterCharacterDto tests', () => {
  it('should skip transformation on undefined', () => {
    const plain = {};

    const instance = plainToInstance(FilterCharacterDto, plain, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    expect(instance).to.not.have.property('movies');
  });

  it('should convert numeric strings to numbers', () => {
    const plain = { movies: ['123'] };

    const instance = plainToInstance(FilterCharacterDto, plain);

    expect(instance).to.have.deep.property('movies', [123]);
  });

  it('should convert non numeric strings to null', () => {
    const plain = { movies: [''] };

    const instance = plainToInstance(FilterCharacterDto, plain);

    expect(instance).to.have.deep.property('movies', [null]);
  });
});
