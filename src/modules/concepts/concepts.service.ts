import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GetRecommendationsDto } from './dto/get-recommendations.dto';
import { GetConceptsDto } from './dto/get-concepts.dto';
import { MESSAGES } from 'src/common/constants/messages';
import {
  PAGINATION_CONFIG,
  RECOMMENDATION_PRIORITY,
  SORT_ORDER,
} from 'src/common/constants/global';
import { Prisma } from '@prisma/client';
import { GetRelatedConceptsDto } from './dto/get-related-concepts.dto';
import {
  RawConceptRecommendation,
  RecommendedConceptItem,
  ConceptItem,
  CursorData,
  ConceptDetailResponse,
} from './interfaces/concept-response.interface';

@Injectable()
export class ConceptsService {
  private readonly logger = new Logger(ConceptsService.name);

  constructor(private prisma: PrismaService) {}

  private parseCursor(cursor?: string): CursorData | null {
    if (!cursor) return null;
    try {
      return JSON.parse(Buffer.from(cursor, 'base64').toString());
    } catch {
      throw new BadRequestException(MESSAGES.CONCEPT.INVALID_PAGINATION_CURSOR);
    }
  }

  private encodeCursor(data: CursorData): string {
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }

  private buildSingleLocationPrioritySql(
    province: string | null,
    ward: string | null,
  ) {
    if (province && ward) {
      return Prisma.sql`
        MAX(CASE 
          WHEN loc.ward = ${ward} AND loc.province = ${province} THEN ${RECOMMENDATION_PRIORITY.WARD_MATCH}
          WHEN loc.province = ${province} THEN ${RECOMMENDATION_PRIORITY.PROVINCE_MATCH}
          ELSE ${RECOMMENDATION_PRIORITY.OTHERS} 
        END)
      `;
    }
    if (province) {
      return Prisma.sql`
        MAX(CASE 
          WHEN loc.province = ${province} THEN ${RECOMMENDATION_PRIORITY.PROVINCE_MATCH}
          ELSE ${RECOMMENDATION_PRIORITY.OTHERS} 
        END)
      `;
    }
    return Prisma.sql`${RECOMMENDATION_PRIORITY.OTHERS}`;
  }

  private buildArrayLocationPrioritySql(provinces: string[], wards: string[]) {
    if (provinces.length > 0 && wards.length > 0) {
      return Prisma.sql`
        MAX(CASE 
          WHEN loc.ward IN (${Prisma.join(wards)}) AND loc.province IN (${Prisma.join(provinces)}) THEN ${RECOMMENDATION_PRIORITY.WARD_MATCH}
          WHEN loc.province IN (${Prisma.join(provinces)}) THEN ${RECOMMENDATION_PRIORITY.PROVINCE_MATCH}
          ELSE ${RECOMMENDATION_PRIORITY.OTHERS} 
        END)
      `;
    }
    if (provinces.length > 0) {
      return Prisma.sql`
        MAX(CASE 
          WHEN loc.province IN (${Prisma.join(provinces)}) THEN ${RECOMMENDATION_PRIORITY.PROVINCE_MATCH}
          ELSE ${RECOMMENDATION_PRIORITY.OTHERS} 
        END)
      `;
    }
    return Prisma.sql`${RECOMMENDATION_PRIORITY.OTHERS}`;
  }

