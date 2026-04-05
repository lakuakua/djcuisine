/**
 * Email Notification Tests
 * Tests for shipping notification emails
 */

import { buildShippingNotificationEmail } from '@/lib/email/templates/shippingNotification';

describe('Email Notifications', () => {
  describe('buildShippingNotificationEmail', () => {
    it('should generate email with all fields', () => {
      const data = {
        orderNumber: 'ORD-10025',
        customerName: 'Alex Smith',
        orderTotal: 48000, // $480.00
        currency: 'usd',
        trackingNumber: '1Z999AA10123456784',
        carrier: 'UPS',
        estimatedDeliveryDate: '2026-04-02',
        orderDate: '2026-03-29',
        shippingAddress: {
          name: 'Alex Smith',
          line1: '123 Main Street',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
        },
      };

      const { html, text } = buildShippingNotificationEmail(data);

      // Verify HTML output
      expect(html).toContain('Your Order Has Shipped');
      expect(html).toContain('ORD-10025');
      expect(html).toContain('1Z999AA10123456784');
      expect(html).toContain('UPS');
      expect(html).toContain('$480.00');
      expect(html).toContain('Alex Smith');
      expect(html).toContain('123 Main Street');
      expect(html).toContain('2026-04-02');
      expect(html).toContain('perishable');
      expect(html).toContain('<!DOCTYPE html>');

      // Verify plain text output
      expect(text).toContain('Your Order Has Shipped');
      expect(text).toContain('ORD-10025');
      expect(text).toContain('1Z999AA10123456784');
      expect(text).toContain('UPS');
      expect(text).toContain('$480.00');
      expect(text).toContain('123 Main Street');
    });

    it('should handle missing optional fields', () => {
      const data = {
        orderNumber: 'ORD-10026',
        orderTotal: 25000, // $250.00
        currency: 'usd',
        orderDate: '2026-03-29',
      };

      const { html, text } = buildShippingNotificationEmail(data);

      // Should not crash with missing fields
      expect(html).toContain('ORD-10026');
      expect(html).toContain('$250.00');
      expect(text).toContain('ORD-10026');
      expect(text).toContain('$250.00');

      // Should handle missing address gracefully
      expect(html).toContain('Address not available');
    });

    it('should format currency correctly for USD', () => {
      const data = {
        orderNumber: 'ORD-10027',
        orderTotal: 1500, // $15.00
        currency: 'usd',
        orderDate: '2026-03-29',
      };

      const { html, text } = buildShippingNotificationEmail(data);

      expect(html).toContain('$15.00');
      expect(text).toContain('$15.00');
    });

    it('should format large order amounts', () => {
      const data = {
        orderNumber: 'ORD-10028',
        orderTotal: 500000, // $5,000.00
        currency: 'usd',
        orderDate: '2026-03-29',
      };

      const { html, text } = buildShippingNotificationEmail(data);

      expect(html).toContain('$5,000.00');
      expect(text).toContain('$5,000.00');
    });

    it('should include carrier tracking link for UPS', () => {
      const data = {
        orderNumber: 'ORD-10029',
        orderTotal: 35000,
        currency: 'usd',
        trackingNumber: '1Z123456789',
        carrier: 'UPS',
        orderDate: '2026-03-29',
      };

      const { html, text } = buildShippingNotificationEmail(data);

      // UPS tracking link should be included
      expect(html).toContain('ups');
      expect(text).toContain('1Z123456789');
    });

    it('should include delivery date when provided', () => {
      const data = {
        orderNumber: 'ORD-10030',
        orderTotal: 48000,
        currency: 'usd',
        estimatedDeliveryDate: '2026-04-05',
        orderDate: '2026-03-29',
      };

      const { html, text } = buildShippingNotificationEmail(data);

      expect(html).toContain('2026-04-05');
      expect(html).toContain('Estimated Delivery');
      expect(text).toContain('2026-04-05');
    });

    it('should include perishable notice in all emails', () => {
      const data = {
        orderNumber: 'ORD-10031',
        orderTotal: 48000,
        currency: 'usd',
        orderDate: '2026-03-29',
      };

      const { html, text } = buildShippingNotificationEmail(data);

      // Important perishable notice should be prominent
      expect(html.toLowerCase()).toContain('perishable');
      expect(html.toLowerCase()).toContain('receive');
      expect(html.toLowerCase()).toContain('refrigerator');
      expect(text.toLowerCase()).toContain('perishable');
    });

    it('should format address with all fields', () => {
      const data = {
        orderNumber: 'ORD-10032',
        orderTotal: 48000,
        currency: 'usd',
        orderDate: '2026-03-29',
        shippingAddress: {
          name: 'Jane Doe',
          line1: '456 Oak Avenue, Suite 200',
          city: 'Los Angeles',
          state: 'CA',
          postal_code: '90001',
        },
      };

      const { html, text } = buildShippingNotificationEmail(data);

      expect(html).toContain('Jane Doe');
      expect(html).toContain('456 Oak Avenue, Suite 200');
      expect(html).toContain('Los Angeles');
      expect(html).toContain('CA');
      expect(html).toContain('90001');
    });

    it('should include order summary section', () => {
      const data = {
        orderNumber: 'ORD-10033',
        orderTotal: 48000,
        currency: 'usd',
        orderDate: '2026-03-29',
      };

      const { html, text } = buildShippingNotificationEmail(data);

      // Order summary should be present
      expect(html).toContain('ORDER SUMMARY');
      expect(html).toContain('Order Date');
      expect(text).toContain('ORDER SUMMARY');
    });

    it('should include support contact information', () => {
      const data = {
        orderNumber: 'ORD-10034',
        orderTotal: 48000,
        currency: 'usd',
        orderDate: '2026-03-29',
      };

      const { html, text } = buildShippingNotificationEmail(data);

      // Support contact should be included
      expect(html.toLowerCase()).toContain('support');
      expect(text.toLowerCase()).toContain('support');
    });

    it('should produce valid HTML structure', () => {
      const data = {
        orderNumber: 'ORD-10035',
        orderTotal: 48000,
        currency: 'usd',
        orderDate: '2026-03-29',
      };

      const { html } = buildShippingNotificationEmail(data);

      // Valid HTML structure
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html>');
      expect(html).toContain('</html>');
      expect(html).toContain('<head>');
      expect(html).toContain('</head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</body>');

      // Balanced tags
      const openDivCount = (html.match(/<div/g) || []).length;
      const closeDivCount = (html.match(/<\/div>/g) || []).length;
      expect(openDivCount).toBe(closeDivCount);
    });

    it('should handle multiple shipments (idempotency)', () => {
      const data = {
        orderNumber: 'ORD-10036',
        orderTotal: 48000,
        currency: 'usd',
        trackingNumber: '1Z111111111111111111',
        orderDate: '2026-03-29',
      };

      const result1 = buildShippingNotificationEmail(data);
      const result2 = buildShippingNotificationEmail(data);

      // Should produce identical output for same input (idempotent)
      expect(result1.html).toBe(result2.html);
      expect(result1.text).toBe(result2.text);
    });
  });
});

// Types for Jest
declare global {
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function expect(value: any): any;
}
