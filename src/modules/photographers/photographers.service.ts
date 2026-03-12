import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
import { MESSAGES } from 'src/common/constants/messages';
import { TIME } from 'src/common/constants/time.constants';
import { getDateRange } from 'src/common/helpers/date.helper';

export interface GeneratedSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

@Injectable()
export class PhotographersService {
  constructor(private prisma: PrismaService) {}

  async generateDynamicSlots(
    photographerId: number,
    date: string,
    packageId: number,
  ): Promise<GeneratedSlot[]> {
    const pkg = await this.prisma.conceptPackage.findUnique({
      where: { id: packageId },
    });

    if (!pkg) throw new NotFoundException(MESSAGES.CONCEPT.PACKAGE_NOT_FOUND);

    const durationInMinutes =
      pkg.estimatedDuration || TIME.DEFAULT_SLOT_DURATION_MINUTES;
    const { startOfDay, endOfDay } = getDateRange(date);

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        photographerId,
        bookingDate: { gte: startOfDay, lte: endOfDay },
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
      },
      include: { package: true },
    });

    const slots: GeneratedSlot[] = [];
    const durationInMs = durationInMinutes * TIME.MILLISECONDS_PER_MINUTE;

    let currentMoment = new Date(startOfDay);
    currentMoment.setUTCHours(TIME.WORK_HOURS.START, 0, 0, 0);

    const workEndTime = new Date(startOfDay);
    workEndTime.setUTCHours(TIME.WORK_HOURS.END, 0, 0, 0);

    while (currentMoment.getTime() + durationInMs <= workEndTime.getTime()) {
      const slotStart = new Date(currentMoment);
      const slotEnd = new Date(currentMoment.getTime() + durationInMs);

      const isOverlapped = existingBookings.some((booking) => {
        const bStart = new Date(booking.bookingDate);
        const bDuration =
          booking.package?.estimatedDuration ||
          TIME.DEFAULT_SLOT_DURATION_MINUTES;
        const bDurationInMs = bDuration * TIME.MILLISECONDS_PER_MINUTE;
        const bEnd = new Date(bStart.getTime() + bDurationInMs);

        return slotStart < bEnd && slotEnd > bStart;
      });

      slots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        isAvailable: !isOverlapped,
      });

      currentMoment = new Date(currentMoment.getTime() + durationInMs);
    }

    return slots;
  }
}
