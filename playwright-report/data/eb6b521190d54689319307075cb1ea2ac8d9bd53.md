# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart-and-checkout.spec.ts >> Кошик та Оформлення замовлення >> додавання товару в кошик та перевірка висувної панелі кошика
- Location: tests/e2e/cart-and-checkout.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="dialog"] #cart-drawer-title, [role="dialog"] h3:has-text("Кошик")').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[role="dialog"] #cart-drawer-title, [role="dialog"] h3:has-text("Кошик")').first()

```

```yaml
- banner:
  - text: 🔥 Безкоштовний виїзд майстра на замір у м. Дніпро при замовленні від 2-х вікон!
  - navigation:
    - link "Головна":
      - /url: /
    - link "Акції":
      - /url: /aktsii
    - link "Замір":
      - /url: /zamir
    - link "Монтаж":
      - /url: /montaj
    - link "Оплата":
      - /url: /sposobi_oplati
    - link "Доставка":
      - /url: /dostavka
    - link "Про нас":
      - /url: /pro_nas
    - link "Контакти":
      - /url: /zvyazok
  - link "Instagram":
    - /url: https://www.instagram.com/zhaluzi.rollety.dnipro?igsh=MWR0cXVmdzExem02ZQ==
    - img
    - text: Instagram
  - link "Telegram":
    - /url: https://t.me/+380939128531
  - link "V":
    - /url: viber://chat?number=%2B380939128531
  - link "(093) 912-85-31":
    - /url: tel:0939128531
  - text: /
  - link "(093) 510-55-21":
    - /url: tel:0935105521
  - text: Щодня з 9:00 до 19:00
  - button "📦 ТТН"
  - link "ЖАЛЮЗІ РОЛЕТИ від виробника • дніпро":
    - /url: /
    - img
    - text: ЖАЛЮЗІ РОЛЕТИ від виробника • дніпро
  - navigation:
    - button "Ролети"
    - button "Штори"
    - button "Жалюзі"
    - button "Закрита система"
  - button "📍 Дніпро"
  - textbox "Пошук у каталозі..."
  - link "Закладки":
    - /url: /catalog?wishlist=true
  - link "Кабінет / Замовлення":
    - /url: /admin
  - button "Кошик"
