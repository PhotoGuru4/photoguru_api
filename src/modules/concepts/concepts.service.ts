import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GetRecommendationsDto } from './dto/get-recommendations.dto';
import { MESSAGES } from 'src/common/constants/messages';
import {
  PAGINATION_CONFIG,
  RECOMMENDATION_PRIORITY,
} from 'src/common/constants/global';
import {
  RawConceptRecommendation,
  RecommendedConceptItem,
} from './interfaces/concept-response.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConceptsService {
  private readonly logger = new Logger(ConceptsService.name);

  constructor(private prisma: PrismaService) {}

  async getRecommended(userId: number, query: GetRecommendationsDto) {
    const { limit = PAGINATION_CONFIG.DEFAULT_LIMIT, cursor } = query;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { province: true, ward: true },
    });

    const userProvince = user?.province ?? null;
    const userWard = user?.ward ?? null;

    let lastId = PAGINATION_CONFIG.INITIAL_ID;
    let lastPriority = PAGINATION_CONFIG.INITIAL_PRIORITY;

    if (cursor) {
      try {
        const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString());

        if (
          typeof decoded.id !== 'number' ||
          typeof decoded.priority !== 'number'
        ) {
          throw new Error();
        }

        lastId = decoded.id;
        lastPriority = decoded.priority;
      } catch (error) {
        throw new BadRequestException('Invalid pagination cursor');
      }
    }

    const concepts = await this.prisma.$queryRaw<
      RawConceptRecommendation[]
    >(Prisma.sql`
      WITH ConceptPriorities AS (
        SELECT 
          c.id, c.name, c.price, c.thumbnail_url as "thumbnailUrl", 
          c.tier, c.photographer_id as "photographerId",
          u.full_name as "photographerName",
          cat.name as "categoryName",
          MAX(CASE 
            WHEN ${userWard} IS NOT NULL 
            AND ${userProvince} IS NOT NULL AND loc.ward = ${userWard} 
            AND loc.province = ${userProvince} THEN ${RECOMMENDATION_PRIORITY.WARD_MATCH}
            WHEN ${userProvince} IS NOT NULL 
            AND loc.province = ${userProvince} THEN ${RECOMMENDATION_PRIORITY.PROVINCE_MATCH}
            ELSE ${RECOMMENDATION_PRIORITY.OTHERS} 
          END) as priority
        FROM concepts c
        JOIN photographers p ON c.photographer_id = p.user_id
        JOIN users u ON p.user_id = u.id
        JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN concept_locations loc ON c.id = loc.concept_id
        GROUP BY c.id, u.full_name, cat.name
      )
      SELECT * FROM ConceptPriorities
      WHERE (priority < ${lastPriority}) 
         OR (priority = ${lastPriority} AND id > ${lastId})
      ORDER BY priority DESC, id ASC
      LIMIT ${limit + 1}
    `);

    let nextCursor: string | null = null;
    const hasMore = concepts.length > limit;
    const rawItems = hasMore ? concepts.slice(0, limit) : concepts;

    const items: RecommendedConceptItem[] = rawItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      thumbnailUrl: item.thumbnailUrl,
      tier: item.tier,
      photographerId: item.photographerId,
      photographerName: item.photographerName,
      categoryName: item.categoryName,
      priority: Number(item.priority),
    }));

    if (hasMore) {
      const lastItem = items[items.length - 1];
      nextCursor = Buffer.from(
        JSON.stringify({ id: lastItem.id, priority: lastItem.priority }),
      ).toString('base64');
    }

    return {
      message: MESSAGES.CONCEPT.FETCH_RECOMMENDED_SUCCESS,
      data: {
        items,
        meta: {
          nextCursor,
          hasNextPage: hasMore,
        },
      },
    };
  }
}
