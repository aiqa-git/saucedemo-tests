/**
 * Класс для работы со страницей корзины и оформления заказа (Checkout).
 */
class CartPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        // Локаторы для страницы корзины
        this.checkoutButton = page.locator('[data-test="checkout"]');
        
        // Локаторы для формы ввода данных (Checkout: Your Information)
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        
        // Локаторы для финального шага (Checkout: Overview & Complete)
        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('.complete-header');
    }

    /**
     * Переходит к оформлению заказа (клик по кнопке Checkout).
     */
    async proceedToCheckout() {
        console.log('INFO: Клик по кнопке Checkout');
        await this.checkoutButton.click();
    }

    /**
     * Заполняет форму информации о покупателе и нажимает Continue.
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} postalCode 
     */
    async fillCheckoutInformation(firstName, lastName, postalCode) {
        console.log(`INFO: Заполнение данных покупателя: ${firstName} ${lastName}, индекс: ${postalCode}`);
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
        console.log('INFO: Форма информации отправлена, переход на страницу обзора заказа');
    }

    /**
     * Завершает оформление заказа (клик по кнопке Finish).
     */
    async finishCheckout() {
        console.log('INFO: Клик по кнопке Finish для завершения заказа');
        await this.finishButton.click();
    }

    /**
     * Получает текст успешного завершения заказа.
     * @returns {Promise<string>} Текст заголовка (например, "Thank you for your order!")
     */
    async getSuccessMessage() {
        console.log('INFO: Получение подтверждающего сообщения об успешном заказе');
        const message = await this.completeHeader.innerText();
        console.log(`INFO: Текст сообщения на экране: "${message}"`);
        return message;
    }
}

module.exports = { CartPage };