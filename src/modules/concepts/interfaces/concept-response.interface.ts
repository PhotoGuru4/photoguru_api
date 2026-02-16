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

export interface ConceptDetailResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  estimatedDuration: number | null;
  tier: ConceptTier;
  thumbnailUrl: string | null;
  categoryName: string;
  photographer: {
    id: number;
    fullName: string;
    avatarUrl: string | null;
    ratingAvg: number;
    province: string | null;
    bio: string | null;
  };
  photos: {
    id: number;
    imageUrl: string;
  }[];
  locations: {
    province: string;
    ward: string;
    addressDetail: string | null;
  }[];
}

export interface RelatedConceptItem {
  id: number;
  name: string;
  price: number;
  thumbnailUrl: string | null;
  photographerName: string;
  categoryName: string;
}

export interface RelatedCursor {
  id: number;
}
