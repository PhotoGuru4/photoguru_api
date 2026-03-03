import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeImageDto {
  @ApiProperty({
    description: 'Base64 encoded image (JPEG/PNG)',
    example: '/9j/4AAQSkZJRgABAQAAAQABAAD...',
  })
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Optional context (e.g., "portrait", "wedding", "family")',
    required: false,
    example: 'portrait',
  })
  @IsOptional()
  @IsString()
  context?: string;
}
