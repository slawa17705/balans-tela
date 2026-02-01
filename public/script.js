// =============================================
// БАЛАНС PRO - Основная логика сайта
// ПРОСТАЯ И РАБОЧАЯ ВЕРСИЯ
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ БАЛАНС PRO загружен');

    // ПОКАЗЫВАЕМ ОСНОВНОЙ САЙТ СРАЗУ
    document.getElementById('main-content').style.display = 'block';

    // 1. Настройка бургер-меню (простое открытие/закрытие)
    setupBurgerMenu();

    // 2. Настройка активации в меню (простая)
    setupMenuActivation();

    // 3. Запускаем курс СРАЗУ
    window.courseManager = new CourseManager();
});

// ============ ПРОСТОЕ БУРГЕР-МЕНЮ ==============
function setupBurgerMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeMenu = document.getElementById('close-menu');

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', function () {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMenu && menuOverlay) {
        closeMenu.addEventListener('click', function () {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', function (e) {
            if (e.target === menuOverlay) {
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ============ ПРОСТАЯ АКТИВАЦИЯ В МЕНЮ ==============
function setupMenuActivation() {
    // Telegram
    const telegramBtn = document.getElementById('menu-telegram-btn');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', function () {
            window.open('https://t.me/The_Balans_bot', '_blank');
            alert('📱 Бот открыт. Отправьте /start и /id');
        });
    }

    // Excel
    const excelBtn = document.getElementById('menu-excel-btn');
    if (excelBtn) {
        excelBtn.addEventListener('click', function () {
            const link = document.createElement('a');
            link.href = 'https://docs.google.com/spreadsheets/d/1v1OjYNpdFjDjx_Zag6s56Bz-qtJKQYm89J7AnTGF0Ms/export?format=xlsx';
            link.download = 'БАЛАНС-PRO-шаблон.xlsx';
            link.click();
        });
    }

    // AI Калибровка
    const aiBtn = document.getElementById('menu-ai-btn');
    if (aiBtn) {
        aiBtn.addEventListener('click', function () {
            alert('AI калибровка будет доступна после настройки сервера');
        });
    }
}

