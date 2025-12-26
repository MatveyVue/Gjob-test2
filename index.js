const { Telegraf } = require('telegraf');
const express = require('express');

const app = express();

const apiToken = '6632695365:AAH234LsLWIcoCL5EzKy_kGyj18skhd5xCU';
const webhookPath = `/bot${apiToken}`;
const webhookUrl = `https://gjob-test2.vercel.app${webhookPath}`; // Убедитесь, что домен правильный и HTTPS

const bot = new Telegraf(apiToken, {
    telegram: {
        webhookReply: false
    }
});

// Установка middleware для webhook
app.use(express.json());
app.use(bot.webhookCallback(webhookPath));

// Экспорт обработчиков из файла
bot.use(require('./composer/text.js'));

// Устанавливаем webhook при запуске
(async () => {
    try {
        await bot.telegram.setWebhook(webhookUrl);
        console.log(`Webhook установлен: ${webhookUrl}`);
    } catch (error) {
        console.error('Ошибка установки webhook:', error);
    }
})();

// Запуск сервера
app.listen(3212, () => {
    console.log('Server is running on port 3212');
});
