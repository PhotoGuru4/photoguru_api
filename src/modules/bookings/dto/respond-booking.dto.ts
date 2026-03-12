import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class RespondBookingDto {
  @ApiProperty({ enum: [BookingStatus.CONFIRMED, BookingStatus.REJECTED] })
  @IsEnum([BookingStatus.CONFIRMED, BookingStatus.REJECTED])
  @IsNotEmpty()
  status: typeof BookingStatus.CONFIRMED | typeof BookingStatus.REJECTED;
}
