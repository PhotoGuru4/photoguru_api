import { IsOptional, IsInt, Min, IsString, IsEnum, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  PAGINATION_CONFIG,
  SORT_ORDER,
  SortOrderType,
} from 'src/common/constants/global';

export class GetConceptsDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsEnum(SORT_ORDER)
  sortByPrice?: SortOrderType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = PAGINATION_CONFIG.DEFAULT_LIMIT;

  @IsOptional()
  @IsString()
  cursor?: string;
}
