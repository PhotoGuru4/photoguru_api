import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RespondBookingDto } from './dto/respond-booking.dto';
import { AtGuard } from '../auth/guards/at.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { MESSAGES } from '../../common/constants/messages';
import { UserRole } from '@prisma/client';

@ApiTags('Bookings')
@ApiBearerAuth('access-token')
@Controller('bookings')
@UseGuards(AtGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking request' })
  async create(@Req() req: RequestWithUser, @Body() dto: CreateBookingDto) {
    const booking = await this.bookingsService.create(req.user.sub, dto);
    return { message: MESSAGES.BOOKING.CREATED, data: booking };
  }

  @Patch(':id/respond')
  @ApiOperation({ summary: 'Photographer accepts or rejects a booking' })
  async respond(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RespondBookingDto,
  ) {
    if (req.user.role !== UserRole.PHOTOGRAPHER) {
      throw new ForbiddenException(MESSAGES.BOOKING.UNAUTHORIZED);
    }
    const booking = await this.bookingsService.respond(id, req.user.sub, dto);
    return { message: MESSAGES.BOOKING.RESPONDED, data: booking };
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Customer marks booking as completed' })
  async complete(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const booking = await this.bookingsService.complete(id, req.user.sub);
    return { message: MESSAGES.BOOKING.COMPLETED, data: booking };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const booking = await this.bookingsService.findOne(id);
    return { message: MESSAGES.BOOKING.FETCH_SCHEDULES_SUCCESS, data: booking };
  }
}
