import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';

export class FilterListQuery<T> {
  @IsOptional()
  @IsNumberString()
  readonly take: string = '20';

  @IsOptional()
  @IsNumberString()
  readonly skip: string = '0';

  @IsOptional()
  @Transform(({ value }) =>
    value
      .split(',')
      .map((row) => row.split(':'))
      .reduce((o, [k, v]) => ((o[k.trim()] = (v || 'asc').trim().toUpperCase()), o), {})
  )
  readonly order: { [P in keyof T]?: 'ASC' | 'DESC' } = {};
}
