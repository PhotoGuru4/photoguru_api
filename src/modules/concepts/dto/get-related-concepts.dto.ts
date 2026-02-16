import { IsOptional, IsInt, Min, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION_CONFIG } from 'src/common/constants/global';
import { ApiProperty } from '@nestjs/swagger';

export class GetRelatedConceptsDto {
  @ApiProperty({
    description: 'Number of related concepts to return',
    required: false,
    example: 4,
    default: PAGINATION_CONFIG.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = PAGINATION_CONFIG.DEFAULT_LIMIT;

  @ApiProperty({
    description: 'Cursor for pagination (Base64 encoded {id: number})',
    required: false,
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}
