import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetDashboardDto {
  @ApiPropertyOptional({ description: 'Month (1-12)', example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @ApiPropertyOptional({ description: 'Year', example: 2026 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;
}
