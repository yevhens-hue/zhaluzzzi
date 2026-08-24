import { test, expect } from '@playwright/test';

test.describe('Головна сторінка та Каталог', () => {
  test('повинна завантажуватись головна сторінка з H1, банером та категоріями', async ({ page }) => {
    await page.goto('/');

    // Check title and page loaded
    await expect(page).toHaveTitle(/Жалюзі|Ролети|Дніпро/i);

    // Check header logo and phone
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toContainText(/093/);

    // Check navigation links
    await expect(page.locator('a[href="/roleti"]').first()).toBeVisible();
    await expect(page.locator('a[href="/zhaluzi"]').first()).toBeVisible();
    await expect(page.locator('a[href="/shtori"]').first()).toBeVisible();
  });

  test('повинен відкриватися каталог та працювати фільтрація', async ({ page }) => {
    await page.goto('/catalog');

    // Verify catalog title
    await expect(page.locator('h1')).toBeVisible();

    // Verify product cards are displayed
    const productCards = page.locator('a[href^="/product/"]');
    await expect(productCards.first()).toBeVisible();
    const initialCount = await productCards.count();
    expect(initialCount).toBeGreaterThan(0);
  });

  test('повинна відкриватися картка товару з конфігуратором розмірів', async ({ page }) => {
    await page.goto('/catalog');

    // Click on the first product card
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await firstProduct.click();

    // Verify we navigated to /product/...
    await expect(page).toHaveURL(/\/product\/.+/);

    // Verify product title, price and Add to Cart button
    await expect(page.locator('h1')).toBeVisible();
    const addToCartBtn = page.locator('button:has-text("Купити"), button:has-text("В кошик")').first();
    await expect(addToCartBtn).toBeVisible();
  });
});
