export interface Paginated<T> {
  pagination: {
    page: number;
    totalPages: number;
    itemsPerPage: number;
  };
  data: T[];
}
