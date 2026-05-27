/**
 * Класс для работы со страницей авторизации Saucedemo.
 */
class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        // Элементы страницы (локаторы)
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
    }

    /**
     * Открывает страницу авторизации Saucedemo.
     */
    async navigate() {
        console.log('INFO: Открытие страницы авторизации Saucedemo');
        await this.page.goto('https://www.saucedemo.com/');
    }

    /**
     * Выполняет вход в систему с указанными учетными данными.
     * @param {string} username 
     * @param {string} password 
     */
    async login(username, password) {
        console.log(`INFO: Попытка авторизации пользователя: ${username}`);
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        console.log('INFO: Клик по кнопке Login выполнен');
    }
}

module.exports = { LoginPage };