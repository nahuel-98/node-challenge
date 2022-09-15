import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import Trim from '../../decorators/trim.decorator';

/**
 * Pagination options.
 */
export default class PaginateDto {
  /**
   * Page number.
   */
  @Expose()
  @IsOptional()
  @Trim()
  page?: string;

  /**
   * Max number of items per page.
   */
  @Expose()
  @IsOptional()
  @Trim()
  limit?: string;
}
