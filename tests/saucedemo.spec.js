const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');

test.describe('Тестирование интернет-магазина Saucedemo', () => {

    // Этот блок выполняется перед каждым тестом: инициализируем страницы и логинимся
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test('Тест 1: Успешный вход в систему и отображение каталога', async ({ page }) => {
        console.log('--- СТАРТ: Тест 1 ---');
        // Проверяем, что после beforeEach мы действительно попали на страницу каталога
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        console.log('--- КОНЕЦ: Тест 1 (Успешно) ---');
    });

    test('Тест 2: Добавление товара в корзину из каталога', async ({ page }) => {
        console.log('--- СТАРТ: Тест 2 ---');
        const inventoryPage = new InventoryPage(page);

        // Добавляем первый товар
        await inventoryPage.addFirstItemToCart();
        
        // Проверяем, что на иконке корзины появилась цифра "1"
        const badgeCount = await inventoryPage.getCartBadgeCount();
        expect(badgeCount).toBe('1');
        console.log('--- КОНЕЦ: Тест 2 (Успешно) ---');
    });

    test('Тест 3: Удаление товара из корзины на странице каталога', async ({ page }) => {
        console.log('--- СТАРТ: Тест 3 ---');
        const inventoryPage = new InventoryPage(page);

        // Сначала добавляем товар, затем удаляем его
        await inventoryPage.addFirstItemToCart();
        await inventoryPage.removeFirstItemFromCart();
        
        // Проверяем, что счетчик корзины стал равен "0" (скрылся)
        const badgeCount = await inventoryPage.getCartBadgeCount();
        expect(badgeCount).toBe('0');
        console.log('--- КОНЕЦ: Тест 3 (Успешно) ---');
    });

    test('Тест 4: Полный цикл оформления заказа (Checkout)', async ({ page }) => {
        console.log('--- СТАРТ: Тест 4 ---');
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);

        // Шаг 1: Добавляем товар и идем в корзину
        await inventoryPage.addFirstItemToCart();
        await inventoryPage.goToCart();

        // Шаг 2: Переходим к оформлению
        await cartPage.proceedToCheckout();

        // Шаг 3: Заполняем форму (Имя, Фамилия, Индекс)
        await cartPage.fillCheckoutInformation('Иван', 'Тестировщик', '123456');

        // Шаг 4: Завершаем заказ
        await cartPage.finishCheckout();

        // Шаг 5: Проверяем, что появилось сообщение об успешном заказе
        const successMessage = await cartPage.getSuccessMessage();
        expect(successMessage).toBe('Thank you for your order!');
        console.log('--- КОНЕЦ: Тест 4 (Успешно) ---');
    });
});

// Отдельный блок тестов для проверки негативных сценариев (без автоматического логина)
test.describe('Негативные сценарии Saucedemo', () => {
    test('Тест 5: Ошибка авторизации при вводе неверного пароля', async ({ page }) => {
        console.log('--- СТАРТ: Тест 5 ---');
        const loginPage = new LoginPage(page);

        await loginPage.navigate();
        // Вводим правильный логин, но неверный пароль
        await loginPage.login('standard_user', 'wrong_password');

        // Локатор для сообщения об ошибке
        const errorMessage = page.locator('[data-test="error"]');
        // Проверяем, что текст ошибки содержит информацию о несовпадении кредов
        await expect(errorMessage).toContainText('Username and password do not match any user in this service');
        console.log('--- КОНЕЦ: Тест 5 (Успешно) ---');
    });
});