const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Тестовый маршрут
app.get('/test', (req, res) => {
    res.json({ message: 'Сервер работает!', timestamp: new Date() });
});

app.get('/health', (req, res) => {
    res.send('OK');
});

// Инициализация телеграм бота
let bot;
if (process.env.TELEGRAM_BOT_TOKEN) {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    console.log('✅ Telegram бот запущен');
} else {
    console.log('⚠️ TELEGRAM_BOT_TOKEN не установлен, бот отключен');
}

// Google Sheets интеграция (используем существующий код)
const { google } = require('googleapis');

class GoogleSheetsManager {
    // ... существующий код GoogleSheetsManager ...
}

const sheetsManager = new GoogleSheetsManager();
const AI_ENDPOINT = "https:" + "//" + "api." + "proxyapi.ru" + "/v1/chat/completions";
const AI_MODEL = "deepseek/deepseek-v3.2";
function getAiKey() {
    return process.env.PROXY_API_KEY || process.env.OPENROUTER_API_KEY || "";
}

// ====================
// API для AI интеграции
// ====================
// ==================== ДЛЯ ФРОНТЕНДА BALANS-TELA ====================
app.post('/api/ai/generate', async (req, res) => {
    console.log('🎯 /api/ai/generate вызван');
    
    try {
        const { userData } = req.body;
        
        if (!userData) {
            return res.status(400).json({
                success: false,
                error: 'Нет данных пользователя'
            });
        }

        console.log('Данные пользователя:', JSON.stringify(userData, null, 2));

        const apiKey = getAiKey();
        if (!apiKey) {
            console.error('❌ API ключ не настроен');
            throw new Error('API ключ не настроен');
        }

        const prompt = `
Ты профессиональный фитнес-тренер и диетолог. 
Создай персонализированные рекомендации для клиента:

Имя: ${userData.name}
Возраст: ${userData.age} лет
Вес: ${userData.weight} кг
Рост: ${userData.height} см
Уровень активности: ${userData.activity}
Цель: ${userData.goal}
Дополнительная информация: ${userData.additionalInfo || 'нет'}

Создай структурированный план на русском языке в формате:
1. 📊 Анализ текущего состояния
2. 🏋️‍♂️ Тренировочный план на неделю
3. 🥗 План питания с примерным меню
4. 💤 Рекомендации по восстановлению
5. 📈 Измеримые цели на первый месяц

Будь конкретным, профессиональным и мотивирующим.
Используй смайлики для наглядности.`;

        console.log('📤 Отправляю запрос к AI...');

        const response = await axios.post(
            AI_ENDPOINT,
            {
                model: AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Ты профессиональный фитнес-тренер с 15-летним опытом, специализируешься на персонализированных программах.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        console.log('✅ AI ответил успешно');

        res.json({
            success: true,
            advice: response.data.choices[0].message.content,
            tokens: response.data.usage?.total_tokens || 0
        });

    } catch (error) {
        console.error('🔥 Ошибка в /api/ai/generate:', error.response?.data || error.message);
        
        const userData = req.body.userData || {};
        const fallbackAdvice = `🏋️‍♂️ **Персонализированные рекомендации для ${userData.name || 'Вас'}:**

📊 **Анализ параметров:**
• Возраст: ${userData.age || 'не указан'} лет
• Вес: ${userData.weight || 'не указан'} кг
• Рост: ${userData.height || 'не указан'} см
• Активность: ${userData.activity || 'средняя'}
• Цель: ${userData.goal || 'оздоровление'}

📅 **Тренировочный план:**
Пн: Кардио 30 мин + силовая
Вт: Отдых/растяжка
Ср: Интервальная тренировка
Чт: Отдых
Пт: Силовая тренировка  
Сб: Длительное кардио 45 мин
Вс: Активный отдых

🥗 **Питание:**
• Завтрак: Белки + сложные углеводы
• Обед: Овощи + белок + полезные жиры
• Ужин: Лёгкий белок + овощи
• Перекусы: Фрукты, орехи, йогурт

💧 **Вода:** ${userData.weight ? Math.round(userData.weight * 35) : 2500} мл в день
🛌 **Сон:** 7-8 часов

✨ **Совет:** Начинайте постепенно, слушайте своё тело!`;

        res.json({
            success: true,
            advice: fallbackAdvice,
            error: error.message,
            source: 'fallback'
        });
    }
});
// Получить API ключ для фронтенда
app.get('/api/get-ai-key', (req, res) => {
    res.json({
        success: true,
        useProxy: true,
        configured: Boolean(getAiKey()),
        message: 'Используется защищённый серверный прокси'
    });
});

// Прокси для AI запросов
app.post('/api/ai/query', async (req, res) => {
    try {
        const { model, messages, max_tokens, temperature } = req.body;
        const apiKey = getAiKey();

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: 'API ключ не настроен на сервере'
            });
        }

        const response = await axios.post(
            AI_ENDPOINT,
            {
                model: model || AI_MODEL,
                messages,
                max_tokens: max_tokens || 1000,
                temperature: temperature || 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({
            success: true,
            choices: response.data.choices
        });

    } catch (error) {
        console.error('AI прокси ошибка:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// Специализированные AI эндпоинты

// Анализ тренировки
app.post('/api/ai/analyze-workout', async (req, res) => {
    try {
        const { workoutData } = req.body;
        const apiKey = getAiKey();

        if (!apiKey) {
            return res.status(500).json({ success: false, error: 'API ключ не настроен на сервере' });
        }

        const prompt = `
        Как эксперт по фитнесу и нейробиологии, проанализируй эту тренировку:
        
        Название: ${workoutData.title}
        Тип: ${workoutData.type}
        Упражнения: ${workoutData.exercises}
        
        Дай анализ по пунктам:
        1. Целевые группы мышц
        2. Потенциал для роста силы/выносливости
        3. Влияние на энергетический обмен
        4. Рекомендации по технике безопасности
        5. Варианты модификации для разного уровня
        
        Отвечай на русском, научно, но доступно.
        `;

        const response = await axios.post(
            AI_ENDPOINT,
            {
                model: AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Ты профессиональный фитнес-тренер с медицинским образованием.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({
            success: true,
            analysis: response.data.choices[0].message.content
        });

    } catch (error) {
        console.error('Ошибка анализа тренировки:', error);
        res.status(500).json({
            success: false,
            error: 'Не удалось проанализировать тренировку'
        });
    }
});

// Анализ питания
app.post('/api/ai/analyze-nutrition', async (req, res) => {
    try {
        const { nutritionData } = req.body;
        const apiKey = getAiKey();

        if (!apiKey) {
            return res.status(500).json({ success: false, error: 'API ключ не настроен на сервере' });
        }

        const prompt = `
        Как профессиональный диетолог, проанализируй это питание:
        
        Фокус дня: ${nutritionData.focus}
        Приемы пищи: ${nutritionData.meals}
        
        Проанализируй:
        1. Баланс БЖУ (белки, жиры, углеводы)
        2. Адекватность калорийности
        3. Влияние на уровень сахара в крови
        4. Потенциал для устойчивой энергии
        5. Рекомендации по улучшению
        
        Учти, что это часть 7-недельного курса по управлению энергией.
        Отвечай на русском, профессионально, но практично.
        `;

        const response = await axios.post(
            AI_ENDPOINT,
            {
                model: AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Ты опытный диетолог-нутрициолог, специализирующийся на энергетическом обмене.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({
            success: true,
            analysis: response.data.choices[0].message.content
        });

    } catch (error) {
        console.error('Ошибка анализа питания:', error);
        res.status(500).json({
            success: false,
            error: 'Не удалось проанализировать питание'
        });
    }
});
// Калибровка энерготипа
app.post('/api/ai/calibrate-energy', async (req, res) => {
    try {
        const { answers } = req.body;
        const apiKey = getAiKey();

        if (!apiKey) {
            return res.status(500).json({ success: false, error: 'API ключ не настроен на сервере' });
        }

        const prompt = `
        На основе этих ответов определи энерготип и дай рекомендации:
        
        Ответы пользователя: ${answers.join(', ')}
        
        Определи:
        1. Вероятный хронотип (жаворонок, сова, медведь, лев, волк, дельфин)
        2. Пиковые периоды продуктивности
        3. Рекомендации по тренировкам
        4. Рекомендации по питанию
        5. Оптимальный распорядок дня
        
        Ответ в формате JSON со структурой:
        {
            "energyType": "string",
            "productivityPeaks": ["утро", "день", "вечер"],
            "workoutRecommendations": "string",
            "nutritionRecommendations": "string",
            "dailySchedule": "string",
            "keyInsights": ["insight1", "insight2"]
        }
        `;

        const response = await axios.post(
            AI_ENDPOINT,
            {
                model: AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Ты специалист по хронотипам, циркадным ритмам и управлению энергией.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.3
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const content = response.data.choices[0].message.content;

        try {
            const jsonMatch = content.match(/```json\n([\s\(\S\)]*?)\n```/) ||
                content.match(/{[\s\S]*}/);

            if (jsonMatch) {
                const jsonStr = jsonMatch[1] || jsonMatch[0];
                const result = JSON.parse(jsonStr);

                res.json({
                    success: true,
                    calibration: result
                });
            } else {
                res.json({
                    success: true,
                    calibration: {
                        analysis: content
                    }
                });
            }
        } catch (parseError) {
            res.json({
                success: true,
                calibration: {
                    analysis: content
                }
            });
        }

    } catch (error) {
        console.error('Ошибка калибровки:', error);
        res.status(500).json({
            success: false,
            error: 'Не удалось выполнить калибровку'
        });
    }
});

// Генерация персонализированных советов
app.post('/api/ai/daily-tips', async (req, res) => {
    try {
        const { dayNumber, workoutType, nutritionFocus, userPreferences } = req.body;
        const apiKey = getAiKey();

        if (!apiKey) {
            return res.status(500).json({ success: false, error: 'API ключ не настроен на сервере' });
        }

        const prompt = `
        Сгенерируй персонализированные советы для дня ${dayNumber} курса по управлению энергией.
        
        Контекст:
        - Тип тренировки: ${workoutType}
        - Фокус питания: ${nutritionFocus}
        - Предпочтения пользователя: ${JSON.stringify(userPreferences)}
        
        Дай 5 практических советов по:
        1. Подготовке к тренировке
        2. Технике выполнения
        3. Восстановлению после
        4. Питанию для энергии
        5. Ментальному настрою
        
        Будь конкретным, практичным и мотивирующим.
        Отвечай на русском.
        `;

        const response = await axios.post(
            AI_ENDPOINT,
            {
                model: AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Ты персональный коуч по эффективности и управлению энергией.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.8
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({
            success: true,
            tips: response.data.choices[0].message.content
        });

    } catch (error) {
        console.error('Ошибка генерации советов:', error);
        res.status(500).json({
            success: false,
            error: 'Не удалось сгенерировать советы'
        });
    }
});

// ====================
// Существующие эндпоинты
// ====================

// Проверка пользователя Telegram
app.get('/api/check/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        if (bot) {
            const user = await bot.getChat(userId);
            res.json({
                success: true,
                userId: userId,
                name: user.first_name || 'Пользователь',
                username: user.username
            });
        } else {
            res.json({
                success: true,
                userId: userId,
                name: 'Демо Пользователь',
                username: 'demo_user'
            });
        }
    } catch (error) {
        console.error('Ошибка проверки пользователя:', error);
        res.json({
            success: false,
            error: 'Пользователь не найден'
        });
    }
});

// Создание Google Sheets для пользователя
app.post('/api/create-sheet', async (req, res) => {
    const { userId, userName } = req.body;

    try {
        await sheetsManager.initialize();
        const result = await sheetsManager.createUserSheet(userId, userName);

        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Ошибка создания таблицы:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Проверка статуса активации
app.get('/api/activation/status/:userId', async (req, res) => {
    const userId = req.params.userId;

    res.json({
        success: true,
        userId: userId,
        status: 'active',
        currentStep: 3,
        hasSheet: true,
        hasTelegram: true,
        isActivated: true
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`🤖 AI интеграция: ${getAiKey() ? 'активна' : 'требуется API ключ'}`);
});

// SPA fallback для всех маршрутов
const path = require('path');
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
