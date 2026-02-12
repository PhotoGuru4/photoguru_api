export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 10,
  INITIAL_ID: 0,
  INITIAL_PRIORITY: 3,
} as const;

export const RECOMMENDATION_PRIORITY = {
  WARD_MATCH: 2,
  PROVINCE_MATCH: 1,
  OTHERS: 0,
} as const;

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrderType = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];
