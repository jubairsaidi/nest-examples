import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class QueryOrderPipe implements PipeTransform {
  transform(value: string): Record<string, 'ASC' | 'DESC'> {
    if (!value) return {};
    return value
      .split(',')
      .map((row) => row.split(':'))
      .reduce((o, [k, v]) => ((o[k.trim()] = (v || 'asc').trim().toUpperCase()), o), {});
  }
}
