import {
  Injectable,
  Logger,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GetRecommendationsDto } from './dto/get-recommendations.dto';
import { GetConceptsDto } from './dto/get-concepts.dto';
import { MESSAGES } from 'src/common/constants/messages';
import {
  PAGINATION_CONFIG,
  RECOMMENDATION_PRIORITY,
  SORT_ORDER,
} from 'src/common/constants/global';
import { Prisma, UserRole } from '@prisma/client';
import { GetRelatedConceptsDto } from './dto/get-related-concepts.dto';
import {
  RawConceptRecommendation,
  RecommendedConceptItem,
  ConceptItem,
  CursorData,
  ConceptDetailResponse,
} from './interfaces/concept-response.interface';
import { getStartOfMonth } from 'src/common/helpers/date.helper';
import { CreateConceptDto, PackageLocationDto } from './dto/create-concept.dto';
import { GetPhotographerConceptsDto } from './dto/get-photographer-concepts.dto';

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

  private buildPrioritySql(
    province: string | null,
    ward: string | null,
  ): Prisma.Sql {
    if (province && ward) {
      return Prisma.sql`
        MAX(
          CASE 
            WHEN pkg_loc.ward = ${ward} AND pkg_loc.province = ${province} THEN ${RECOMMENDATION_PRIORITY.WARD_MATCH}
            WHEN pkg_loc.province = ${province} THEN ${RECOMMENDATION_PRIORITY.PROVINCE_MATCH}
            ELSE ${RECOMMENDATION_PRIORITY.OTHERS}
          END
        )
      `;
    }
    if (province) {
      return Prisma.sql`
        MAX(
          CASE 
            WHEN pkg_loc.province = ${province} THEN ${RECOMMENDATION_PRIORITY.PROVINCE_MATCH}
            ELSE ${RECOMMENDATION_PRIORITY.OTHERS}
          END
        )
      `;
    }
    return Prisma.sql`${RECOMMENDATION_PRIORITY.OTHERS}`;
  }

  private buildArrayPrioritySql(
    provinces: string[],
    wards: string[],
  ): Prisma.Sql {
    if (provinces.length > 0 && wards.length > 0) {
      return Prisma.sql`
        MAX(
          CASE 
            WHEN pkg_loc.ward IN (${Prisma.join(wards)}) AND pkg_loc.province IN (${Prisma.join(provinces)}) THEN ${RECOMMENDATION_PRIORITY.WARD_MATCH}
            WHEN pkg_loc.province IN (${Prisma.join(provinces)}) THEN ${RECOMMENDATION_PRIORITY.PROVINCE_MATCH}
            ELSE ${RECOMMENDATION_PRIORITY.OTHERS}
          END
        )
      `;
    }
    if (provinces.length > 0) {
      return Prisma.sql`
        MAX(
          CASE 
            WHEN pkg_loc.province IN (${Prisma.join(provinces)}) THEN ${RECOMMENDATION_PRIORITY.PROVINCE_MATCH}
            ELSE ${RECOMMENDATION_PRIORITY.OTHERS}
          END
        )
      `;
    }
    return Prisma.sql`${RECOMMENDATION_PRIORITY.OTHERS}`;
  }
  async getCategories() {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        thumbnailUrl: true,
      },
      orderBy: { name: 'asc' },
    });
    return {
      message: MESSAGES.CONCEPT.CATEGORY,
      data: categories,
    };
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

    const prioritySql = this.buildPrioritySql(targetProvince, targetWard);

    const concepts = await this.prisma.$queryRaw<RawConceptRecommendation[]>`
      WITH ConceptData AS (
        SELECT 
          c.id, 
          c.name, 
          c.thumbnail_url as "thumbnailUrl", 
          c.photographer_id as "photographerId",
          u.full_name as "photographerName",
          u.avatar_url as "photographerAvatar",
          cat.name as "categoryName",
          COALESCE(MIN(cp.price), 0) as "minPrice",
          COALESCE(MAX(cp.price), 0) as "maxPrice",
          ${prioritySql} as priority
        FROM concepts c
        JOIN photographers p ON c.photographer_id = p.user_id
        JOIN users u ON p.user_id = u.id
        JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN concept_packages cp ON c.id = cp.concept_id
        LEFT JOIN concept_package_locations pkg_loc ON cp.id = pkg_loc.package_id
        WHERE 1=1 ${searchCondition}
        GROUP BY c.id, c.name, c.thumbnail_url, c.photographer_id, u.full_name, u.avatar_url, cat.name
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

      const packageLocations =
        await this.prisma.conceptPackageLocation.findMany({
          where: {
            package: {
              conceptId: { in: conceptIds },
            },
          },
          include: {
            package: { select: { conceptId: true } },
          },
        });

      const locationsByConcept = new Map<number, any[]>();
      packageLocations.forEach((pl) => {
        const conceptId = pl.package.conceptId;
        if (!locationsByConcept.has(conceptId)) {
          locationsByConcept.set(conceptId, []);
        }
        locationsByConcept.get(conceptId)!.push({
          province: pl.province,
          ward: pl.ward,
          addressDetail: pl.addressDetail,
        });
      });

      items = rawItems.map((item) => ({
        id: item.id,
        name: item.name,
        minPrice: Number(item.minPrice),
        maxPrice: Number(item.maxPrice),
        thumbnailUrl: item.thumbnailUrl,
        photographerId: item.photographerId,
        photographerName: item.photographerName,
        photographerAvatar: item.photographerAvatar,
        categoryName: item.categoryName,
        priority: Number(item.priority),
        locations: locationsByConcept.get(item.id) || [],
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

    const prioritySql = this.buildPrioritySql(
      user?.province || null,
      user?.ward || null,
    );

    const concepts = await this.prisma.$queryRaw<RawConceptRecommendation[]>`
      WITH ConceptData AS (
        SELECT 
          c.id, 
          c.name, 
          c.thumbnail_url as "thumbnailUrl", 
          c.photographer_id as "photographerId",
          u.full_name as "photographerName",
          u.avatar_url as "photographerAvatar",
          cat.name as "categoryName",
          COALESCE(MIN(cp.price), 0) as "minPrice",
          COALESCE(MAX(cp.price), 0) as "maxPrice",
          ${prioritySql} as priority
        FROM concepts c
        JOIN photographers p ON c.photographer_id = p.user_id
        JOIN users u ON p.user_id = u.id
        JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN concept_packages cp ON c.id = cp.concept_id
        LEFT JOIN concept_package_locations pkg_loc ON cp.id = pkg_loc.package_id
        GROUP BY c.id, c.name, c.thumbnail_url, c.photographer_id, u.full_name, u.avatar_url, cat.name
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
      photographerAvatar: item.photographerAvatar,
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
        packages: {
          include: {
            locations: true,
          },
        },
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

    const allLocations = concept.packages.flatMap((pkg) =>
      pkg.locations.map((l) => ({
        province: l.province,
        ward: l.ward,
        addressDetail: l.addressDetail,
      })),
    );
    const uniqueLocations = Array.from(
      new Map(allLocations.map((l) => [`${l.province}|${l.ward}`, l])).values(),
    );

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
        benefit: pkg.benefit,
        estimatedDuration: pkg.estimatedDuration,
      })),
      photos: concept.photos.map((p) => ({ id: p.id, imageUrl: p.imageUrl })),
      locations: uniqueLocations,
    };

    return { message: MESSAGES.CONCEPT.FETCH_SUCCESS, data };
  }

  async findRelated(id: number, query: GetRelatedConceptsDto) {
    const { limit = PAGINATION_CONFIG.DEFAULT_LIMIT, cursor } = query;

    const baseConcept = await this.prisma.concept.findUnique({
      where: { id },
      select: {
        packages: {
          select: {
            locations: { select: { province: true, ward: true } },
          },
        },
      },
    });

    if (!baseConcept) throw new BadRequestException(MESSAGES.CONCEPT.NOT_FOUND);

    const baseProvinces = baseConcept.packages.flatMap((p) =>
      p.locations.map((l) => l.province),
    );
    const baseWards = baseConcept.packages.flatMap((p) =>
      p.locations.map((l) => l.ward),
    );
    const uniqueProvinces = [...new Set(baseProvinces)];
    const uniqueWards = [...new Set(baseWards)];

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

    const prioritySql = this.buildArrayPrioritySql(
      uniqueProvinces,
      uniqueWards,
    );

    const related = await this.prisma.$queryRaw<RawConceptRecommendation[]>`
      WITH ConceptData AS (
        SELECT 
          c.id, 
          c.name, 
          c.thumbnail_url as "thumbnailUrl", 
          c.photographer_id as "photographerId",
          u.full_name as "photographerName",
          u.avatar_url as "photographerAvatar",
          cat.name as "categoryName",
          COALESCE(MIN(cp.price), 0) as "minPrice",
          COALESCE(MAX(cp.price), 0) as "maxPrice",
          ${prioritySql} as priority
        FROM concepts c
        JOIN photographers p ON c.photographer_id = p.user_id
        JOIN users u ON p.user_id = u.id
        JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN concept_packages cp ON c.id = cp.concept_id
        LEFT JOIN concept_package_locations pkg_loc ON cp.id = pkg_loc.package_id
        WHERE c.id != ${id}
        GROUP BY c.id, c.name, c.thumbnail_url, c.photographer_id, u.full_name, u.avatar_url, cat.name
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
      photographerAvatar: r.photographerAvatar,
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

  async getConceptChatCard(id: number) {
    const concept = await this.prisma.concept.findUnique({
      where: { id },
      include: {
        packages: {
          include: { locations: true },
        },
      },
    });

    if (!concept) throw new BadRequestException(MESSAGES.CONCEPT.NOT_FOUND);

    const prices = concept.packages.map((p) => Number(p.price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      message: MESSAGES.CONCEPT.FETCH_SUCCESS,
      data: {
        id: concept.id,
        name: concept.name,
        description: concept.description,
        thumbnailUrl: concept.thumbnailUrl,
        minPrice,
        maxPrice,
        photographerId: concept.photographerId,
      },
    };
  }

  async getConceptPackages(id: number) {
    const packages = await this.prisma.conceptPackage.findMany({
      where: { conceptId: id },
      include: { locations: true },
      orderBy: { price: 'asc' },
    });

    return {
      message: MESSAGES.CONCEPT.FETCH_SUCCESS,
      data: packages.map((pkg) => ({
        ...pkg,
        price: Number(pkg.price),
      })),
    };
  }
  async getPhotographerConcepts(
    userId: number,
    query: GetPhotographerConceptsDto,
  ) {
    const { page = 1, limit = PAGINATION_CONFIG.DEFAULT_LIMIT } = query;
    const skip = (page - 1) * limit;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== UserRole.PHOTOGRAPHER) {
      throw new ForbiddenException(MESSAGES.AUTH.ACCESS_DENIED);
    }
    const total = await this.prisma.concept.count({
      where: { photographerId: userId },
    });
    const concepts = await this.prisma.concept.findMany({
      where: { photographerId: userId },
      include: {
        category: true,
        packages: true,
        photos: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
    const now = new Date();
    const startOfMonth = getStartOfMonth(now.getFullYear(), now.getMonth());
    const allConcepts = await this.prisma.concept.findMany({
      where: { photographerId: userId },
    });
    const thisMonthConcepts = allConcepts.filter(
      (c) => c.createdAt >= startOfMonth,
    ).length;
    const uniqueCategories = new Set(allConcepts.map((c) => c.categoryId)).size;

    return {
      message: MESSAGES.CONCEPT.FETCH_SUCCESS,
      data: {
        stats: {
          totalConcepts: total,
          thisMonth: thisMonthConcepts,
          categories: uniqueCategories,
        },
        items: concepts.map((c) => ({
          id: c.id,
          name: c.name,
          categoryName: c.category.name,
          createdAt: c.createdAt,
          thumbnailUrl: c.thumbnailUrl,
          photos: c.photos.map((p) => p.imageUrl),
          packagesCount: c.packages.length,
        })),
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }
  async createConcept(userId: number, dto: CreateConceptDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== UserRole.PHOTOGRAPHER) {
      throw new ForbiddenException(MESSAGES.AUTH.ACCESS_DENIED);
    }

    const locationSet = new Set<string>();
    const uniqueLocations: PackageLocationDto[] = [];

    dto.packages.forEach((pkg) => {
      pkg.locations.forEach((loc) => {
        const key = `${loc.province}|${loc.ward}`;
        if (!locationSet.has(key)) {
          locationSet.add(key);
          uniqueLocations.push(loc);
        }
      });
    });

    const createdConcept = await this.prisma.$transaction(
      async (tx) => {
        return await tx.concept.create({
          data: {
            photographerId: userId,
            categoryId: dto.categoryId,
            name: dto.name,
            description: dto.description,
            thumbnailUrl: dto.thumbnailUrl,
            photos: {
              create: dto.photoUrls.map((url) => ({ imageUrl: url })),
            },
            locations: {
              create: uniqueLocations,
            },
            packages: {
              create: dto.packages.map((pkg) => ({
                tier: pkg.tier,
                price: pkg.price,
                estimatedDuration: pkg.estimatedDuration,
                benefit: pkg.benefit,
                locations: {
                  create: pkg.locations,
                },
              })),
            },
          },
          include: {
            photos: true,
            locations: true,
            packages: {
              include: {
                locations: true,
              },
            },
          },
        });
      },
      { timeout: 30000 },
    );
    return {
      message: MESSAGES.CONCEPT.CREATED,
      data: createdConcept,
    };
  }
}
