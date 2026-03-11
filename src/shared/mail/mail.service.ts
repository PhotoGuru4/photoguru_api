import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  async sendBookingRequestToPhotographer(
    photographerEmail: string,
    booking: any,
  ) {
    const mailOptions = {
      from: '"PhotoGuru" <noreply@photoguru.com>',
      to: photographerEmail,
      subject: 'New Booking Request',
      html: `
        <h2>You have a new booking request!</h2>
        <p><strong>Customer:</strong> ${booking.client.fullName}</p>
        <p><strong>Concept:</strong> ${booking.concept.name}</p>
        <p><strong>Package:</strong> ${booking.package.tier}</p>
        <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(booking.bookingDate).toLocaleTimeString()}</p>
        <p><strong>Address:</strong> ${booking.address}</p>
        <p>Please log in to your dashboard to accept or reject this booking.</p>
        <a href="${process.env.WEB_URL}/dashboard/bookings/${booking.id}">View Booking</a>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to photographer ${photographerEmail}`);
    } catch (error) {
      this.logger.error('Failed to send email', error);
    }
  }

  async sendBookingStatusToCustomer(
    customerEmail: string,
    booking: any,
    status: string,
  ) {
    const subject =
      status === 'CONFIRMED' ? 'Booking Confirmed!' : 'Booking Rejected';
    const message =
      status === 'CONFIRMED'
        ? 'Your booking has been confirmed. We look forward to seeing you!'
        : 'Unfortunately, your booking request was rejected. Please try another time or photographer.';

    const mailOptions = {
      from: '"PhotoGuru" <noreply@photoguru.com>',
      to: customerEmail,
      subject,
      html: `
        <h2>${subject}</h2>
        <p>${message}</p>
        <p><strong>Concept:</strong> ${booking.concept.name}</p>
        <p><strong>Package:</strong> ${booking.package.tier}</p>
        <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(booking.bookingDate).toLocaleTimeString()}</p>
        <p><strong>Address:</strong> ${booking.address}</p>
        <a href="${process.env.APP_SCHEME}://chat/${booking.id}">Open in App</a>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to customer ${customerEmail}`);
    } catch (error) {
      this.logger.error('Failed to send email', error);
    }
  }
}
