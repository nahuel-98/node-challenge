import { Expose } from 'class-transformer';
import { IsNumberString } from 'class-validator';

export default class IdParamDto {
  @Expose()
  @IsNumberString({ no_symbols: true })
  id!: string;
}
