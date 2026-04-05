import * as path from 'path';
import { test, expect } from '@playwright/test';

/** Written on success for local review (see `test-results/`). */
export const SHIPPING_QUOTE_SCREENSHOT = 'test-results/checkout-shipping-quote.png';

/**
 * Browser E2E: shop → cart → checkout → shipping quote.
 *
 * Prerequisites: `.env.local` with Stripe/Easyship as for local dev (optional; fallback rates still exercise UI).
 *
 * Run:
 *   npm run test:e2e
 *   npm run test:e2e:ui
 *
 * Playwright starts `npm run dev` on :3000 unless a server is already there (`reuseExistingServer`).
 */

test.describe('Checkout — shipping rates', () => {
  test('adds chicken item, opens checkout, fills address, gets rates', async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto('/shop');

    await page.getByRole('button', { name: 'Chicken' }).click();
    await expect(page.getByText(/Showing \d+ product/)).toBeVisible();

    await page.getByRole('button', { name: 'Add' }).first().click();
    await page.getByRole('button', { name: 'Shopping cart' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await expect(page).toHaveURL(/\/checkout$/);

    // Labels are not wired with htmlFor/id — use autocomplete hooks (stable).
    await page.locator('input[autocomplete="email"]').fill('e2e-test@example.com');
    await page.locator('input[autocomplete="given-name"]').fill('Test');
    await page.locator('input[autocomplete="family-name"]').fill('Customer');
    await page.locator('input[autocomplete="address-line1"]').fill('7403 Audubon Russet Dr');
    await page.locator('input[autocomplete="address-level2"]').fill('Richmond');
    await page.locator('select[autocomplete="address-level1"]').selectOption('TX');
    await page.locator('input[autocomplete="postal-code"]').fill('77403');
    await page.locator('input[autocomplete="tel"]').fill('3462800862');

    await page.getByRole('button', { name: 'Get shipping rates' }).click();

    await expect(page.getByText('Choose speed')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByText('Boxes used for this shipping quote')).toBeVisible();
    await expect(page.getByText('UPS Ground').first()).toBeVisible();

    const shotPath = path.join(process.cwd(), SHIPPING_QUOTE_SCREENSHOT);
    await page.screenshot({ path: shotPath, fullPage: true });
    await test.info().attach('checkout-shipping-quote', {
      path: shotPath,
      contentType: 'image/png',
    });
  });
});
