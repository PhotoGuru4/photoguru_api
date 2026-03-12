import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { MailService } from '../../shared/mail/mail.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RespondBookingDto } from './dto/respond-booking.dto';
import { BookingStatus } from '@prisma/client';
import { MESSAGES } from '../../common/constants/messages';
import { getStartOfDay } from '../../common/helpers/date.helper';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(userId: number, dto: CreateBookingDto) {
    const concept = await this.prisma.concept.findUnique({
      where: { id: dto.conceptId },
      include: {
        photographer: {
          include: {
            user: {
              select: { email: true, fullName: true },
            },
          },
        },
        packages: true,
      },
    });

    if (!concept) throw new NotFoundException(MESSAGES.CONCEPT.NOT_FOUND);

    const selectedPackage = concept.packages.find(
      (p) => p.id === dto.packageId,
    );
    if (!selectedPackage)
      throw new BadRequestException(MESSAGES.CONCEPT.PACKAGE_NOT_FOUND);

    const booking = await this.prisma.booking.create({
      data: {
        clientId: userId,
        photographerId: concept.photographerId,
        conceptId: dto.conceptId,
        packageId: dto.packageId,
        bookingDate: new Date(dto.bookingDate),
        totalPrice: selectedPackage.price,
        address: dto.address,
        note: dto.note,
        status: BookingStatus.PENDING,
      },
      include: {
        concept: true,
        package: true,
        client: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });

    this.mailService
      .sendBookingRequestToPhotographer(
        concept.photographer.user.email,
        booking,
      )
      .catch((err) => {
        this.logger.error(
          MESSAGES.CONCEPT.FAILED_TO_SEND_EMAIL_TO_PHOTOGRAPHER,
          err,
        );
      });

    return booking;
  }

  async respond(
    bookingId: number,
    photographerId: number,
    dto: RespondBookingDto,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: { select: { email: true, fullName: true } },
        concept: true,
        package: true,
      },
    });

    if (!booking) throw new NotFoundException(MESSAGES.BOOKING.NOT_FOUND);
    if (booking.photographerId !== photographerId) {
      throw new ForbiddenException(MESSAGES.BOOKING.UNAUTHORIZED);
    }
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        MESSAGES.BOOKING.ONLY_PENDING_BOOKINGS_CAN_BE_RESPONDED,
      );
    }

    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      if (dto.status === BookingStatus.CONFIRMED) {
        const targetDate = getStartOfDay(booking.bookingDate);
        const overlappingBooking = await tx.booking.findFirst({
          where: {
            photographerId,
            bookingDate: booking.bookingDate,
            status: BookingStatus.CONFIRMED,
            id: { not: booking.id },
          },
        });

        if (overlappingBooking) {
          throw new BadRequestException(
            MESSAGES.BOOKING.NO_AVAILABLE_SCHEDULE_SLOT,
          );
        }
        await tx.photographerSchedule.create({
          data: {
            photographerId,
            availableDate: targetDate,
            startTime: booking.bookingDate,
            bookingId: booking.id,
          },
        });
      }

      return tx.booking.update({
        where: { id: bookingId },
        data: { status: dto.status },
        include: {
          client: { select: { email: true, fullName: true } },
          concept: true,
          package: true,
        },
      });
    });

    this.mailService
      .sendBookingStatusToCustomer(
        booking.client.email,
        updatedBooking,
        dto.status,
      )
      .catch((err) => {
        this.logger.error(
          MESSAGES.BOOKING.FAILED_TO_SEND_EMAIL_TO_CUSTOMER,
          err,
        );
      });

    return updatedBooking;
  }

  async complete(bookingId: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException(MESSAGES.BOOKING.NOT_FOUND);
    if (booking.clientId !== userId) {
      throw new ForbiddenException(MESSAGES.BOOKING.UNAUTHORIZED);
    }
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        MESSAGES.BOOKING.ONLY_CONFIRMED_BOOKINGS_CAN_BE_COMPLETED,
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
        isCompletedByCustomer: true,
      },
    });

    return updated;
  }

  async findOne(bookingId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        concept: { include: { packages: true } },
        package: true,
        client: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            email: true,
          },
        },
        photographer: {
          include: {
            user: {
              select: {
                fullName: true,
                avatarUrl: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!booking) throw new NotFoundException(MESSAGES.BOOKING.NOT_FOUND);

    return booking;
  }
}
