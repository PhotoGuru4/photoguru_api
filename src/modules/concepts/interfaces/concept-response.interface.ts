import { ConceptTier } from '@prisma/client';

export interface RawConceptRecommendation {
  id: number;
  name: string;
  minPrice: number | string;
  maxPrice: number | string;
  thumbnailUrl: string | null;
  photographerId: number;
  photographerName: string;
  categoryName: string;
  priority: bigint | number;
}

export interface RecommendedConceptItem {
  id: number;
  name: string;
  minPrice: number;
  maxPrice: number;
  thumbnailUrl: string | null;
  photographerId: number;
  photographerName: string;
  categoryName: string;
  priority: number;
}

export interface ConceptItem {
  id: number;
  name: string;
  minPrice: number;
  maxPrice: number;
  thumbnailUrl: string | null;
  photographerId: number;
  photographerName: string;
  categoryName: string;
  priority: number;
  locations: {
    province: string;
    ward: string;
    addressDetail: string | null;
  }[];
}

export interface CursorData {
  id: number;
  minPrice?: number;
  priority: number;
}

export interface ConceptDetailResponse {
  id: number;
  name: string;
  description: string | null;
  minPrice: number;
  maxPrice: number;
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
  packages: {
    id: number;
    tier: ConceptTier;
    price: number;
    description: string | null;
    estimatedDuration: number | null;
  }[];
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
