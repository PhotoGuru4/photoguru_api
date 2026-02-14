import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION_CONFIG } from 'src/common/constants/global';
import { ApiProperty } from '@nestjs/swagger';

export class GetRecommendationsDto {
  @ApiProperty({
    description: 'Number of recommendations to return',
    required: false,
    example: 10,
    default: PAGINATION_CONFIG.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
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
