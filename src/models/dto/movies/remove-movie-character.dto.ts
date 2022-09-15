import { Expose } from 'class-transformer';
import { IsNumberString } from 'class-validator';

export default class RemoveMovieCharacterDto {
  @Expose()
  @IsNumberString({ no_symbols: true })
  movieId!: string;

  @Expose()
  @IsNumberString({ no_symbols: true })
  characterId!: string;
}
