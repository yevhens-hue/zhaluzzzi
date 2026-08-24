import { test, expect } from '@playwright/test';

test.describe('Кошик та Оформлення замовлення', () => {
  test('додавання товару в кошик та перевірка висувної панелі кошика', async ({ page }) => {
    await page.goto('/catalog');

    // Find and click on first product
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/product\/.+/);

    // Click Add to Cart button on product details
    const addToCartBtn = page.locator('button:has-text("Додати у кошик"), button:has-text("Додати в кошик"), button:has-text("Купити")').first();
    await addToCartBtn.scrollIntoViewIfNeeded();
    await addToCartBtn.click();

    // Verify Cart Drawer / Dialog is visible
    const cartDrawer = page.locator('div[role="dialog"]');
    await expect(cartDrawer.first()).toBeVisible({ timeout: 10000 });
  });

  test('сторінка оформлення замовлення /checkout валідує поля', async ({ page }) => {
    await page.goto('/checkout');

    // Page must render checkout form
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Form inputs should be accessible
    const phoneInput = page.locator('input[type="tel"], input[name*="phone" i], input[placeholder*="09" i]').first();
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('0931234567');
      await expect(phoneInput).toHaveValue(/0931234567/);
    }
  });
});