  async findAll(userId: number, query: GetConceptsDto) {
    const {
      keyword,
      province,
      ward,
      sortByPrice,
      limit = PAGINATION_CONFIG.DEFAULT_LIMIT,
      cursor,
    } = query;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { province: true, ward: true },
    });
    const targetProvince = province || user?.province || null;
    const targetWard = ward || user?.ward || null;

    const parsedCursor = this.parseCursor(cursor);
    const lastId = parsedCursor?.id ?? null;
    const lastMinPrice = parsedCursor?.minPrice ?? null;
    const lastPriority = parsedCursor?.priority ?? null;

    const searchCondition = keyword
      ? Prisma.sql`AND (c.name ILIKE ${'%' + keyword + '%'} OR c.description ILIKE ${'%' + keyword + '%'})`
      : Prisma.empty;

    let paginationCondition = Prisma.empty;
    if (lastPriority !== null && lastId !== null) {
      if (sortByPrice === SORT_ORDER.ASC && lastMinPrice !== null) {
        paginationCondition = Prisma.sql`
          AND (
            (priority < ${lastPriority}) OR
            (priority = ${lastPriority} AND "minPrice" > ${lastMinPrice}) OR
            (priority = ${lastPriority} AND "minPrice" = ${lastMinPrice} AND id > ${lastId})
          )
        `;
      } else if (sortByPrice === SORT_ORDER.DESC && lastMinPrice !== null) {
        paginationCondition = Prisma.sql`
          AND (
            (priority < ${lastPriority}) OR
            (priority = ${lastPriority} AND "minPrice" < ${lastMinPrice}) OR
            (priority = ${lastPriority} AND "minPrice" = ${lastMinPrice} AND id > ${lastId})
          )
        `;
      } else {
        paginationCondition = Prisma.sql`
          AND (
            (priority < ${lastPriority}) OR
            (priority = ${lastPriority} AND id > ${lastId})
          )
        `;
      }
    }

    const orderCondition =
      sortByPrice === SORT_ORDER.ASC
        ? Prisma.sql`ORDER BY priority DESC, "minPrice" ASC, id ASC`
        : sortByPrice === SORT_ORDER.DESC
          ? Prisma.sql`ORDER BY priority DESC, "minPrice" DESC, id ASC`
          : Prisma.sql`ORDER BY priority DESC, id ASC`;

    const priorityQuery = this.buildSingleLocationPrioritySql(
      targetProvince,
      targetWard,
    );

    const concepts = await this.prisma.$queryRaw<RawConceptRecommendation[]>`
      WITH ConceptData AS (
        SELECT 
          c.id, c.name, c.thumbnail_url as "thumbnailUrl", 
          c.photographer_id as "photographerId",
          u.full_name as "photographerName",
          cat.name as "categoryName",
          COALESCE(MIN(cp.price), 0) as "minPrice",
          COALESCE(MAX(cp.price), 0) as "maxPrice",
          ${priorityQuery} as priority
        FROM concepts c
        JOIN photographers p ON c.photographer_id = p.user_id
        JOIN users u ON p.user_id = u.id
        JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN concept_packages cp ON c.id = cp.concept_id
        LEFT JOIN concept_locations loc ON c.id = loc.concept_id
        WHERE 1=1 ${searchCondition}
        GROUP BY c.id, c.name, c.thumbnail_url, c.photographer_id, u.full_name, cat.name
      )
      SELECT * FROM ConceptData
      WHERE 1=1 ${paginationCondition}
      ${orderCondition}
      LIMIT ${limit + 1}
    `;

    const hasMore = concepts.length > limit;
    const rawItems = hasMore ? concepts.slice(0, limit) : concepts;

    let items: ConceptItem[] = [];
    if (rawItems.length > 0) {
      const conceptIds = rawItems.map((c) => c.id);
      const locations = await this.prisma.conceptLocation.findMany({
        where: { conceptId: { in: conceptIds } },
      });

      items = rawItems.map((item) => ({
        id: item.id,
        name: item.name,
        minPrice: Number(item.minPrice),
        maxPrice: Number(item.maxPrice),
        thumbnailUrl: item.thumbnailUrl,
        photographerId: item.photographerId,
        photographerName: item.photographerName,
        categoryName: item.categoryName,
        priority: Number(item.priority),
        locations: locations
          .filter((l) => l.conceptId === item.id)
          .map((l) => ({
            province: l.province,
            ward: l.ward,
            addressDetail: l.addressDetail,
          })),
      }));
    }

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = this.encodeCursor({
        id: lastItem.id,
        minPrice: lastItem.minPrice,
        priority: lastItem.priority,
      });
    }

    return {
      message: MESSAGES.CONCEPT.FETCH_SUCCESS,
      data: { items, meta: { nextCursor, hasNextPage: hasMore } },
    };
  }

  async getRecommended(userId: number, query: GetRecommendationsDto) {
    const { limit = PAGINATION_CONFIG.DEFAULT_LIMIT, cursor } = query;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { province: true, ward: true },
    });

    const parsedCursor = this.parseCursor(cursor);
    const lastId = parsedCursor?.id ?? null;
    const lastPriority = parsedCursor?.priority ?? null;

    let paginationCondition = Prisma.empty;
    if (lastPriority !== null && lastId !== null) {
      paginationCondition = Prisma.sql`
        AND (
          (priority < ${lastPriority}) OR
          (priority = ${lastPriority} AND id > ${lastId})
        )
      `;
    }

    const priorityQuery = this.buildSingleLocationPrioritySql(
      user?.province || null,
      user?.ward || null,
    );

    const concepts = await this.prisma.$queryRaw<RawConceptRecommendation[]>`
      WITH ConceptData AS (
        SELECT 
          c.id, c.name, c.thumbnail_url as "thumbnailUrl", 
          c.photographer_id as "photographerId",
          u.full_name as "photographerName",
          cat.name as "categoryName",
          COALESCE(MIN(cp.price), 0) as "minPrice",
          COALESCE(MAX(cp.price), 0) as "maxPrice",
          ${priorityQuery} as priority
        FROM concepts c
        JOIN photographers p ON c.photographer_id = p.user_id
        JOIN users u ON p.user_id = u.id
        JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN concept_packages cp ON c.id = cp.concept_id
        LEFT JOIN concept_locations loc ON c.id = loc.concept_id
        GROUP BY c.id, c.name, c.thumbnail_url, c.photographer_id, u.full_name, cat.name
      )
      SELECT * FROM ConceptData
      WHERE 1=1 ${paginationCondition}
      ORDER BY priority DESC, id ASC
      LIMIT ${limit + 1}
    `;

    const hasMore = concepts.length > limit;
    const rawItems = hasMore ? concepts.slice(0, limit) : concepts;

    const items: RecommendedConceptItem[] = rawItems.map((item) => ({
      id: item.id,
      name: item.name,
      minPrice: Number(item.minPrice),
      maxPrice: Number(item.maxPrice),
      thumbnailUrl: item.thumbnailUrl,
      photographerId: item.photographerId,
      photographerName: item.photographerName,
      categoryName: item.categoryName,
      priority: Number(item.priority),
    }));

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = this.encodeCursor({
        id: lastItem.id,
        priority: lastItem.priority,
      });
    }

    return {
      message: MESSAGES.CONCEPT.FETCH_RECOMMENDED_SUCCESS,
      data: { items, meta: { nextCursor, hasNextPage: hasMore } },
    };
  }

  async findOne(id: number) {
    const concept = await this.prisma.concept.findUnique({
      where: { id },
      include: {
        category: true,
        photos: true,
        locations: true,
        packages: true,
        photographer: {
          include: {
            user: {
              select: { fullName: true, avatarUrl: true, province: true },
            },
          },
        },
      },
    });

    if (!concept) throw new BadRequestException(MESSAGES.CONCEPT.NOT_FOUND);

    const prices = concept.packages.map((p) => Number(p.price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    const data: ConceptDetailResponse = {
      id: concept.id,
      name: concept.name,
      description: concept.description,
      minPrice,
      maxPrice,
      thumbnailUrl: concept.thumbnailUrl,
      categoryName: concept.category.name,
      photographer: {
        id: concept.photographerId,
        fullName: concept.photographer.user.fullName,
        avatarUrl: concept.photographer.user.avatarUrl,
        ratingAvg: concept.photographer.ratingAvg,
        province: concept.photographer.user.province,
        bio: concept.photographer.bio,
      },
      packages: concept.packages.map((pkg) => ({
        id: pkg.id,
        tier: pkg.tier,
        price: Number(pkg.price),
        description: pkg.description,
        estimatedDuration: pkg.estimatedDuration,
      })),
      photos: concept.photos.map((p) => ({ id: p.id, imageUrl: p.imageUrl })),
      locations: concept.locations.map((l) => ({
        province: l.province,
        ward: l.ward,
        addressDetail: l.addressDetail,
      })),
    };

    return { message: MESSAGES.CONCEPT.FETCH_SUCCESS, data };
  }

  async findRelated(id: number, query: GetRelatedConceptsDto) {
    const { limit = PAGINATION_CONFIG.DEFAULT_LIMIT, cursor } = query;

    const base = await this.prisma.concept.findUnique({
      where: { id },
      select: { locations: { select: { province: true, ward: true } } },
    });
    if (!base) throw new BadRequestException(MESSAGES.CONCEPT.NOT_FOUND);

    const baseProvinces = base.locations.map((l) => l.province);
    const baseWards = base.locations.map((l) => l.ward);

    const parsedCursor = this.parseCursor(cursor);
    const lastId = parsedCursor?.id ?? null;
    const lastPriority = parsedCursor?.priority ?? null;

    let paginationCondition = Prisma.empty;
    if (lastPriority !== null && lastId !== null) {
      paginationCondition = Prisma.sql`
        AND (
          (priority < ${lastPriority}) OR
          (priority = ${lastPriority} AND id > ${lastId})
        )
      `;
    }

    const priorityQuery = this.buildArrayLocationPrioritySql(
      baseProvinces,
      baseWards,
    );

    const related = await this.prisma.$queryRaw<RawConceptRecommendation[]>`
      WITH ConceptData AS (
        SELECT 
          c.id, c.name, c.thumbnail_url as "thumbnailUrl", 
          c.photographer_id as "photographerId",
          u.full_name as "photographerName",
          cat.name as "categoryName",
          COALESCE(MIN(cp.price), 0) as "minPrice",
          COALESCE(MAX(cp.price), 0) as "maxPrice",
          ${priorityQuery} as priority
        FROM concepts c
        JOIN photographers p ON c.photographer_id = p.user_id
        JOIN users u ON p.user_id = u.id
        JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN concept_packages cp ON c.id = cp.concept_id
        LEFT JOIN concept_locations loc ON c.id = loc.concept_id
        WHERE c.id != ${id}
        GROUP BY c.id, c.name, c.thumbnail_url, c.photographer_id, u.full_name, cat.name
      )
      SELECT * FROM ConceptData
      WHERE 1=1 ${paginationCondition}
      ORDER BY priority DESC, id ASC
      LIMIT ${limit + 1}
    `;

    const hasMore = related.length > limit;
    const rawItems = hasMore ? related.slice(0, limit) : related;

    const items: RecommendedConceptItem[] = rawItems.map((r) => ({
      id: r.id,
      name: r.name,
      minPrice: Number(r.minPrice),
      maxPrice: Number(r.maxPrice),
      thumbnailUrl: r.thumbnailUrl,
      photographerId: r.photographerId,
      photographerName: r.photographerName,
      categoryName: r.categoryName,
      priority: Number(r.priority),
    }));

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = this.encodeCursor({
        id: lastItem.id,
        priority: lastItem.priority,
      });
    }

    return {
      message: MESSAGES.CONCEPT.FETCH_SUCCESS,
      data: { items, meta: { nextCursor, hasNextPage: hasMore } },
    };
  }
}
