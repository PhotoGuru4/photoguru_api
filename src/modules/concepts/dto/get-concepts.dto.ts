import { IsOptional, IsInt, Min, IsString, IsEnum, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  PAGINATION_CONFIG,
  SORT_ORDER,
  SortOrderType,
} from 'src/common/constants/global';
import { ApiProperty } from '@nestjs/swagger';

export class GetConceptsDto {
  @ApiProperty({
    description: 'Keyword to search for concepts',
    required: false,
    example: 'wedding',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiProperty({
    enum: ['asc', 'desc'],
    required: false,
    description: 'Sort order for price (asc or desc)',
  })
  @IsOptional()
  @IsEnum(SORT_ORDER)
  sortByPrice?: SortOrderType;

  @ApiProperty({
    description: 'Number of concepts to return',
    required: false,
    example: 10,
    default: PAGINATION_CONFIG.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = PAGINATION_CONFIG.DEFAULT_LIMIT;

  @ApiProperty({
    description: 'Cursor for pagination',
    required: false,
    example: 'eyJpZCI6MTB9',
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}
