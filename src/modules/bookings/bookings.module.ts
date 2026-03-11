import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { MailModule } from 'src/shared/mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
