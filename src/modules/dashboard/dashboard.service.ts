import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GetDashboardDto } from './dto/get-dashboard.dto';
import { MESSAGES } from 'src/common/constants/messages';
import { TIME } from 'src/common/constants/time.constants';
import { BookingStatus, UserRole, Prisma } from '@prisma/client';
import { ConceptPackageInfo } from './interfaces/dashboard.interface';
import {
  getStartOfDay,
  getEndOfDay,
  getStartOfMonth,
  getEndOfMonth,
} from 'src/common/helpers/date.helper';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  private async ensurePhotographer(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || user.role !== UserRole.PHOTOGRAPHER) {
      throw new ForbiddenException(MESSAGES.AUTH.ACCESS_DENIED);
    }
    return user;
  }

  private resolveBookingDuration(
    packages: ConceptPackageInfo[],
    totalPrice: Prisma.Decimal | number | null,
  ): number {
    const DEFAULT_DURATION = TIME.DEFAULT_BOOKING_DURATION_MINUTES;
    if (!packages.length) return DEFAULT_DURATION;

    const priceDecimal =
      totalPrice instanceof Prisma.Decimal
        ? totalPrice
        : new Prisma.Decimal(totalPrice ?? 0);

    const matchedPackage = packages.find((pkg) =>
      new Prisma.Decimal(pkg.price).equals(priceDecimal),
    );

    if (matchedPackage?.estimatedDuration) {
      return matchedPackage.estimatedDuration;
    }

    const maxDuration = Math.max(
      ...packages.map((pkg) => pkg.estimatedDuration ?? DEFAULT_DURATION),
    );
    return maxDuration;
  }

  private async syncBookingStatuses(photographerId: number): Promise<void> {
    const now = new Date();

    const activeBookings = await this.prisma.booking.findMany({
      where: {
        photographerId,
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.INPROGRESS],
        },
      },
      include: {
        concept: {
          include: {
            packages: true,
          },
        },
      },
    });

    for (const booking of activeBookings) {
      const startTime = new Date(booking.bookingDate);
      const durationMinutes = this.resolveBookingDuration(
        booking.concept?.packages ?? [],
        booking.totalPrice,
      );
      const endTime = new Date(
        startTime.getTime() + durationMinutes * TIME.MILLISECONDS_PER_MINUTE,
      );

      let newStatus = booking.status;
      if (now >= startTime && now < endTime) {
        newStatus = BookingStatus.INPROGRESS;
      } else if (now >= endTime) {
        newStatus = BookingStatus.COMPLETED;
      }

      if (newStatus !== booking.status) {
        await this.prisma.booking.update({
          where: { id: booking.id },
          data: { status: newStatus },
        });
      }
    }
  }

  async getDashboardSummary(userId: number) {
    const user = await this.ensurePhotographer(userId);
    await this.syncBookingStatuses(userId);

    const now = new Date();
    const startOfToday = getStartOfDay(now);
    const endOfToday = getEndOfDay(now);
    const startOfThisMonth = getStartOfMonth(now.getFullYear(), now.getMonth());
    const endOfThisMonth = getEndOfMonth(now.getFullYear(), now.getMonth());

    const [todayBookings, monthBookings] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          photographerId: userId,
          status: BookingStatus.COMPLETED,
          bookingDate: { gte: startOfToday, lte: endOfToday },
        },
        select: { totalPrice: true },
      }),
      this.prisma.booking.findMany({
        where: {
          photographerId: userId,
          status: BookingStatus.COMPLETED,
          bookingDate: { gte: startOfThisMonth, lte: endOfThisMonth },
        },
        select: { totalPrice: true },
      }),
    ]);

    const firstName = user.fullName.split(' ').pop() ?? user.fullName;

    return {
      message: MESSAGES.DASHBOARD.FETCH_SUCCESS,
      data: {
        greetingName: firstName,
        avatarUrl: user.avatarUrl,
        earnings: {
          today: todayBookings.reduce(
            (sum, b) => sum + (b.totalPrice?.toNumber() ?? 0),
            0,
          ),
          thisMonth: monthBookings.reduce(
            (sum, b) => sum + (b.totalPrice?.toNumber() ?? 0),
            0,
          ),
        },
      },
    };
  }

  async getDashboardSchedules(userId: number, query: GetDashboardDto) {
    await this.ensurePhotographer(userId);
    await this.syncBookingStatuses(userId);

    const now = new Date();
    const targetMonth =
      query.month !== undefined ? query.month - 1 : now.getMonth();
    const targetYear = query.year ?? now.getFullYear();

    const startOfCalendar = getStartOfMonth(targetYear, targetMonth);
    const endOfCalendar = getEndOfMonth(targetYear, targetMonth);

    const schedules = await this.prisma.booking.findMany({
      where: {
        photographerId: userId,
        bookingDate: { gte: startOfCalendar, lte: endOfCalendar },
        status: {
          in: [
            BookingStatus.CONFIRMED,
            BookingStatus.INPROGRESS,
            BookingStatus.COMPLETED,
          ],
        },
      },
      select: {
        id: true,
        bookingDate: true,
        status: true,
        totalPrice: true,
        client: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        concept: {
          select: {
            id: true,
            name: true,
            packages: { select: { price: true, estimatedDuration: true } },
          },
        },
      },
      orderBy: { bookingDate: 'asc' },
    });

    return {
      message: MESSAGES.DASHBOARD.FETCH_SUCCESS,
      data: {
        month: targetMonth + 1,
        year: targetYear,
        schedules: schedules.map((s) => ({
          id: s.id,
          date: s.bookingDate,
          estimatedDuration: this.resolveBookingDuration(
            s.concept?.packages ?? [],
            s.totalPrice,
          ),
          status: s.status,
          totalPrice: s.totalPrice?.toNumber() ?? 0,
          clientName: s.client.fullName,
          clientAvatar: s.client.avatarUrl,
          conceptName: s.concept.name,
        })),
      },
    };
  }
}
