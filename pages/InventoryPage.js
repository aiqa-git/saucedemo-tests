/**
 * Класс для работы со страницей каталога товаров (Inventory).
 */
class InventoryPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        // Локаторы для элементов страницы
        this.inventoryItems = page.locator('.inventory_item');
        this.shoppingCartLink = page.locator('.shopping_cart_link');
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
        
        // Локатор для первой кнопки "Add to cart" на странице
        this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
        // Локатор для первой кнопки "Remove" на странице
        this.removeButton = page.locator('[data-test^="remove"]');
    }

    /**
     * Добавляет первый доступный товар в корзину.
     */
    async addFirstItemToCart() {
        console.log('INFO: Добавление первого товара в корзину');
        await this.addToCartButton.first().click();
        console.log('INFO: Товар успешно добавлен в корзину');
    }

    /**
     * Удаляет первый товар из корзины прямо со страницы каталога.
     */
    async removeFirstItemFromCart() {
        console.log('INFO: Удаление товара из корзины на странице каталога');
        await this.removeButton.first().click();
        console.log('INFO: Товар успешно удален со страницы каталога');
    }

    /**
     * Получает текущее количество товаров на иконке корзины.
     * @returns {Promise<string>} Количество товаров в виде строки
     */
    async getCartBadgeCount() {
        console.log('INFO: Получение счетчика товаров на иконке корзины');
        if (await this.shoppingCartBadge.isVisible()) {
            const count = await this.shoppingCartBadge.innerText();
            console.log(`INFO: В корзине сейчас товаров: ${count}`);
            return count;
        }
        console.log('INFO: Иконка корзины пуста (нет счетчика)');
        return '0';
    }

    /**
     * Кликает по иконке корзины для перехода на страницу корзины.
     */
    async goToCart() {
        console.log('INFO: Переход на страницу корзины');
        await this.shoppingCartLink.click();
        console.log('INFO: Страница корзины открыта');
    }
}

module.exports = { InventoryPage };