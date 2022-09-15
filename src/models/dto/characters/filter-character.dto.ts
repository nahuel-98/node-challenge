import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import isNumeric from 'validator/lib/isNumeric';
import NormalizeQueryParamString from '../../../decorators/normalize-query-param-string.decorator';
import ToNumericFilter from '../../../decorators/to-numeric-filter.decorator';
import Trim from '../../../decorators/trim.decorator';
import NumericFilter from '../../types/numeric-filter.type';
import PaginateDto from '../paginate.dto';

export default class FilterCharacterDto extends PaginateDto {
  @Expose()
  @IsOptional()
  @Trim()
  @NormalizeQueryParamString()
  name?: string;

  @Expose()
  @IsOptional()
  @ToNumericFilter()
  @Trim()
  age?: NumericFilter;

  @Expose()
  @IsOptional()
  @ToNumericFilter()
  @Trim()
  weight?: NumericFilter;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) {
      return value;
    }

    const ids: Array<number | null> = [];

    return ids
      .concat(value)
      .map((item: unknown) =>
        typeof item === 'string' && isNumeric(item) ? Number(item) : null,
      );
  })
  @Trim()
  movies?: Array<number | null>;
}
