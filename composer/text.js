const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// Замените на ваши ключи
const TELEGRAM_BOT_TOKEN = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU';
const OPENROUTER_API_KEY = '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';

// Создаём бота
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Функция для обращения к API OpenRouter
async function callOpenRouter(prompt) {
    const url = 'https://api.openrouter.ai/v1/completions';
    const headers = {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
    };
    const data = {
        model: 'deepseek/deepseek-chat-v3-0324', // или другой поддерживаемый модель
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const result = await response.json();
            return result.choices[0].text.trim();
        } else {
            const errorText = await response.text();
            return `Ошибка при обращении к OpenRouter: ${errorText}`;
        }
    } catch (error) {
        return `Ошибка: ${error.message}`;
    }
}

// Обработка входящих сообщений
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text;

    const reply = await callOpenRouter(userText);
    await bot.sendMessage(chatId, reply);
});

console.log('Бот запущен');