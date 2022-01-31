export class ListVideosDto {
  page: string;
  perPage: string;
  sortField: string;
  sortOrder: string;

  title?: string;

  lengthFrom?: string;
  lengthTo?: string;

  timesWatchedFrom?: string;
  timesWatchedTo?: string;

  tags?: string | string[];
  actors?: string | string[];
}
