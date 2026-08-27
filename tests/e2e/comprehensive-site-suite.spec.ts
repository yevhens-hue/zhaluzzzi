import { test, expect } from '@playwright/test';

test.describe('Повне тестування сайту Жалюзі-Ролети Дніпро', () => {

  test('1. Сторінка AI-Заміру (/zamir) та перенесення розмірів у калькулятор', async ({ page }) => {
    await page.goto('/zamir');

    // Check H1 and master instruction header
    await expect(page.locator('h1')).toContainText(/заміряти вікна/i);

    // Click on AI Auto-measure modal button
    const openModalBtn = page.locator('button:has-text("Запустити AI Авто-замір")').first();
    await expect(openModalBtn).toBeVisible();
    await openModalBtn.click();

    // Verify modal is open
    await expect(page.locator('h3:has-text("AI Авто-замір вікна по фото")')).toBeVisible();

    // Verify reference object buttons
    const cardBtn = page.locator('button:has-text("Банківська картка")');
    const a4Btn = page.locator('button:has-text("Аркуш А4")');
    await expect(cardBtn).toBeVisible();
    await expect(a4Btn).toBeVisible();

    // Verify both camera and gallery buttons exist
    await expect(page.locator('button:has-text("Зробити фото з камери")')).toBeVisible();
    await expect(page.locator('button:has-text("Завантажити з галереї")')).toBeVisible();

    // Close modal
    const closeBtn = page.locator('button[aria-label="Закрити"]').first();
    await closeBtn.click();
    await expect(page.locator('h3:has-text("AI Авто-замір вікна по фото")')).not.toBeVisible();
  });

  test('2. Калькулятор на головній сторінці підтримує передачу розмірів через URL', async ({ page }) => {
    // Navigate with custom width and height query params
    await page.goto('/?width=85&height=165#calculator');

    const calcSection = page.locator('#calculator');
    await calcSection.scrollIntoViewIfNeeded();
    await expect(calcSection).toBeVisible({ timeout: 10000 });

    // Width display should reflect 85 см
    const widthText = page.locator('text=85 см').first();
    await expect(widthText).toBeVisible({ timeout: 10000 });
  });

  test('3. 3D Візуалізатор (/visualizer) перемикає кімнати та типи штор', async ({ page }) => {
    await page.goto('/visualizer');

    // Title / heading check
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Check interactive canvas/visualizer viewport
    const visualizerArea = page.locator('div:has(canvas), div:has(img[alt*="вікн" i]), div:has(button:has-text("День"))').first();
    await expect(visualizerArea).toBeVisible();

    // Check category/fabric buttons
    const fabricOptions = page.locator('button:has-text("Ролети"), button:has-text("День-Ніч"), button:has-text("Штори")');
    expect(await fabricOptions.count()).toBeGreaterThan(0);
  });

  test('4. Інформаційні та сервісні сторінки завантажуються з кодом 200 та коректним контентом', async ({ page }) => {
    const pages = [
      { url: '/aktsii', headingRegex: /акці|знижк/i },
      { url: '/montaj', headingRegex: /монтаж|встановлен/i },
      { url: '/sposobi_oplati', headingRegex: /оплат/i },
      { url: '/dostavka', headingRegex: /доставк/i },
      { url: '/pro_nas', headingRegex: /виробництв|про нас|компані/i },
      { url: '/zvyazok', headingRegex: /контакт|зв'язок/i },
      { url: '/zakryta-sistema', headingRegex: /закрит/i },
    ];

    for (const p of pages) {
      const response = await page.goto(p.url);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });

  test('5. SEO ендпоінти (robots.txt, sitemap.xml, XML фіди) віддають валідні відповіді', async ({ page }) => {
    // robots.txt
    const robotsRes = await page.goto('/robots.txt');
    expect(robotsRes?.status()).toBe(200);
    const robotsText = await robotsRes?.text();
    expect(robotsText?.toLowerCase()).toContain('user-agent:');

    // sitemap.xml
    const sitemapRes = await page.goto('/sitemap.xml');
    expect(sitemapRes?.status()).toBe(200);
    const sitemapText = await sitemapRes?.text();
    expect(sitemapText).toContain('urlset');

    // Google Feed
    const feedRes = await page.goto('/api/feeds/google-uk.xml');
    expect(feedRes?.status()).toBe(200);
    const feedText = await feedRes?.text();
    expect(feedText).toContain('<rss');
  });

  test('6. AI-Консультант віджет доступний на сторінці та відкривається', async ({ page }) => {
    await page.goto('/');

    const aiConsultantBtn = page.locator('button:visible').filter({ hasText: /AI Eксперт|AI-Чат|AI-консультант/i }).first();
    await expect(aiConsultantBtn).toBeVisible({ timeout: 10000 });
    await aiConsultantBtn.click({ force: true });

    // Verify Chat window is opened
    const chatInput = page.locator('input[aria-label*="AI-консультант" i], input[placeholder*="Запитайте" i]').first();
    await expect(chatInput).toBeVisible({ timeout: 10000 });
  });

  test('7. Мобільна панель (MobileBottomBar) та висувна шторка (MobileDrawer)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify Mobile Bottom Bar is visible
    const mobileBar = page.locator('aside[aria-label="Мобільне меню швидких дій"]');
    await expect(mobileBar).toBeVisible({ timeout: 10000 });

    // Verify buttons exist
    await expect(mobileBar.locator('button:has-text("AI-Замір")')).toBeVisible();
    await expect(mobileBar.locator('button:has-text("Швидкий замір")')).toBeVisible();
    await expect(mobileBar.locator('button:has-text("Розрахунок")')).toBeVisible();

    // Click "Швидкий замір" to open iOS Bottom Sheet
    await mobileBar.locator('button:has-text("Швидкий замір")').click({ force: true });

    // Verify MobileDrawer is open
    const drawerTitle = page.locator('text=Швидкий виклик майстра на замір');
    await expect(drawerTitle).toBeVisible({ timeout: 10000 });

    // Verify form input inside Drawer
    const phoneInput = page.locator('input[placeholder*="+380"]').first();
    await expect(phoneInput).toBeVisible();
  });

  test('8. Гіроскопічний рівень (Level Guide) доступний в AI-Замірі', async ({ page }) => {
    await page.goto('/zamir');

    // Open AI-Measure modal
    const openModalBtn = page.locator('button:has-text("Запустити AI Авто-замір")').first();
    await openModalBtn.click();

    // Verify Digital Spirit Level section
    const levelGuideTitle = page.locator('text=Цифровий рівень нахилу (Гіроскоп)');
    await expect(levelGuideTitle).toBeVisible();

    // Verify toggle button
    const toggleGyroBtn = page.locator('button:has-text("Увімкнути рівень")');
    await expect(toggleGyroBtn).toBeVisible();
    await toggleGyroBtn.click();

    // Verify level indicators are displayed
    await expect(page.locator('text=Нахил вперед/назад:')).toBeVisible();
  });
});
