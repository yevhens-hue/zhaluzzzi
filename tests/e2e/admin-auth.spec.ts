import { test, expect } from '@playwright/test';

test.describe('Панель адміністратора /admin', () => {
  test('показує форму авторизації при першому переході', async ({ page }) => {
    await page.goto('/admin');

    await expect(page.locator('#admin-login-input')).toBeVisible();
    await expect(page.locator('#admin-password-input')).toBeVisible();
  });

  test('блокує вхід при введенні неправильного пароля', async ({ page }) => {
    await page.goto('/admin');

    await page.locator('#admin-login-input').fill('admin');
    await page.locator('#admin-password-input').fill('wrongpassword123');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Verify staying on login screen with password input still visible
    await expect(page.locator('#admin-password-input')).toBeVisible();
  });

  test('успішний вхід з валідними обліковими даними', async ({ page }) => {
    await page.goto('/admin');

    await page.locator('#admin-login-input').fill('admin');
    await page.locator('#admin-password-input').fill('Dnipro2026!');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // After success, navigation header / tabs should be visible
    const headerTitle = page.locator('h1:has-text("Панель"), button:has-text("Замовлення"), button:has-text("Товари")').first();
    await expect(headerTitle).toBeVisible({ timeout: 12000 });
  });
});
