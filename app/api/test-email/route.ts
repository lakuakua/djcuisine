import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendAdminShippingNotificationEmail } from '@/lib/email/resend';

/**
 * Test Email Sending Endpoint
 * POST /api/test-email
 * 
 * Use this endpoint to test email sending functionality
 * Example request:
 * {
 *   "orderNumber": "ORD-10025",
 *   "customerEmail": "test@example.com",
 *   "orderTotal": 48000
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      orderNumber = 'ORD-TEST-001',
      customerEmail = 'test@example.com',
      orderTotal = 48000,
    } = body;

    console.log('[Email Test] Sending test emails for order:', orderNumber);

    // Send customer order confirmation email
    const customerEmailSent = await sendOrderConfirmationEmail({
      orderNumber,
      customerEmail,
      customerName: 'Test Customer',
      orderTotal,
      currency: 'usd',
      orderDate: new Date().toISOString(),
      items: [
        {
          name: 'Big Tray - Jollof Rice & Chicken',
          quantity: 1,
          unitPrice: 7500,
          totalPrice: 7500,
        },
        {
          name: 'Half Tray - Beef Pepper Soup',
          quantity: 2,
          unitPrice: 3500,
          totalPrice: 7000,
        },
        {
          name: 'Fresh Juice - Pineapple Ginger (1 Gallon)',
          quantity: 1,
          unitPrice: 2000,
          totalPrice: 2000,
        },
        {
          name: 'Plate - Grilled Fish with Plantain',
          quantity: 3,
          unitPrice: 1200,
          totalPrice: 3600,
        },
      ],
      handlingFee: 500,
      shippingCost: 2750,
    });

    // Send admin email
    const adminEmailSent = await sendAdminShippingNotificationEmail({
      orderNumber,
      customerEmail,
      orderTotal,
      currency: 'usd',
    });

    console.log('[Email Test] Customer email:', customerEmailSent ? '✅ SENT' : '❌ FAILED');
    console.log('[Email Test] Admin email:', adminEmailSent ? '✅ SENT' : '❌ FAILED');

    return NextResponse.json({
      success: customerEmailSent && adminEmailSent,
      results: {
        customerEmail: {
          sent: customerEmailSent,
          to: customerEmail,
          type: 'Order Confirmation',
        },
        adminEmail: {
          sent: adminEmailSent,
          type: 'Admin Alert',
        },
        order: {
          orderNumber,
          total: `$${(orderTotal / 100).toFixed(2)}`,
          message: 'Order confirmation sent (no tracking - shipping notification comes later)',
        },
      },
    });
  } catch (error) {
    console.error('[Email Test] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
