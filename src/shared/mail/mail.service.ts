import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

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

  private formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  private formatTimeRange(
    start: Date | string,
    durationMinutes: number,
  ): string {
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${this.formatTime(startDate)} – ${this.formatTime(endDate)}`;
  }

  private getBookingRequestTemplate(booking: any): string {
    const startTime = new Date(booking.bookingDate);
    const duration = booking.package?.estimatedDuration || 60;
    const timeRange = this.formatTimeRange(startTime, duration);
    const dateStr = this.formatDate(startTime);
    const photographerName =
      booking.concept?.photographer?.user?.fullName || 'Photographer';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
            .header { background-color: #E06B80; color: white; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; display:flex; align-items:center; justify-content:center; gap:8px; }
            .content { padding: 30px; background-color: white; }
            .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
            .info-label { font-weight: bold; width: 120px; color: #555; }
            .info-value { flex: 1; color: #333; }
            .package-details { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background-color: #E06B80; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; padding: 20px; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7
                  a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                New Booking Request
              </h1>
            </div>

            <div class="content">
              <p>Hello ${photographerName},</p>

              <p>You have received a new booking request from 
              <strong>${booking.client?.fullName}</strong>.</p>

              <div class="package-details">
                <h3 style="margin-top:0;color:#E06B80;">
                  ${booking.concept?.name} – Package ${booking.package?.tier}
                </h3>

                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${dateStr}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Time:</span>
                  <span class="info-value">${timeRange}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Location:</span>
                  <span class="info-value">${booking.address}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Price:</span>
                  <span class="info-value">${booking.totalPrice?.toString() || 'N/A'} VND</span>
                </div>

                ${
                  booking.note
                    ? `<div class="info-row">
                        <span class="info-label">Note:</span>
                        <span class="info-value">${booking.note}</span>
                      </div>`
                    : ''
                }
              </div>

              <p style="text-align:center;">
                <a href="${process.env.WEB_URL}/dashboard/bookings/${booking.id}" class="button" style="color: white;">
                  View and Respond
                </a>
              </p>

              <p style="color:#777;font-size:14px;">
                You can accept or reject this request from your dashboard.
              </p>
            </div>

            <div class="footer">
              &copy; ${new Date().getFullYear()} PhotoGuru. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getBookingStatusTemplate(booking: any, status: string): string {
    const isConfirmed = status === 'CONFIRMED';

    const startTime = new Date(booking.bookingDate);
    const duration = booking.package?.estimatedDuration || 60;
    const timeRange = this.formatTimeRange(startTime, duration);
    const dateStr = this.formatDate(startTime);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
            .header { background-color: ${isConfirmed ? '#10b981' : '#ef4444'}; color: white; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; background-color: white; }
            .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
            .info-label { font-weight: bold; width: 120px; color: #555; }
            .info-value { flex: 1; color: #333; }
            .package-details { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background-color: #E06B80; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; padding: 20px; background-color: #f9f9f9; }
          </style>
        </head>

        <body>
          <div class="email-container">

            <div class="header">
              <h1>
                ${isConfirmed ? 'Booking Confirmed' : 'Booking Rejected'}
              </h1>
            </div>

            <div class="content">

              <p>Hello ${booking.client?.fullName},</p>

              <p>
              ${
                isConfirmed
                  ? 'Your photoshoot booking has been confirmed. We look forward to seeing you!'
                  : 'Unfortunately, your booking request was rejected. Please try another time or contact the photographer.'
              }
              </p>

              <div class="package-details">

                <h3 style="margin-top:0;color:#E06B80;">
                  ${booking.concept?.name} – Package ${booking.package?.tier}
                </h3>

                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">${dateStr}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Time:</span>
                  <span class="info-value">${timeRange}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Location:</span>
                  <span class="info-value">${booking.address}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Price:</span>
                  <span class="info-value">${booking.totalPrice?.toString() || 'N/A'} VND</span>
                </div>

              </div>

              <p style="text-align:center;">
                <a href="${process.env.APP_SCHEME}://chat/${booking.id}" class="button">
                  Open Chat
                </a>
              </p>

              <p style="color:#777;font-size:14px;">
                You can view details and chat with the photographer in the app.
              </p>

            </div>

            <div class="footer">
              &copy; ${new Date().getFullYear()} PhotoGuru. All rights reserved.
            </div>

          </div>
        </body>
      </html>
    `;
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
      throw error;
    }
  }

  async sendBookingStatusToCustomer(
    customerEmail: string,
    booking: any,
    status: string,
  ) {
    const subject =
      status === 'CONFIRMED' ? 'Booking Confirmed' : 'Booking Rejected';

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
      throw error;
    }
  }
}
