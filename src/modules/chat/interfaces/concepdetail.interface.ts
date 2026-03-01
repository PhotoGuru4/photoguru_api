export interface ConceptDetailForChat {
  id: number;
  name: string;
  thumbnailUrl: string | null;
  description: string | null;
  minPrice: number;
  maxPrice: number;
  priceRange: string;
}
