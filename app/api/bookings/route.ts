import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventType: string;
  guestCount: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: BookingData = await request.json();

    // Validate required fields
    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.eventDate ||
      !data.eventType ||
      !data.guestCount
    ) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Format the booking details for email
    const bookingDetails = `
New Booking Request from DJCUISINE Website

Customer Details:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}

Event Details:
- Event Type: ${data.eventType}
- Event Date: ${data.eventDate}
- Number of Guests: ${data.guestCount}

Additional Details:
${data.message || 'No additional details provided'}

---
This booking request was submitted on ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT
    `.trim();

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_ORDER_EMAIL;
    
    if (adminEmail && resend) {
      try {
        await resend.emails.send({
          from: process.env.ORDER_EMAIL_FROM || 'DJCUISINE <orders@djcuisine.com>',
          to: adminEmail,
          subject: `New Booking Request: ${data.eventType} - ${data.name}`,
          text: bookingDetails,
        });
      } catch (emailError) {
        console.error('Failed to send booking notification email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Send confirmation email to customer
    if (resend) {
      try {
        await resend.emails.send({
          from: process.env.ORDER_EMAIL_FROM || 'DJCUISINE <orders@djcuisine.com>',
          to: data.email,
          subject: 'Booking Request Received - DJCUISINE',
          text: `
Dear ${data.name},

Thank you for your booking request with DJCUISINE!

We have received your request for a ${data.eventType} on ${data.eventDate} for ${data.guestCount} guests.

Our team will review your request and contact you within 24 hours to confirm details and provide a quote.

If you have any immediate questions, please call us at (979) 221-3114 or reply to this email.

Best regards,
DJCUISINE Team
The Best BBQ in H-Town

---
Event Details:
- Event Type: ${data.eventType}
- Event Date: ${data.eventDate}
- Number of Guests: ${data.guestCount}
${data.message ? `- Your Message: ${data.message}` : ''}
          `.trim(),
        });
      } catch (emailError) {
        console.error('Failed to send customer confirmation email:', emailError);
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Booking request submitted successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking request' },
      { status: 500 }
    );
  }
}
