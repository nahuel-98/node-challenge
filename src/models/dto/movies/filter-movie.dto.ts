import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import isNumeric from 'validator/lib/isNumeric';
import NormalizeQueryParamString from '../../../decorators/normalize-query-param-string.decorator';
import Trim from '../../../decorators/trim.decorator';
import PaginateDto from '../paginate.dto';

/**
 * Movies filter options.
 */
export default class FilterMovieDto extends PaginateDto {
  /**
   * Movie's title.
   */
  @Expose()
  @IsOptional()
  @Trim()
  @NormalizeQueryParamString()
  title?: string;

  /**
   * Id of the movie's genre
   */
  @Expose()
  @IsOptional()
  @Transform(({ value }) => {
    if (value == null) {
      return value;
    }

    if (Array.isArray(value)) {
      value = value[0];
    }

    return typeof value === 'string' && isNumeric(value) ? Number(value) : null;
  })
  genre?: number | null;

  /**
   * Direction to sort the movie's creation date by.
   */
  @Expose()
  @IsOptional()
  @Transform(({ value }) =>
    String(value).toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
  )
  @Trim()
  @NormalizeQueryParamString()
  order: 'ASC' | 'DESC' = 'ASC';
}
