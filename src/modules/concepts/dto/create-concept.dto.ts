import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
  IsNumber,
  Min,
  IsUrl,
} from 'class-validator';
import { ConceptTier } from '@prisma/client';

export class PackageLocationDto {
  @ApiProperty({ example: 'Thành Phố Hà Nội' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ example: 'Phường Ba Đình' })
  @IsString()
  @IsNotEmpty()
  ward: string;
}

export class CreatePackageDto {
  @ApiProperty({ enum: ConceptTier })
  @IsEnum(ConceptTier)
  tier: ConceptTier;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Min(1)
  estimatedDuration?: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  benefit: string[];

  @ApiProperty({ type: [PackageLocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageLocationDto)
  @ArrayMinSize(1)
  locations: PackageLocationDto[];
}

export class CreateConceptDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  categoryId: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://cloudinary.com/image.jpg' })
  @IsUrl()
  thumbnailUrl: string;

  @ApiProperty({ type: [String], example: ['https://cloudinary.com/img1.jpg'] })
  @IsArray()
  @IsUrl({}, { each: true })
  photoUrls: string[];

  @ApiProperty({ type: [CreatePackageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePackageDto)
  @ArrayMinSize(1)
  packages: CreatePackageDto[];
}
