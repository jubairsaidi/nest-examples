export interface PaginatedResponse<T> {
  data: Array<T>;
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
}

export interface ResultsAndTotal<T> {
  data: Array<T>;
  total: number;
}
