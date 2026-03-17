import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PAGINATION_CONFIG } from 'src/common/constants/global';

export class GetPhotographerConceptsDto {
  @ApiPropertyOptional({ default: PAGINATION_CONFIG.DEFAULT_LIMIT })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = PAGINATION_CONFIG.DEFAULT_LIMIT;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
}
