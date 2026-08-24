# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-auth.spec.ts >> Панель адміністратора /admin >> блокує вхід при введенні неправильного пароля
- Location: tests/e2e/admin-auth.spec.ts:13:7

# Error details

```
TimeoutError: locator.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('input[type="text"]').first()
    - locator resolved to <input value="" type="text" placeholder="Пошук у каталозі..." class="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-full text-xs text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"/>
    - fill("admin")
  - attempting fill action
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
      - waiting 100ms
    28 × waiting for element to be visible, enabled and editable
       - element is not visible
     - retrying fill action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]: 🔥 Безкоштовний виїзд майстра на замір у м. Дніпро при замовленні від 2-х вікон!
    - generic [ref=e4]:
      - button "Меню" [ref=e5]
      - link "ЖАЛЮЗІ РОЛЕТИ від виробника • дніпро" [ref=e7] [cursor=pointer]:
        - /url: /
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: ЖАЛЮЗІ
            - generic [ref=e17]: РОЛЕТИ
          - generic [ref=e18]: від виробника • дніпро
      - generic [ref=e19]:
        - link "Закладки" [ref=e20] [cursor=pointer]:
          - /url: /catalog?wishlist=true
        - link "Кабінет / Замовлення" [ref=e23] [cursor=pointer]:
          - /url: /admin
        - button "Кошик" [ref=e27]
  - main [ref=e32]:
    - generic [ref=e34]:
      - generic [ref=e35]:
        - heading "Вхід в адмін-панель" [level=1] [ref=e40]
        - paragraph [ref=e41]: Введіть логін та пароль адміністратора для доступу до керування сайтом
      - generic [ref=e42]:
        - generic [ref=e43]:
          - generic [ref=e44]: Логін адміністратора
          - textbox "admin" [ref=e45]
        - generic [ref=e46]:
          - generic [ref=e47]: Пароль
          - generic [ref=e48]:
            - textbox "Введіть пароль" [ref=e49]
            - button "Показати пароль" [ref=e50]
        - button "Увійти в адмін-панель" [ref=e54] [cursor=pointer]
      - generic [ref=e56]: 🔒 Доступ суворо обмежений для власника сайту.
  - contentinfo [ref=e57]:
    - generic [ref=e58]:
      - generic [ref=e59]:
        - generic [ref=e60]:
          - link "ЖАЛЮЗІ РОЛЕТИ від виробника • дніпро" [ref=e62] [cursor=pointer]:
            - /url: /
            - generic [ref=e69]:
              - generic [ref=e70]:
                - generic [ref=e71]: ЖАЛЮЗІ
                - generic [ref=e72]: РОЛЕТИ
              - generic [ref=e73]: від виробника • дніпро
          - paragraph [ref=e74]: Виробництво та монтаж жалюзі і тканинних ролет під замовлення у м. Дніпро та з доставкою по всій Україні. Індивідуальні розміри, європейські тканини та надійні механізми.
          - generic [ref=e75]:
            - generic [ref=e76]: "Контактна особа: Віктор Кузьменко"
            - generic [ref=e81]: м. Дніпро (Доставка та відправка по всій Україні)
            - generic [ref=e86]:
              - link "(093) 912-85-31" [ref=e89] [cursor=pointer]:
                - /url: tel:0939128531
              - generic [ref=e90]: /
              - link "(093) 510-55-21" [ref=e91] [cursor=pointer]:
                - /url: tel:0935105521
            - generic [ref=e92]: Щодня з 9:00 до 19:00
          - generic [ref=e97]:
            - link "Instagram" [ref=e98] [cursor=pointer]:
              - /url: https://www.instagram.com/zhaluzi.rollety.dnipro?igsh=MWR0cXVmdzExem02ZQ==
            - link "Telegram" [ref=e103] [cursor=pointer]:
              - /url: https://t.me/+380939128531
            - link "Viber" [ref=e108] [cursor=pointer]:
              - /url: viber://chat?number=%2B380939128531
        - generic [ref=e110]:
          - heading "Ролети & Штори" [level=4] [ref=e111]
          - list [ref=e112]:
            - listitem [ref=e113]:
              - link "Тканинні ролети" [ref=e114] [cursor=pointer]:
                - /url: /roleti?sub=tkanunni_roleti
            - listitem [ref=e115]:
              - link "Ролети День-Ніч" [ref=e116] [cursor=pointer]:
                - /url: /roleti?sub=den-nich
            - listitem [ref=e117]:
              - link "Ролети Блекаут" [ref=e118] [cursor=pointer]:
                - /url: /roleti?sub=blekaut_roleti
            - listitem [ref=e119]:
              - link "Джутові ролети" [ref=e120] [cursor=pointer]:
                - /url: /roleti?sub=dzhutovi_roleti
            - listitem [ref=e121]:
              - link "Бамбукові ролети" [ref=e122] [cursor=pointer]:
                - /url: /roleti?sub=bambukovi
            - listitem [ref=e123]:
              - link "Римські штори" [ref=e124] [cursor=pointer]:
                - /url: /shtori?sub=rimski
            - listitem [ref=e125]:
              - link "Штори Плісе Duo" [ref=e126] [cursor=pointer]:
                - /url: /shtori?sub=plise
        - generic [ref=e127]:
          - heading "Жалюзі & Системи" [level=4] [ref=e128]
          - list [ref=e129]:
            - listitem [ref=e130]:
              - link "Горизонтальні жалюзі" [ref=e131] [cursor=pointer]:
                - /url: /zhaluzi?sub=gorizontalnie_zhaluzi
            - listitem [ref=e132]:
              - link "Вертикальні жалюзі" [ref=e133] [cursor=pointer]:
                - /url: /zhaluzi?sub=vertikalnie_zhaluzi
            - listitem [ref=e134]:
              - link "Алюмінієві жалюзі" [ref=e135] [cursor=pointer]:
                - /url: /zhaluzi?sub=alyuminievie_zhaluzi
            - listitem [ref=e136]:
              - link "Бамбукові жалюзі" [ref=e137] [cursor=pointer]:
                - /url: /zhaluzi?sub=bambukovi_zhalyuzi
            - listitem [ref=e138]:
              - link "Дерев'яні жалюзі" [ref=e139] [cursor=pointer]:
                - /url: /zhaluzi?sub=derevyani
            - listitem [ref=e140]:
              - link "Закрита система з коробом" [ref=e141] [cursor=pointer]:
                - /url: /zakryta-sistema
        - generic [ref=e142]:
          - heading "Покупцям" [level=4] [ref=e143]
          - list [ref=e144]:
            - listitem [ref=e145]:
              - link "Акції та знижки" [ref=e146] [cursor=pointer]:
                - /url: /aktsii
            - listitem [ref=e147]:
              - link "Інструкція з заміру" [ref=e148] [cursor=pointer]:
                - /url: /zamir
            - listitem [ref=e149]:
              - link "Інструкція з монтажу" [ref=e150] [cursor=pointer]:
                - /url: /montaj
            - listitem [ref=e151]:
              - link "Оплата та розстрочка" [ref=e152] [cursor=pointer]:
                - /url: /sposobi_oplati
            - listitem [ref=e153]:
              - link "Доставка Новою Поштою" [ref=e154] [cursor=pointer]:
                - /url: /dostavka
            - listitem [ref=e155]:
              - link "Про компанію" [ref=e156] [cursor=pointer]:
                - /url: /pro_nas
            - listitem [ref=e157]:
              - link "Контакти" [ref=e158] [cursor=pointer]:
                - /url: /zvyazok
            - listitem [ref=e159]:
              - link "Адмін-панель" [ref=e160] [cursor=pointer]:
                - /url: /admin
      - generic [ref=e161]:
        - generic [ref=e162]: © 2014–2026 Жалюзі та Ролети від виробника • м. Дніпро. Всі права захищено.
        - generic [ref=e163]:
          - generic [ref=e164]: 100% Гарантія якості
          - generic [ref=e168]: Приват24 • Monobank • Visa • MasterCard • NovaPay
  - generic [ref=e169]:
    - 'link "Зателефонувати: (093) 912-85-31" [ref=e170] [cursor=pointer]':
      - /url: tel:0939128531
      - generic: (093) 912-85-31 (Віктор Кузьменко)
    - link "Instagram" [ref=e175] [cursor=pointer]:
      - /url: https://www.instagram.com/zhaluzi.rollety.dnipro?igsh=MWR0cXVmdzExem02ZQ==
    - link "Telegram Чат" [ref=e179] [cursor=pointer]:
      - /url: https://t.me/+380939128531
      - generic: Чат у Telegram
  - button "Відкрити онлайн AI-консультант" [ref=e184]:
    - generic [ref=e191]: AI Эксперт
  - alert [ref=e194]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Панель адміністратора /admin', () => {
  4  |   test('показує форму авторизації при першому переході', async ({ page }) => {
  5  |     await page.goto('/admin');
  6  | 
  7  |     // Should display login title and password input
  8  |     await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  9  |     const passwordInput = page.locator('input[type="password"]');
  10 |     await expect(passwordInput).toBeVisible();
  11 |   });
  12 | 
  13 |   test('блокує вхід при введенні неправильного пароля', async ({ page }) => {
  14 |     await page.goto('/admin');
  15 | 
  16 |     const loginInput = page.locator('input[type="text"]').first();
> 17 |     await loginInput.fill('admin');
     |                      ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
  18 | 
  19 |     const passwordInput = page.locator('input[type="password"]');
  20 |     await passwordInput.fill('wrongpassword123');
  21 | 
  22 |     const submitBtn = page.locator('button[type="submit"]');
  23 |     await submitBtn.click();
  24 | 
  25 |     // Verify staying on login screen with error or password input still visible
  26 |     await expect(passwordInput).toBeVisible();
  27 |   });
  28 | 
  29 |   test('успішний вхід з валідними обліковими даними', async ({ page }) => {
  30 |     await page.goto('/admin');
  31 | 
  32 |     const loginInput = page.locator('input[type="text"]').first();
  33 |     await loginInput.fill('admin');
  34 | 
  35 |     const passwordInput = page.locator('input[type="password"]');
  36 |     await passwordInput.fill('Dnipro2026!');
  37 | 
  38 |     const submitBtn = page.locator('button[type="submit"]');
  39 |     await submitBtn.click();
  40 | 
  41 |     // After success, navigation header / tabs should be visible
  42 |     const headerTitle = page.locator('h1:has-text("Панель"), button:has-text("Замовлення"), button:has-text("Товари")').first();
  43 |     await expect(headerTitle).toBeVisible({ timeout: 12000 });
  44 |   });
  45 | });
  46 | 
```