// ============ ТВОЙ ОРИГИНАЛЬНЫЙ КУРС ==============
const COURSE_DATA = {
    startDate: null,
    totalDays: 49,
    currentDay: 1,

    days: {
        1: {
            week: 1,
            title: "Диагностика и адаптация",
            workout: {
                title: "Безопасный старт: Тест на подвижность",
                type: "Адаптивная разминка",
                exercises: [
                    { name: "Разминка суставов", sets: "5 минут вращений", icon: "fas fa-redo-alt", tip: "Медленные круговые движения" },
                    { name: "Тест приседа", sets: "3 подхода по 10 повторений", icon: "fas fa-user", tip: "Держите спину прямо" },
                    { name: "Тест отжиманий", sets: "Максимальное количество", icon: "fas fa-fire", tip: "Локти под 45 градусов" },
                    { name: "Растяжка", sets: "5 минут на все группы", icon: "fas fa-spa", tip: "Без боли, только напряжение" }
                ],
                tips: [
                    "Слушайте свое тело - не перенапрягайтесь",
                    "Делайте перерывы между подходами",
                    "Пейте воду во время тренировки"
                ],
                gallery: [
                    { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop", title: "Разминка" },
                    { url: "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=300&h=300&fit=crop", title: "Приседания" },
                    { url: "https://images.unsplash.com/photo-1598974357801-cbca100e5d10?w=300&h=300&fit=crop", title: "Отжимания" }
                ]
            },
            nutrition: {
                title: "Энергетический дневник питания",
                focus: "Наблюдение за реакцией организма",
                meals: [
                    { name: "Завтрак", description: "Овсянка + фрукты", icon: "fas fa-apple-alt", time: "8:00" },
                    { name: "Обед", description: "Курица + овощи", icon: "fas fa-drumstick-bite", time: "13:00" },
                    { name: "Ужин", description: "Рыба + салат", icon: "fas fa-fish", time: "19:00" },
                    { name: "Перекусы", description: "Орехи, йогурт", icon: "fas fa-seedling", time: "11:00, 16:00" }
                ],
                tips: [
                    "Записывайте время приема пищи",
                    "Отмечайте уровень энергии после еды",
                    "Пейте 2 литра воды в день"
                ],
                gallery: [
                    { url: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&h=300&fit=crop", title: "Завтрак" },
                    { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop", title: "Обед" },
                    { url: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=300&h=300&fit=crop", title: "Перекусы" }
                ]
            }
        },

        // Генерируем остальные дни
        2: generateDayData(1, "Освоение базовых движений", "Силовая тренировка"),
        3: generateDayData(1, "Развитие подвижности", "Мобильность и гибкость"),
        4: generateDayData(1, "Адаптация к нагрузке", "Кардио и выносливость"),
        5: generateDayData(1, "Стабилизация корпуса", "Стабилизация и баланс"),
        6: generateDayData(1, "Интеграция дыхания", "Дыхательные практики"),
        7: generateDayData(1, "Закрепление недели", "Обобщающая тренировка"),

        8: generateDayData(2, "Утренний ритм", "Утренняя активность"),
        9: generateDayData(2, "Рабочий ритм", "Офисная гимнастика"),
        10: generateDayData(2, "Обеденный перерыв", "Активный отдых"),
        11: generateDayData(2, "Вечерняя разрядка", "Снятие напряжения"),
        12: generateDayData(2, "Предсонный ритм", "Релаксация"),
        13: generateDayData(2, "Выходной день", "Активное восстановление"),
        14: generateDayData(2, "Планирование недели", "Подготовка"),

        15: generateDayData(3, "Энергия завтрака", "Утреннее питание"),
        16: generateDayData(3, "Обед без сонливости", "Дневное питание"),
        17: generateDayData(3, "Легкий ужин", "Вечернее питание"),
        18: generateDayData(3, "Правильные перекусы", "Между приемами"),
        19: generateDayData(3, "Гидратация мозга", "Вода и эффективность"),
        20: generateDayData(3, "Детокс день", "Очищение"),
        21: generateDayData(3, "Читмил", "Психологическая разгрузка"),

        22: generateDayData(4, "Интенсивная тренировка", "Пиковая нагрузка"),
        23: generateDayData(4, "Активное восстановление", "Легкая активность"),
        24: generateDayData(4, "Силовая сессия", "Мышечная работа"),
        25: generateDayData(4, "Кардио день", "Выносливость"),
        26: generateDayData(4, "Растяжка и мобильность", "Гибкость"),
        27: generateDayData(4, "Полный отдых", "Восстановление"),
        28: generateDayData(4, "Анализ прогресса", "Оценка результатов"),

        29: generateDayData(5, "Стресс-тест", "Адаптация к стрессу"),
        30: generateDayData(5, "Энергосбережение", "Экономия сил"),
        31: generateDayData(5, "Быстрая перезагрузка", "Восстановление"),
        32: generateDayData(5, "Работа с усталостью", "Борьба с утомлением"),
        33: generateDayData(5, "Мотивационный день", "Стимуляция"),
        34: generateDayData(5, "Аварийный протокол", "Кризисный режим"),
        35: generateDayData(5, "Стабилизация", "Возврат к норме"),

        36: generateDayData(6, "Индивидуализация", "Персональный подход"),
        37: generateDayData(6, "Эксперименты", "Тестирование нового"),
        38: generateDayData(6, "Оптимизация", "Улучшение процессов"),
        39: generateDayData(6, "Автоматизация", "Создание привычек"),
        40: generateDayData(6, "Интеграция", "Объединение элементов"),
        41: generateDayData(6, "Балансировка", "Поиск равновесия"),
        42: generateDayData(6, "Калибровка", "Точная настройка"),

        43: generateDayData(7, "Финальная сборка", "Интеграция системы"),
        44: generateDayData(7, "Тестирование", "Проверка работы"),
        45: generateDayData(7, "Корректировка", "Исправление ошибок"),
        46: generateDayData(7, "Автоматизация", "Перевод в привычку"),
        47: generateDayData(7, "Мониторинг", "Отслеживание результатов"),
        48: generateDayData(7, "Поддержка", "Создание поддержки"),

        49: {
            week: 7,
            title: "Финальная сборка системы",
            workout: {
                title: "Индивидуальная тренировка",
                type: "Комплексная сессия",
                exercises: [
                    { name: "Разминка", sets: "По вашему протоколу", icon: "fas fa-running", tip: "Индивидуальная программа" },
                    { name: "Силовые упражнения", sets: "3 любимых упражнения", icon: "fas fa-dumbbell", tip: "Выберите наиболее эффективные" },
                    { name: "Кардио", sets: "15 минут", icon: "fas fa-heartbeat", tip: "Любой вид кардионагрузки" },
                    { name: "Растяжка", sets: "10 минут", icon: "fas fa-spa", tip: "Завершающая сессия" }
                ],
                tips: [
                    "Используйте наработанные техники",
                    "Оцените прогресс за курс",
                    "Создайте план на следующие 3 месяца"
                ],
                gallery: [
                    { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop", title: "Тренировка" },
                    { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop", title: "Разминка" },
                    { url: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&h=300&fit=crop", title: "Растяжка" }
                ]
            },
            nutrition: {
                title: "Персональный рацион",
                focus: "Поддержание результатов",
                meals: [
                    { name: "Индивидуальная схема", description: "Ваш план питания", icon: "fas fa-clipboard-list", time: "Индивидуально" },
                    { name: "Гибкий подход", description: "Адаптация под ритм", icon: "fas fa-balance-scale", time: "По потребностям" },
                    { name: "Осознанный выбор", description: "Слушайте организм", icon: "fas fa-brain", time: "Всегда" },
                    { name: "Водный баланс", description: "2-3 литра воды", icon: "fas fa-tint", time: "В течение дня" }
                ],
                tips: [
                    "Слушайте сигналы голода и насыщения",
                    "Поддерживайте водный баланс",
                    "Планируйте питание на неделю"
                ],
                gallery: [
                    { url: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&h=300&fit=crop", title: "Питание" },
                    { url: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=300&h=300&fit=crop", title: "Здоровая еда" },
                    { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", title: "Гидротация" }
                ]
            }
        }
    },

    weeks: {
        1: "Экстренные протоколы: Базовые навыки",
        2: "Ритмы дня: Интеграция в расписание",
        3: "Энергетическое питание: Основы",
        4: "Нагрузка и восстановление: Баланс",
        5: "Антикризисные протоколы: Устойчивость",
        6: "Оптимизация системы: Индивидуализация",
        7: "Финальная сборка: Автоматизация"
    }
};

// ============ ГЕНЕРАЦИЯ ДАННЫХ ДЛЯ ДНЯ ==============
function generateDayData(week, title, workoutType) {
    const exerciseIcons = ["fas fa-dumbbell", "fas fa-running", "fas fa-spa", "fas fa-fire"];
    const mealIcons = ["fas fa-apple-alt", "fas fa-drumstick-bite", "fas fa-fish", "fas fa-seedling"];

    return {
        week: week,
        title: title,
        workout: {
            title: `${workoutType}: День недели ${week}`,
            type: workoutType,
            exercises: [
                { name: "Упражнение 1", sets: "3×10 повторений", icon: exerciseIcons[0], tip: "Техника важнее веса" },
                { name: "Упражнение 2", sets: "3×12 повторений", icon: exerciseIcons[1], tip: "Держите спину прямо" },
                { name: "Упражнение 3", sets: "3×15 повторений", icon: exerciseIcons[2], tip: "Контролируйте движение" },
                { name: "Упражнение 4", sets: "3×30 секунд", icon: exerciseIcons[3], tip: "Напрягайте мышцы кора" }
            ],
            tips: ["Слушайте свое тело", "Пейте воду во время тренировки", "Отдыхайте между подходами"],
            gallery: [
                { url: "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=300&h=300&fit=crop", title: "Приседания" },
                { url: "https://images.unsplash.com/photo-1598974357801-cbca100e5d10?w=300&h=300&fit=crop", title: "Отжимания" },
                { url: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&h=300&fit=crop", title: "Растяжка" }
            ]
        },
        nutrition: {
            title: "Сбалансированное питание",
            focus: "Энергия на весь день",
            meals: [
                { name: "Завтрак", description: "Сложные углеводы + белок", icon: mealIcons[0], time: "8:00" },
                { name: "Обед", description: "Белок + овощи", icon: mealIcons[1], time: "13:00" },
                { name: "Ужин", description: "Легкий белок + салат", icon: mealIcons[2], time: "19:00" },
                { name: "Перекусы", description: "Фрукты, орехи", icon: mealIcons[3], time: "11:00, 16:00" }
            ],
            tips: ["Ешьте медленно", "Слушайте сигналы голода", "Пейте воду между приемами"],
            gallery: [
                { url: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&h=300&fit=crop", title: "Завтрак" },
                { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop", title: "Обед" },
                { url: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=300&h=300&fit=crop", title: "Перекусы" }
            ]
        }
    };
}

// ============ КЛАСС МЕНЕДЖЕРА КУРСА ==============
class CourseManager {
    constructor() {
        console.log('✅ CourseManager создан');
        this.currentDay = 1;
        this.initializeCourse();
        this.loadCurrentDay();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeCourse() {
        if (!localStorage.getItem('courseStartDate')) {
            const startDate = new Date().toISOString();
            localStorage.setItem('courseStartDate', startDate);
            localStorage.setItem('courseDay', '1');
            localStorage.setItem('completedDays', JSON.stringify([]));
            console.log('📅 Курс инициализирован, начальная дата:', startDate);
        }

        COURSE_DATA.startDate = localStorage.getItem('courseStartDate');
        this.currentDay = parseInt(localStorage.getItem('courseDay')) || 1;
    }

    loadCurrentDay() {
        if (!COURSE_DATA.startDate) return;

        const startDate = new Date(COURSE_DATA.startDate);
        const today = new Date();
        const diffTime = today - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        this.currentDay = Math.min(Math.max(1, diffDays), COURSE_DATA.totalDays);
        localStorage.setItem('courseDay', this.currentDay.toString());
        console.log('📅 Загружен день:', this.currentDay, 'Неделя:', Math.ceil(this.currentDay / 7));
    }

    // ============ ГЛАВНАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ДНЕЙ ==============
    goToDay(day) {
        if (day >= 1 && day <= COURSE_DATA.totalDays) {
            this.currentDay = day;
            localStorage.setItem('courseDay', day.toString());
            this.updateDisplay();
            this.markDayCompleted(day - 1);
            console.log('➡️ Перешли на день:', day, 'Неделя:', Math.ceil(day / 7));
            this.updateButtonStates();
        }
    }

    updateButtonStates() {
        const prevBtn = document.getElementById('prev-day-btn');
        const nextBtn = document.getElementById('next-day-btn');

        if (prevBtn) {
            prevBtn.disabled = this.currentDay <= 1;
            prevBtn.style.opacity = this.currentDay <= 1 ? '0.5' : '1';
            prevBtn.style.cursor = this.currentDay <= 1 ? 'not-allowed' : 'pointer';
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentDay >= COURSE_DATA.totalDays;
            nextBtn.style.opacity = this.currentDay >= COURSE_DATA.totalDays ? '0.5' : '1';
            nextBtn.style.cursor = this.currentDay >= COURSE_DATA.totalDays ? 'not-allowed' : 'pointer';
        }
    }

    markDayCompleted(dayIndex) {
        const completedDays = JSON.parse(localStorage.getItem('completedDays')) || [];
        if (!completedDays.includes(dayIndex)) {
            completedDays.push(dayIndex);
            localStorage.setItem('completedDays', JSON.stringify(completedDays));
        }
    }

    // ============ ГЛАВНОЕ ОБНОВЛЕНИЕ ВСЕХ ДАННЫХ ==============
    updateDisplay() {
        const dayData = COURSE_DATA.days[this.currentDay];

        if (!dayData) {
            console.error('❌ Нет данных для дня:', this.currentDay);
            return;
        }

        console.log('🔄 Обновление дня:', this.currentDay, 'Неделя:', dayData.week);

        // 1. ЗАГОЛОВОК ДНЯ И НЕДЕЛИ
        document.getElementById('current-day').textContent = this.currentDay;
        document.getElementById('current-week').textContent = dayData.week;
        document.getElementById('day-title').textContent = dayData.title;

        // 2. ДАТА
        if (COURSE_DATA.startDate) {
            const startDate = new Date(COURSE_DATA.startDate);
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + this.currentDay - 1);
            document.getElementById('day-date').textContent =
                `Дата дня: ${currentDate.toLocaleDateString('ru-RU')}`;
        }

        // 3. ТРЕНИРОВКА
        document.getElementById('workout-type').textContent = dayData.workout.type;
        document.getElementById('workout-title').textContent = dayData.workout.title;
        document.getElementById('workout-description').textContent =
            `Тренировка дня ${this.currentDay}: ${dayData.workout.type}`;

        // Упражнения
        const workoutExercises = document.getElementById('workout-exercises');
        if (workoutExercises) {
            workoutExercises.innerHTML = dayData.workout.exercises
                .map(ex => `
                    <div class="exercise-item">
                        <i class="${ex.icon}"></i>
                        <div>
                            <strong>${ex.name}:</strong> ${ex.sets}
                            <div class="exercise-tip">${ex.tip}</div>
                        </div>
                    </div>
                `).join('');
        }

        // Советы по тренировке
        const workoutTips = document.getElementById('workout-tips');
        if (workoutTips) {
            workoutTips.innerHTML = dayData.workout.tips
                .map(tip => `<li>${tip}</li>`).join('');
        }

        // Галерея тренировок
        const exerciseGallery = document.getElementById('exercise-gallery');
        if (exerciseGallery && dayData.workout.gallery) {
            exerciseGallery.innerHTML = dayData.workout.gallery
                .map(img => `
                    <div class="exercise-thumb">
                        <img src="${img.url}&auto=format&fit=crop" alt="${img.title}" loading="lazy">
                        <span>${img.title}</span>
                    </div>
                `).join('');
        }

        // 4. ПИТАНИЕ
        document.getElementById('nutrition-focus').textContent = dayData.nutrition.focus;
        document.getElementById('nutrition-title').textContent = dayData.nutrition.title;
        document.getElementById('nutrition-description').textContent =
            `Фокус питания: ${dayData.nutrition.focus}`;

        // Приемы пищи
        const nutritionMeals = document.getElementById('nutrition-meals');
        if (nutritionMeals) {
            nutritionMeals.innerHTML = dayData.nutrition.meals
                .map(meal => `
                    <div class="nutrition-item">
                        <i class="${meal.icon}"></i>
                        <div>
                            <strong>${meal.name}:</strong> ${meal.description}
                            <div class="exercise-tip">Время: ${meal.time}</div>
                        </div>
                    </div>
                `).join('');
        }

        // Расписание питания
        const mealTimes = document.getElementById('meal-times');
        if (mealTimes) {
            mealTimes.innerHTML = dayData.nutrition.meals
                .map(meal => `<div><strong>${meal.time}:</strong> ${meal.name} - ${meal.description}</div>`)
                .join('');
        }

        // Галерея питания
        const nutritionGallery = document.getElementById('nutrition-gallery');
        if (nutritionGallery && dayData.nutrition.gallery) {
            nutritionGallery.innerHTML = dayData.nutrition.gallery
                .map(img => `
                    <div class="exercise-thumb">
                        <img src="${img.url}&auto=format&fit=crop" alt="${img.title}" loading="lazy">
                        <span>${img.title}</span>
                    </div>
                `).join('');
        }

        // 5. ПРОГРЕСС-БАР
        this.updateProgress();

        // 6. КНОПКИ
        this.updateButtonStates();

        // 7. ТАБЫ НЕДЕЛЬ (если переключились на другую неделю)
        this.updateWeekTab();
    }

    updateProgress() {
        const weeksProgress = document.getElementById('weeks-progress');
        if (!weeksProgress) return;

        const completedDays = JSON.parse(localStorage.getItem('completedDays')) || [];

        let html = '';
        for (let week = 1; week <= 7; week++) {
            const isActive = week === Math.ceil(this.currentDay / 7);
            const weekStart = (week - 1) * 7 + 1;

            let daysHtml = '';
            for (let day = 0; day < 7; day++) {
                const dayNumber = weekStart + day;
                if (dayNumber > COURSE_DATA.totalDays) break;

                const isCompleted = completedDays.includes(dayNumber - 1);
                const isCurrent = dayNumber === this.currentDay;

                let className = 'day-dot';
                if (isCompleted) className += ' completed';
                if (isCurrent) className += ' current';

                daysHtml += `<span class="${className}" data-day="${dayNumber}">${day + 1}</span>`;
            }

            html += `
                <div class="week-progress ${isActive ? 'active' : ''}">
                    <div class="week-number">НЕДЕЛЯ ${week}</div>
                    <div class="week-title">${COURSE_DATA.weeks[week]}</div>
                    <div class="week-days">${daysHtml}</div>
                </div>
            `;
        }

        weeksProgress.innerHTML = html;

        // Обработчики кликов на дни
        weeksProgress.querySelectorAll('.day-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const dayNumber = parseInt(e.target.dataset.day);
                if (dayNumber) {
                    this.goToDay(dayNumber);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    setupEventListeners() {
        // Кнопки навигации
        const prevBtn = document.getElementById('prev-day-btn');
        const nextBtn = document.getElementById('next-day-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentDay > 1) {
                    this.goToDay(this.currentDay - 1);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentDay < COURSE_DATA.totalDays) {
                    this.goToDay(this.currentDay + 1);
                }
            });
        }

        // Табы недель
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const week = parseInt(btn.dataset.week);
                this.showWeekContent(week);

                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
            });
        });

        // FAQ аккордеон
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                item.classList.toggle('active');
            });
        });
    }

    showWeekContent(weekNumber) {
        const weekContent = document.getElementById('week-content');
        if (!weekContent) return;

        const weekStart = (weekNumber - 1) * 7 + 1;

        let html = '';
        for (let day = 0; day < 7; day++) {
            const dayNumber = weekStart + day;
            if (dayNumber > COURSE_DATA.totalDays) break;

            const dayData = COURSE_DATA.days[dayNumber] || generateDayData(weekNumber, `День ${dayNumber}`, "Тренировка");

            html += `
                <div class="day-details">
                    <h3><i class="fas fa-calendar-day"></i> День ${dayNumber}: ${dayData.title}</h3>
                    <div class="day-schedule">
                        <div class="schedule-item workout">
                            <h4><i class="fas fa-dumbbell"></i> Тренировка</h4>
                            <p><strong>${dayData.workout.title}</strong></p>
                            <div class="exercise-list-mini">
                                ${dayData.workout.exercises.map(ex => `
                                    <div class="exercise-item-mini">
                                        <i class="${ex.icon}"></i>
                                        <span><strong>${ex.name}:</strong> ${ex.sets}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="schedule-item nutrition">
                            <h4><i class="fas fa-utensils"></i> Питание</h4>
                            <p><strong>${dayData.nutrition.title}</strong></p>
                            <div class="nutrition-list-mini">
                                ${dayData.nutrition.meals.map(meal => `
                                    <div class="nutrition-item-mini">
                                        <i class="${meal.icon}"></i>
                                        <span><strong>${meal.name}:</strong> ${meal.description}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        weekContent.innerHTML = html;
    }

    updateWeekTab() {
        // Активируем таб текущей недели
        const currentWeek = Math.ceil(this.currentDay / 7);
        const tabBtn = document.querySelector(`.tab-btn[data-week="${currentWeek}"]`);

        if (tabBtn && !tabBtn.classList.contains('active')) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabBtn.classList.add('active');
            this.showWeekContent(currentWeek);
        }
    }
}

window.CourseManager = CourseManager;
