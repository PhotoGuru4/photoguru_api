import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);
  private readonly defaultFrom = '"PhotoGuru" <noreply@photoguru.com>';
  private readonly defaultSmtpPort = 587;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT) || this.defaultSmtpPort,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  private async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: this.defaultFrom,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent successfully to ${to} [${subject}]`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
    }
  }

  async sendBookingRequestToPhotographer(
    photographerEmail: string,
    booking: any,
  ) {
    const subject = 'New Booking Request';
    const html = `
        <h2>You have a new booking request!</h2>
        <p><strong>Customer:</strong> ${booking.client.fullName}</p>
        <p><strong>Concept:</strong> ${booking.concept.name}</p>
        <p><strong>Package:</strong> ${booking.package.tier}</p>
        <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(booking.bookingDate).toLocaleTimeString()}</p>
        <p><strong>Address:</strong> ${booking.address}</p>
        <p>Please log in to your dashboard to accept or reject this booking.</p>
        <a href="${process.env.WEB_URL}/dashboard/bookings/${booking.id}">View Booking</a>
      `;

    await this.sendMail(photographerEmail, subject, html);
  }

  async sendBookingStatusToCustomer(
    customerEmail: string,
    booking: any,
    status: string,
  ) {
    const isConfirmed = status === 'CONFIRMED';
    const subject = isConfirmed ? 'Booking Confirmed!' : 'Booking Rejected';
    const message = isConfirmed
      ? 'Your booking has been confirmed. We look forward to seeing you!'
      : 'Unfortunately, your booking request was rejected. Please try another time or photographer.';

    const html = `
        <h2>${subject}</h2>
        <p>${message}</p>
        <p><strong>Concept:</strong> ${booking.concept.name}</p>
        <p><strong>Package:</strong> ${booking.package.tier}</p>
        <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(booking.bookingDate).toLocaleTimeString()}</p>
        <p><strong>Address:</strong> ${booking.address}</p>
        <a href="${process.env.APP_SCHEME}://chat/${booking.id}">Open in App</a>
      `;

    await this.sendMail(customerEmail, subject, html);
  }
}
