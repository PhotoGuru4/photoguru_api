import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      this.logger.error('SENDGRID_API_KEY is not set');
    } else {
      sgMail.setApiKey(apiKey);
    }
  }

  async sendBookingRequestToPhotographer(
    photographerEmail: string,
    booking: any,
  ) {
    const msg = {
      to: photographerEmail,
      from: {
        email: process.env.FROM_EMAIL || 'tramh7879@gmail.com',
        name: process.env.FROM_NAME || 'PhotoGuru',
      },
      subject: 'New Booking Request',
      html: this.getBookingRequestTemplate(booking),
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Email sent to photographer ${photographerEmail}`);
    } catch (error) {
      this.logger.error('Failed to send email to photographer', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const sgError = error as any;
        if (sgError.response) {
          console.error('SendGrid error response:', sgError.response.body);
        }
      }
    }
  }

  async sendBookingStatusToCustomer(
    customerEmail: string,
    booking: any,
    status: string,
  ) {
    const subject =
      status === 'CONFIRMED' ? 'Booking Confirmed!' : 'Booking Rejected';
    const msg = {
      to: customerEmail,
      from: {
        email: process.env.FROM_EMAIL || 'tramh7879@gmail.com',
        name: process.env.FROM_NAME || 'PhotoGuru',
      },
      subject,
      html: this.getBookingStatusTemplate(booking, status),
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Email sent to customer ${customerEmail}`);
    } catch (error) {
      this.logger.error('Failed to send email to customer', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const sgError = error as any;
        if (sgError.response) {
          console.error('SendGrid error response:', sgError.response.body);
        }
      }
    }
  }

  private getBookingRequestTemplate(booking: any): string {
    return `
      <h2>You have a new booking request!</h2>
      <p><strong>Customer:</strong> ${booking.client?.fullName}</p>
      <p><strong>Concept:</strong> ${booking.concept?.name}</p>
      <p><strong>Package:</strong> ${booking.package?.tier}</p>
      <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${new Date(booking.bookingDate).toLocaleTimeString()}</p>
      <p><strong>Address:</strong> ${booking.address}</p>
      <p>Please log in to your dashboard to accept or reject this booking.</p>
      <a href="${process.env.WEB_URL}/dashboard/bookings/${booking.id}">View Booking</a>
    `;
  }

  private getBookingStatusTemplate(booking: any, status: string): string {
    const message =
      status === 'CONFIRMED'
        ? 'Your booking has been confirmed. We look forward to seeing you!'
        : 'Unfortunately, your booking request was rejected. Please try another time or photographer.';

    return `
      <h2>${status === 'CONFIRMED' ? 'Booking Confirmed!' : 'Booking Rejected'}</h2>
      <p>${message}</p>
      <p><strong>Concept:</strong> ${booking.concept?.name}</p>
      <p><strong>Package:</strong> ${booking.package?.tier}</p>
      <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${new Date(booking.bookingDate).toLocaleTimeString()}</p>
      <p><strong>Address:</strong> ${booking.address}</p>
      <a href="${process.env.APP_SCHEME}://chat/${booking.id}">Open in App</a>
    `;
  }
}
