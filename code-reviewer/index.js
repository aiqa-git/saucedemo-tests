import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const SYSTEM_PROMPT = `
Ты — опытный Senior QA Automation Engineer и строгий ментор. 
Твоя задача — провести аудит выделенного фрагмента кода автотестов строго по следующим 6 правилам качества:

1. Надежность и стабильность тестов (Поиск flaky-мест, захардкоженных пауз типа waitForTimeout).
2. Ассерты и проверяемость результата (Наличие и качество expect-проверок).
3. Читаемость и намерение кода (Понятный нейминг, логические блоки, шаги).
4. Хардкод и тестовые данные (Вынос данных из тела теста, конфиги).
5. Повторяемость и DRY (Повторение кода, который можно вынести в beforeEach/хелперы).
6. Архитектура тестов (Использование Page Object Model, разделение логики и локаторов).

Для каждого пункта, где есть замечания:
- Напиши статус: [КРИТИЧНО] / [РЕКОМЕНДУЕТСЯ] / [ОК].
- Кратко объясни, в чем проблема.
- Напиши блок кода "КАК ИСПРАВИТЬ" с примером правильного рефакторинга.

Отвечай на русском языке, будь лаконичным и технически точным.
`;

async function analyzeFile() {
    // Получаем путь к файлу из аргументов командной строки (третий аргумент)
    const filePath = process.argv[2];

    if (!filePath) {
        console.error("Ошибка: Укажите путь к файлу для анализа!");
        console.log("Пример: node index.js ../tests/saucedemo.spec.js");
        process.exit(1);
    }

    try {
        const absolutePath = path.resolve(filePath);
        
        // Проверяем, существует ли файл
        if (!fs.existsSync(absolutePath)) {
            console.error(`Ошибка: Файл по пути "${filePath}" не найден!`);
            process.exit(1);
        }

        // Читаем код из файла
        console.log(`Читаем файл: ${filePath}...`);
        const codeToAnalyze = fs.readFileSync(absolutePath, 'utf-8');

        console.log("Отправляем код на QA-аудит в Mistral AI...");
        
        const response = await client.chat.complete({
            model: 'mistral-small-latest',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Проанализируй следующий фрагмент кода:\n\n${codeToAnalyze}` }
            ],
            temperature: 0.2 
        });

        console.log("\nОТЧЕТ О ПРОВЕРКЕ КАЧЕСТВА КОДА:");
        console.log("=========================================");
        console.log(response.choices[0].message.content);
        console.log("=========================================");
        
    } catch (error) {
        console.error("Ошибка при анализе:", error.message);
    }
}

analyzeFile();