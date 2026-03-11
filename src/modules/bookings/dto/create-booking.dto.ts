import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  conceptId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  packageId: number;

  @ApiProperty({ example: '2026-03-11T10:30:00.000Z' })
  @IsString()
  @IsNotEmpty()
  bookingDate: string;

  @ApiProperty({ example: 'Hoàn Kiếm, Hà Nội City' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Looking forward to it!', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
