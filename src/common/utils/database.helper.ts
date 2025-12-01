export const parseIntOrThrow = (value: any, fieldName = 'ID'): number => {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  return parsed;
};

export const buildWhereClause = (filters: Record<string, any>) => {
  const where: Record<string, any> = {};
  for (const key in filters) {
    if (filters[key] !== undefined && filters[key] !== null) {
      where[key] = filters[key];
    }
  }
  return where;
};
