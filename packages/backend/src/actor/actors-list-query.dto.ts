export class ActorsListQueryDto {
  page: string;
  perPage: string;
  sortField?: string;
  sortOrder?: string;

  name?: string;

  eyeColor?: string;
  hairColor?: string;
  ethnicity?: string;

  penisSize?: string | string[];
  breastsSize?: string | string[];
  tags?: string | string[];
}
