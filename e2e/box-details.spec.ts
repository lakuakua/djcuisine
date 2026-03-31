import { test, expect } from '@playwright/test';

test('displays box details when getting shipping rates', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  // Add item to cart
  await page.click('text=Shop Now');
  await page.click('text=Chicken Leg & Thighs');
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
  
  // Wait for rates to load
  await page.waitForSelector('text=Choose speed', { timeout: 10000 });
  
  // Check for box details
  const boxDetailsHeader = await page.locator('text=📦 Box Details');
  expect(boxDetailsHeader).toBeVisible();
  
  // Verify box details text
  const boxDetailsSection = page.locator('text=Box Details').locator('..');
  const text = await boxDetailsSection.textContent();
  expect(text).toContain('box');
  
  console.log('✅ Box details displayed successfully');
});
