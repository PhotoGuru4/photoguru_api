import { ConceptTier } from '@prisma/client';
export interface RawConceptRecommendation {
  id: number;
  name: string;
  price: number;
  thumbnailUrl: string | null;
  tier: ConceptTier;
  photographerId: number;
  photographerName: string;
  categoryName: string;
  priority: bigint | number;
}

export interface RecommendedConceptItem {
  id: number;
  name: string;
  price: number;
  thumbnailUrl: string | null;
  tier: ConceptTier;
  photographerId: number;
  photographerName: string;
  categoryName: string;
  priority: number;
}

export interface ConceptItem {
  id: number;
  name: string;
  price: number;
  thumbnailUrl: string | null;
  tier: ConceptTier;
  photographerId: number;
  photographerName: string;
  categoryName: string;
  locations: {
    province: string;
    ward: string;
    addressDetail: string | null;
  }[];
}

export interface SearchCursor {
  id: number;
  price: number;
}