- main:
  - navigation:
    - link "Головна":
      - /url: /
    - text: /
    - link "roleti":
      - /url: /roleti
    - text: / Ролети День Ніч Secret Чорний DN-208
  - text: Популярний Пропозиція дня
  - img "Ролети День Ніч Secret Чорний DN-208"
  - button "Ролети День Ніч Secret Чорний DN-208 1":
    - img "Ролети День Ніч Secret Чорний DN-208 1"
  - button "Ролети День Ніч Secret Чорний DN-208 2":
    - img "Ролети День Ніч Secret Чорний DN-208 2"
  - button "Ролети День Ніч Secret Чорний DN-208 3":
    - img "Ролети День Ніч Secret Чорний DN-208 3"
  - button "Ролети День Ніч Secret Чорний DN-208 4":
    - img "Ролети День Ніч Secret Чорний DN-208 4"
  - button "Ролети День Ніч Secret Чорний DN-208 5":
    - img "Ролети День Ніч Secret Чорний DN-208 5"
  - text: Доставка Нова Пошта 2-4 дні по Україні Гарантія 12 міс. Офіційна від заводу
  - heading "Ролети День Ніч Secret Чорний DN-208" [level=1]
  - button "Додати в обране"
  - text: "В наявності | Артикул:"
  - strong: DN-208
  - text: "| 4.8 (0 відгуків)"
  - separator
  - text: 1. Вкажіть ваші розміри (см)
  - link "📐 Інструкція заміру":
    - /url: /zamir
  - text: "Ширина (від 25 до 250 см):"
  - spinbutton: "50"
  - text: "см Висота (від 30 до 260 см):"
  - spinbutton: "150"
  - text: "см * Заводське виготовлення здійснюється точно за вашими розмірами з точністю до міліметра. 2. Оберіть колір тканини: Чорний (DN-208)"
  - button "Чорний"
  - button "Шоколадний"
  - button "Графіт"
  - button "Білий"
  - button "Кремовий"
  - text: "Сторона управління:"
  - button "Ліва"
  - button "Права"
  - text: "Система фіксації:"
  - button "На лісці (+60 грн)"
  - button "Без ліски"
  - separator
  - text: "Розрахункова ціна за розмір: 698 грн"
  - button
  - text: "1"
  - button
  - button "Додати у кошик"
  - button "Купити в 1 клік"
  - link "Замовити у Viber":
    - /url: viber://chat?number=%2B380939128531&text=%D0%9F%D1%80%D0%B8%D0%B2%D1%96%D1%82!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%BC%D0%BE%D0%B2%D0%B8%D1%82%D0%B8%3A%0A%F0%9F%93%A6%20%D0%A0%D0%BE%D0%BB%D0%B5%D1%82%D0%B8%20%D0%94%D0%B5%D0%BD%D1%8C%20%D0%9D%D1%96%D1%87%20Secret%20%D0%A7%D0%BE%D1%80%D0%BD%D0%B8%D0%B9%20DN-208%0A%F0%9F%92%B0%20698%20%D0%B3%D1%80%D0%BD%0A%F0%9F%93%90%2050%C3%97150%20%D1%81%D0%BC
  - button "Характеристики"
  - button "Опис моделі"
  - button "Відгуки (0)"
  - table:
    - rowgroup:
      - row "Колір Чорний":
        - cell "Колір"
        - cell "Чорний"
      - row "Система Mini День-Ніч":
        - cell "Система"
        - cell "Mini День-Ніч"
      - row "Тканина Secret":
        - cell "Тканина"
        - cell "Secret"
      - row "Фактура День-Ніч":
        - cell "Фактура"
        - cell "День-Ніч"
      - row "Гарантія 12 місяців":
        - cell "Гарантія"
        - cell "12 місяців"
      - row "Затемнення до 75%":
        - cell "Затемнення"
        - cell "до 75%"
      - row "Країна виробник тканини Польща":
        - cell "Країна виробник тканини"
        - cell "Польща"
  - heading "Схожі моделі та рекомендації" [level=2]
  - link "Рулонні штори Len Коричневий L-7439 Рулонні штори Len Коричневий L-7439 229 грн":
    - /url: /product/rulonni_shtory_len_korychnevyj_14_koloriv_vsi_rozmiry
    - img "Рулонні штори Len Коричневий L-7439"
    - heading "Рулонні штори Len Коричневий L-7439" [level=4]
    - text: 229 грн
  - link "Ролети День Ніч Акварель Бірюзовий DN-1208 Ролети День Ніч Акварель Бірюзовий DN-1208 529 грн":
    - /url: /product/rolety_den_nich_akvarel_biryuzovyj_13_koloriv_vsi_rozmiry
    - img "Ролети День Ніч Акварель Бірюзовий DN-1208"
    - heading "Ролети День Ніч Акварель Бірюзовий DN-1208" [level=4]
    - text: 529 грн
  - button
  - heading "Швидке замовлення в 1 клік" [level=3]
  - paragraph: Залиште ваш номер телефону, і наш спеціаліст безкоштовно проконсультує вас, підтвердить розміри та оформить замовлення.
  - text: "Ролети День Ніч Secret Чорний DN-208 Розмір:"
  - strong: 50 см × 150 см
  - text: "Колір:"
  - strong: Чорний
  - text: "Сума: 698 грн Ваше ім'я (необов'язково)"
  - textbox "Олександр"
  - text: Номер телефону *
  - textbox "+38 (093) 123-45-67 або 0931234567"
  - button "Підтвердити замовлення"
  - text: 🔒 Натискаючи кнопку, ви погоджуєтеся на обробку персональних даних.
