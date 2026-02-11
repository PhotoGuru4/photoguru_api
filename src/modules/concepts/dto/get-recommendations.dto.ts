import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION_CONFIG } from 'src/common/constants/global';

export class GetRecommendationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = PAGINATION_CONFIG.DEFAULT_LIMIT;

  @IsOptional()
  @IsString()
  cursor?: string;
}
