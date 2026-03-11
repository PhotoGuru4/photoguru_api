import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
import { MESSAGES } from 'src/common/constants/messages';

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
    const durationInMinutes = pkg.estimatedDuration || 60;
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        photographerId,
        bookingDate: { gte: startOfDay, lte: endOfDay },
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
      },
      include: { package: true },
    });
    const WORK_START_HOUR = 5;
    const WORK_END_HOUR = 18;
    const slots: GeneratedSlot[] = [];

    let currentMoment = new Date(startOfDay);
    currentMoment.setUTCHours(WORK_START_HOUR, 0, 0, 0);

    const workEndTime = new Date(startOfDay);
    workEndTime.setUTCHours(WORK_END_HOUR, 0, 0, 0);

    while (
      currentMoment.getTime() + durationInMinutes * 60000 <=
      workEndTime.getTime()
    ) {
      const slotStart = new Date(currentMoment);
      const slotEnd = new Date(
        currentMoment.getTime() + durationInMinutes * 60000,
      );

      const isOverlapped = existingBookings.some((booking) => {
        const bStart = new Date(booking.bookingDate);
        const bDuration = booking.package?.estimatedDuration || 60;
        const bEnd = new Date(bStart.getTime() + bDuration * 60000);
        return slotStart < bEnd && slotEnd > bStart;
      });

      slots.push({
        startTime: this.formatTimeToHHmm(slotStart),
        endTime: this.formatTimeToHHmm(slotEnd),
        isAvailable: !isOverlapped,
      });
      currentMoment = new Date(
        currentMoment.getTime() + durationInMinutes * 60000,
      );
    }

    return slots;
  }

  private formatTimeToHHmm(date: Date): string {
    return (
      date.getUTCHours().toString().padStart(2, '0') +
      ':' +
      date.getUTCMinutes().toString().padStart(2, '0')
    );
  }
}
