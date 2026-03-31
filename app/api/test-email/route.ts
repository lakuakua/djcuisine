import { NextRequest, NextResponse } from 'next/server';
import { sendShippingNotificationEmail, sendAdminShippingNotificationEmail } from '@/lib/email/resend';

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

    // Send customer email
    const customerEmailSent = await sendShippingNotificationEmail({
      orderNumber,
      customerEmail,
      customerName: 'Test Customer',
      orderTotal,
      currency: 'usd',
      trackingNumber: '1Z999AA10123456784',
      carrier: 'UPS',
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
      shippingAddress: {
        name: 'Test Customer',
        line1: '3043 Narrow Stream Way',
        city: 'Katy',
        state: 'TX',
        postal_code: '77493',
      },
    });

    // Send admin email
    const adminEmailSent = await sendAdminShippingNotificationEmail({
      orderNumber,
      customerEmail,
      orderTotal,
      currency: 'usd',
      carrier: 'UPS',
      trackingNumber: '1Z999AA10123456784',
    });

    console.log('[Email Test] Customer email:', customerEmailSent ? '✅ SENT' : '❌ FAILED');
    console.log('[Email Test] Admin email:', adminEmailSent ? '✅ SENT' : '❌ FAILED');

    return NextResponse.json({
      success: customerEmailSent && adminEmailSent,
      results: {
        customerEmail: {
          sent: customerEmailSent,
          to: customerEmail,
          type: 'Shipping Notification',
        },
        adminEmail: {
          sent: adminEmailSent,
          type: 'Admin Alert',
        },
        order: {
          orderNumber,
          total: `$${(orderTotal / 100).toFixed(2)}`,
          tracking: '1Z999AA10123456784',
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