- contentinfo:
  - link "ЖАЛЮЗІ РОЛЕТИ від виробника • дніпро":
    - /url: /
    - img
    - text: ЖАЛЮЗІ РОЛЕТИ від виробника • дніпро
  - paragraph: Виробництво та монтаж жалюзі і тканинних ролет під замовлення у м. Дніпро та з доставкою по всій Україні. Індивідуальні розміри, європейські тканини та надійні механізми.
  - text: "Контактна особа: Віктор Кузьменко м. Дніпро (Доставка та відправка по всій Україні)"
  - link "(093) 912-85-31":
    - /url: tel:0939128531
  - text: /
  - link "(093) 510-55-21":
    - /url: tel:0935105521
  - text: Щодня з 9:00 до 19:00
  - link "Instagram":
    - /url: https://www.instagram.com/zhaluzi.rollety.dnipro?igsh=MWR0cXVmdzExem02ZQ==
    - img
    - text: Instagram
  - link "Telegram":
    - /url: https://t.me/+380939128531
  - link "Viber":
    - /url: viber://chat?number=%2B380939128531
  - heading "Ролети & Штори" [level=4]
  - list:
    - listitem:
      - link "Тканинні ролети":
        - /url: /roleti?sub=tkanunni_roleti
    - listitem:
      - link "Ролети День-Ніч":
        - /url: /roleti?sub=den-nich
    - listitem:
      - link "Ролети Блекаут":
        - /url: /roleti?sub=blekaut_roleti
    - listitem:
      - link "Джутові ролети":
        - /url: /roleti?sub=dzhutovi_roleti
    - listitem:
      - link "Бамбукові ролети":
        - /url: /roleti?sub=bambukovi
    - listitem:
      - link "Римські штори":
        - /url: /shtori?sub=rimski
    - listitem:
      - link "Штори Плісе Duo":
        - /url: /shtori?sub=plise
  - heading "Жалюзі & Системи" [level=4]
  - list:
    - listitem:
      - link "Горизонтальні жалюзі":
        - /url: /zhaluzi?sub=gorizontalnie_zhaluzi
    - listitem:
      - link "Вертикальні жалюзі":
        - /url: /zhaluzi?sub=vertikalnie_zhaluzi
    - listitem:
      - link "Алюмінієві жалюзі":
        - /url: /zhaluzi?sub=alyuminievie_zhaluzi
    - listitem:
      - link "Бамбукові жалюзі":
        - /url: /zhaluzi?sub=bambukovi_zhalyuzi
    - listitem:
      - link "Дерев'яні жалюзі":
        - /url: /zhaluzi?sub=derevyani
    - listitem:
      - link "Закрита система з коробом":
        - /url: /zakryta-sistema
  - heading "Покупцям" [level=4]
  - list:
    - listitem:
      - link "Акції та знижки":
        - /url: /aktsii
    - listitem:
      - link "Інструкція з заміру":
        - /url: /zamir
    - listitem:
      - link "Інструкція з монтажу":
        - /url: /montaj
    - listitem:
      - link "Оплата та розстрочка":
        - /url: /sposobi_oplati
    - listitem:
      - link "Доставка Новою Поштою":
        - /url: /dostavka
    - listitem:
      - link "Про компанію":
        - /url: /pro_nas
    - listitem:
      - link "Контакти":
        - /url: /zvyazok
    - listitem:
      - link "Адмін-панель":
        - /url: /admin
  - text: © 2014–2026 Жалюзі та Ролети від виробника • м. Дніпро. Всі права захищено. 100% Гарантія якості Приват24 • Monobank • Visa • MasterCard • NovaPay
- 'link "Зателефонувати: (093) 912-85-31"':
  - /url: tel:0939128531
  - text: (093) 912-85-31 (Віктор Кузьменко)
- link "Instagram":
  - /url: https://www.instagram.com/zhaluzi.rollety.dnipro?igsh=MWR0cXVmdzExem02ZQ==
  - img
  - text: Instagram
- link "Telegram Чат":
  - /url: https://t.me/+380939128531
  - text: Чат у Telegram
- text: ✨ AI-Консультант • Замір за 10 сек
- button "Відкрити онлайн AI-консультант": AI Эксперт
- alert: Ролети День Ніч Secret Чорний DN-208 — купити за ціною від 529 грн у Дніпрі | Жалюзі та Ролети від виробника
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Кошик та Оформлення замовлення', () => {
  4  |   test('додавання товару в кошик та перевірка висувної панелі кошика', async ({ page }) => {
  5  |     await page.goto('/catalog');
  6  | 
  7  |     // Find and click on first product
  8  |     const firstProduct = page.locator('a[href^="/product/"]').first();
  9  |     await firstProduct.click();
  10 |     await expect(page).toHaveURL(/\/product\/.+/);
  11 | 
  12 |     // Click Add to Cart button
  13 |     const addToCartBtn = page.locator('button:has-text("Купити"), button:has-text("В кошик"), button:has-text("Додати в кошик")').first();
  14 |     await addToCartBtn.click();
  15 | 
  16 |     // Verify Cart Drawer opens and contains product
  17 |     const cartDrawerTitle = page.locator('[role="dialog"] #cart-drawer-title, [role="dialog"] h3:has-text("Кошик")').first();
> 18 |     await expect(cartDrawerTitle).toBeVisible({ timeout: 10000 });
     |                                   ^ Error: expect(locator).toBeVisible() failed
  19 |   });
  20 | 
  21 |   test('сторінка оформлення замовлення /checkout валідує поля', async ({ page }) => {
  22 |     await page.goto('/checkout');
  23 | 
  24 |     // Page must render checkout form
  25 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  26 | 
  27 |     // Form inputs should be accessible
  28 |     const phoneInput = page.locator('input[type="tel"], input[name*="phone" i], input[placeholder*="09" i]').first();
  29 |     if (await phoneInput.isVisible()) {
  30 |       await phoneInput.fill('0931234567');
  31 |       await expect(phoneInput).toHaveValue(/0931234567/);
  32 |     }
  33 |   });
  34 | });
  35 | 
```