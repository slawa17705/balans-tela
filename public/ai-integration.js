// AI-ИНТЕГРАЦИЯ ДЛЯ БАЛАНС PRO (рабочая калибровка)
document.addEventListener('DOMContentLoaded', function () {
    console.log('🎯 AI система загружена');

    // Настраиваем кнопку AI в меню
    setupAIMenuButton();

    // Настраиваем кнопки AI помощи на странице
    setupAIHelpButtons();
});

// ============ КНОПКА AI В МЕНЮ ==============
function setupAIMenuButton() {
    const aiBtn = document.getElementById('menu-ai-btn');
    if (!aiBtn) {
        console.log('⚠️ Кнопка AI в меню не найдена');
        return;
    }

    // Удаляем старые обработчики
    const newBtn = aiBtn.cloneNode(true);
    aiBtn.parentNode.replaceChild(newBtn, aiBtn);

    // Добавляем новый обработчик
    document.getElementById('menu-ai-btn').addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('🎯 Запуск AI калибровки...');
        openAICalibrationForm();
    });
}

// ============ ОТКРЫТИЕ ФОРМЫ КАЛИБРОВКИ ==============
function openAICalibrationForm() {
    // Создаем модальное окно
    const modalHTML = `
    <div id="ai-calibration-modal" class="ai-modal-overlay">
        <div class="ai-modal-content">
            <h3><i class="fas fa-brain"></i> AI Калибровка энерготипа</h3>
            <p class="modal-subtitle">Заполните данные для персонализированных рекомендаций</p>
            
            <div class="ai-form">
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" id="ai-name" placeholder="Имя" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <select id="ai-gender" class="form-select" required>
                            <option value="">Пол</option>
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <input type="number" id="ai-age" placeholder="Возраст" class="form-input" min="15" max="80" required>
                    </div>
                    <div class="form-group">
                        <input type="number" id="ai-weight" placeholder="Вес (кг)" class="form-input" min="40" max="200" required>
                    </div>
                    <div class="form-group">
                        <input type="number" id="ai-height" placeholder="Рост (см)" class="form-input" min="140" max="220" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <select id="ai-activity" class="form-select" required>
                        <option value="">Уровень активности</option>
                        <option value="low">Низкий (офисная работа)</option>
                        <option value="medium">Средний (3-4 тренировки/неделю)</option>
                        <option value="high">Высокий (спортсмен, ежедневно)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <select id="ai-goal" class="form-select" required>
                        <option value="">Основная цель</option>
                        <option value="energy">Повысить энергию</option>
                        <option value="weight">Снизить вес</option>
                        <option value="muscle">Набрать мышцы</option>
                        <option value="health">Улучшить здоровье</option>
                        <option value="productivity">Повысить продуктивность</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <textarea id="ai-additional" placeholder="Дополнительная информация (травмы, особенности, пожелания)..." class="form-textarea" rows="3"></textarea>
                </div>
                
                <div class="modal-buttons">
                    <button id="ai-submit-btn" class="ai-submit-btn">
                        <i class="fas fa-magic"></i> Получить AI рекомендации
                    </button>
                    <button id="ai-cancel-btn" class="ai-cancel-btn">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Добавляем в DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Настраиваем обработчики
    document.getElementById('ai-submit-btn').addEventListener('click', submitAICalibration);
    document.getElementById('ai-cancel-btn').addEventListener('click', closeAIModal);

    // Закрытие по клику вне окна
    document.getElementById('ai-calibration-modal').addEventListener('click', function (e) {
        if (e.target === this) closeAIModal();
    });
}

// ============ ОТПРАВКА ДАННЫХ ==============
async function submitAICalibration() {
    const submitBtn = document.getElementById('ai-submit-btn');
    const originalText = submitBtn.innerHTML;

    // Собираем данные
    const userData = {
        name: document.getElementById('ai-name').value.trim(),
        gender: document.getElementById('ai-gender').value,
        age: document.getElementById('ai-age').value,
        weight: document.getElementById('ai-weight').value,
        height: document.getElementById('ai-height').value,
        activity: document.getElementById('ai-activity').value,
        goal: document.getElementById('ai-goal').value,
        additionalInfo: document.getElementById('ai-additional').value.trim()
    };

    // Валидация
    if (!userData.name || !userData.age || !userData.weight || !userData.height || !userData.activity || !userData.goal) {
        alert('❗ Заполните все обязательные поля!');
        return;
    }

    // Показываем загрузку
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI анализирует...';

    try {
        console.log('📤 Отправка данных AI:', userData);

        // Отправляем на РАБОЧИЙ endpoint из balans-tela-pro
        const response = await fetch('/api/ai/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-v3.2',
                messages: [
                    {
                        role: 'system',
                        content: 'Ты персональный фитнес-коуч и эксперт по питанию. Анализируй данные пользователя и давай персонализированные рекомендации по тренировкам и питанию.'
                    },
                    {
                        role: 'user',
                        content: `Проанализируй мои данные и дай рекомендации: ${JSON.stringify(userData)}`
                    }
                ],
                max_tokens: 1500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Ответ AI:', result);

        if (result.success && result.choices && result.choices.length > 0) {
            const aiResponse = result.choices[0].message.content;
            console.log('📝 AI сказал:', aiResponse);

            // Сохраняем результат
            localStorage.setItem('aiCalibration', JSON.stringify({
                ...userData,
                advice: aiResponse,
                timestamp: new Date().toISOString()
            }));
            localStorage.setItem('calibrationCompleted', 'true');

            // Показываем результат
            showAIResult(aiResponse, userData.name);

            // Обновляем прогресс в меню
            updateActivationProgress(3);

        } else {
            throw new Error(result.error || 'Ошибка AI');
        }

    } catch (error) {
        console.error('❌ Ошибка AI:', error);
        alert(`❌ Ошибка при получении рекомендаций:\n${error.message}\n\nПопробуйте позже или проверьте соединение.`);
    } finally {
        // Восстанавливаем кнопку
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ============ ПОКАЗ РЕЗУЛЬТАТА ==============
function showAIResult(advice, userName) {
    closeAIModal();

    // Создаем модалку с результатом
    const resultHTML = `
    <div id="ai-result-modal" class="ai-modal-overlay">
        <div class="ai-modal-content result-modal">
            <h3><i class="fas fa-star"></i> AI рекомендации для ${userName}</h3>
            <div class="ai-result-content">
                ${formatAIResponse(advice)}
            </div>
            <div class="modal-buttons">
                <button id="ai-close-result" class="ai-submit-btn">
                    <i class="fas fa-check"></i> Отлично, спасибо!
                </button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', resultHTML);

    document.getElementById('ai-close-result').addEventListener('click', function () {
        document.getElementById('ai-result-modal').remove();
    });

    document.getElementById('ai-result-modal').addEventListener('click', function (e) {
        if (e.target === this) this.remove();
    });
}

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==============
function closeAIModal() {
    const modal = document.getElementById('ai-calibration-modal');
    if (modal) modal.remove();
}

function formatAIResponse(text) {
    if (!text) return '<p>Нет ответа от AI</p>';

    // Форматируем текст
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/g, '<p>')
        .replace(/$/g, '</p>');
}

function updateActivationProgress(completedSteps) {
    const progressFill = document.getElementById('menu-progress');
    const progressText = document.getElementById('menu-progress-text');

    if (progressFill && progressText) {
        const percentage = (completedSteps / 4) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${completedSteps}/4 шагов`;

        if (completedSteps === 4) {
            progressFill.style.background = 'var(--success)';
        }
    }
}

// ============ КНОПКИ AI ПОМОЩИ ==============
function setupAIHelpButtons() {
    // Кнопки в меню
    document.querySelectorAll('.ai-action-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openAICalibrationForm();
        });
    });

    // Кнопки на странице
    const workoutBtn = document.getElementById('workout-ai-help');
    const nutritionBtn = document.getElementById('nutrition-ai-help');

    if (workoutBtn) {
        workoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openAICalibrationForm();
        });
    }

    if (nutritionBtn) {
        nutritionBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openAICalibrationForm();
        });
    }
}
