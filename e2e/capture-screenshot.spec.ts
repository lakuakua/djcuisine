import { test } from '@playwright/test';

test('capture box details screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  // Add item to cart
  await page.click('text=Shop Now');
  await page.click('text=Chicken');
  await page.click('button:has-text("Add to Cart")');
  
  // Go to checkout
  await page.click('[aria-label="Open cart"]');
  await page.click('text=Checkout');
  
  // Fill address form
  await page.fill('input[autocomplete="given-name"]', 'John');
  await page.fill('input[autocomplete="family-name"]', 'Doe');
  await page.fill('input[autocomplete="street-address"]', '123 Main St');
  await page.fill('input[autocomplete="address-level2"]', 'Richmond');
  await page.fill('input[autocomplete="postal-code"]', '77403');
  await page.fill('input[autocomplete="tel"]', '346-280-0862');
  
  // Get shipping rates
  await page.click('button:has-text("Get shipping rates")');
  
  // Wait for box details to appear
  await page.waitForSelector('text=📦 Box Details', { timeout: 15000 });
  
  // Take full page screenshot
  await page.screenshot({ path: '/tmp/box-details-screenshot.png', fullPage: true });
  
  console.log('✅ Screenshot saved to /tmp/box-details-screenshot.png');
});
