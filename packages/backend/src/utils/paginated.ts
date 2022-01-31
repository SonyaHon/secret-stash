export interface Paginated<T> {
  pagination: {
    page: number;
    totalPages: number;
    itemsPerPage: number;
  };
  data: T[];
}

export const filterFieldsFactory = (filter) => {
  return (
    fields: string[],
    transform: (
      accum: Record<any, any>,
      field: string,
      value: any,
    ) => Record<any, any>,
  ) => {
    return fields
      .filter((fieldName) => {
        return Object.keys(filter.filter).includes(fieldName);
      })
      .map((fieldName) => {
        const value = filter.filter[fieldName];
        return [fieldName, value];
      })
      .reduce((result, [fieldName, value]) => {
        return transform(result, fieldName, value);
      }, {} as Record<any, any>);
  };
};
