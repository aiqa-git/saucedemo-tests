const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests', // Где искать тесты
  fullyParallel: false, // Запускаем по очереди, чтобы логи не перемешивались
  reporter: [['html'], ['allure-playwright']], // Стандартный отчет Allure Playwright
  use: {
    screenshot: 'only-failure', // Делать скриншот, если тест упал
    video: 'retain-on-failure', // Записывать видео только при падении
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }, // Запускаем в Google Chrome
    },
  ],
});