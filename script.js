// ===== БАЗОВЫЕ УТИЛИТЫ =====

// Функция для вывода в консоль (для отладки)
function log(message) {
    console.log(`[Сайт] ${message}`);
}

// Функция для получения элемента по ID
function get(id) {
    return document.getElementById(id);
}

// Функция для получения элементов по классу
function getAll(className) {
    return document.querySelectorAll(`.${className}`);
}
// ===== ПЕРЕКЛЮЧАТЕЛЬ ТЁМНОЙ ТЕМЫ =====
function initThemeSwitcher() {
    // Создаём кнопку
    const themeButton = document.createElement('button');
    themeButton.className = 'theme-switcher';
    themeButton.innerHTML = '🌙';
    themeButton.title = 'Сменить тему';
    
    // Добавляем кнопку на страницу
    document.body.appendChild(themeButton);
    
    // Проверяем, какая тема сохранена
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeButton.innerHTML = '☀️';
    }
    
    // Обработчик клика
    themeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Меняем иконку
        if (document.body.classList.contains('dark  -theme')) {
            themeButton.innerHTML = '☀️';
            localStorage.setItem('theme', 'dark');
            log('Тема изменена на тёмную');
        } else {
            themeButton.innerHTML = '🌙';
            localStorage.setItem('theme', 'light');
            log('Тема изменена на светлую');
        }
    });
    
    log('Переключатель темы инициализирован');
}
// ===== СЧЁТЧИК ПОСЕЩЕНИЙ (улучшенная версия) =====
function initVisitCounter() {
    log('Инициализация счётчика посещений...');
    
    // Определяем имя страницы для ключа в localStorage
    let pageKey = window.location.pathname.split('/').pop() || 'index.html';
    
    // Для главной страницы (/) используем 'index.html'
    if (pageKey === '' || pageKey === '/') {
        pageKey = 'index.html';
    }
    
    log(`Ключ страницы: ${pageKey}`);
    
    // Инициализируем или получаем данные
    let visitData = JSON.parse(localStorage.getItem('visitData')) || {
        counts: {},
        lastVisit: {},
        firstVisit: {}
    };
    
    // Инициализируем счётчик для этой страницы если его нет
    if (!visitData.counts[pageKey]) {
        visitData.counts[pageKey] = 0;
        visitData.firstVisit[pageKey] = new Date().toISOString();
    }
    
    // Увеличиваем счётчик
    visitData.counts[pageKey]++;
    visitData.lastVisit[pageKey] = new Date().toISOString();
    
    // Сохраняем обновлённые данные
    localStorage.setItem('visitData', JSON.stringify(visitData));
    
    // Отображаем счётчик на странице
    displayVisitCounter(pageKey, visitData.counts[pageKey]);
    
    // Также показываем общую статистику
    showTotalStats(visitData);
}

// Функция отображения счётчика
function displayVisitCounter(pageKey, count) {
    // 1. Ищем стандартные элементы .visit-counter
    const counterElements = document.querySelectorAll('.visit-counter');
    
    if (counterElements.length > 0) {
        counterElements.forEach(element => {
            element.textContent = count;
            element.style.fontWeight = 'bold';
            element.style.color = '#e74c3c';
            element.style.marginLeft = '5px';
        });
        log(`Счётчик отображён: ${pageKey} = ${count}`);
    } else {
        // 2. Если элементов нет, создаём автоматически
        createAutoCounter(pageKey, count);
    }
}

// Автоматическое создание счётчика если нет в HTML
function createAutoCounter(pageKey, count) {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    
    // Проверяем, нет ли уже автоматического счётчика
    if (document.querySelector('.auto-visit-counter')) {
        return;
    }
    
    const counterDiv = document.createElement('div');
    counterDiv.className = 'auto-visit-counter';
    counterDiv.innerHTML = `
        <div style="
            background: #f8f9fa;
            padding: 10px 15px;
            border-radius: 8px;
            margin-top: 1rem;
            border-left: 4px solid #3498db;
            font-size: 0.9rem;
        ">
            <strong>📊 Статистика посещений:</strong><br>
            Эта страница: <strong style="color: #e74c3c">${count}</strong> раз
        </div>
    `;
    
    footer.insertBefore(counterDiv, footer.firstChild);
    log(`Автоматически создан счётчик для ${pageKey}: ${count}`);
}

// Показываем общую статистику (опционально)
function showTotalStats(visitData) {
    const totalVisits = Object.values(visitData.counts).reduce((sum, val) => sum + val, 0);
    const pagesCount = Object.keys(visitData.counts).length;
    
    // Можно добавить где-нибудь на странице, например в консоль
    log(`Общая статистика: ${totalVisits} посещений на ${pagesCount} страницах`);
    
    // Или создать виджет статистики (по желанию)
    if (pagesCount > 1 && document.querySelector('.visit-stats-widget')) {
        document.querySelector('.visit-stats-widget').innerHTML = `
            Всего посещений: ${totalVisits} | Страниц: ${pagesCount}
        `;
    }
}

// Добавьте эту функцию в initializeApp()
// Вызов уже есть в initVisitCounter()
// ===== ИНТЕРАКТИВНАЯ ГАЛЕРЕЯ ПРОЕКТОВ =====
function initProjectGallery() {
    // Только на странице проектов
    if (!window.location.pathname.includes('projects.html')) {
        return;
    }
    
    log('Инициализация галереи проектов');
    
    // Добавляем фильтры
    const filterHTML = `
        <div style="margin: 1.5rem 0; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
            <h3 style="margin-top: 0;">Фильтр проектов по технологиям:</h3>
            <div class="filter-buttons" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="filter-btn active" data-filter="all">Все</button>
                <button class="filter-btn" data-filter="html">HTML5</button>
                <button class="filter-btn" data-filter="css">CSS3</button>
                <button class="filter-btn" data-filter="flexbox">Flexbox</button>
                <button class="filter-btn" data-filter="grid">Grid</button> 
            </div>
            <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                <span id="project-count">3</span> проектов найдено
            </p>
        </div>
    `;
    
    // Добавляем фильтры после заголовка галереи
    const galleryTitle = document.querySelector('h2');
    if (galleryTitle && galleryTitle.textContent.includes('Галерея')) {
        galleryTitle.insertAdjacentHTML('afterend', filterHTML);
        
        // Инициализируем фильтры
        initFilters();
    }
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    // Обновляем счетчик
    updateProjectCount(projectItems.length);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Обновляем активную кнопку
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Фильтруем проекты
            projectItems.forEach(item => {
                const techTags = Array.from(item.querySelectorAll('.tech-tag'))
                    .map(tag => tag.textContent.toLowerCase());
                
                if (filter === 'all' || techTags.some(tag => tag.includes(filter))) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Обновляем счетчик видимых проектов
            const visibleCount = document.querySelectorAll('.project-item[style*="display: block"]').length;
            updateProjectCount(visibleCount);
            
            log(`Применён фильтр: ${filter}, показано проектов: ${visibleCount}`);
        });
    });
}


function updateProjectCount(count) {
    const countElement = document.getElementById('project-count');
    if (countElement) {
        countElement.textContent = count;
        countElement.style.color = count > 0 ? '#27ae60' : '#e74c3c';
    }
}
// ===== ТЕКУЩАЯ ДАТА =====
function initCurrentDate() {
    // Находим все элементы с классом current-date
    const dateElements = document.querySelectorAll('.current-date');
    
    if (dateElements.length > 0) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = now.toLocaleDateString('ru-RU', options);
        
        dateElements.forEach(element => {
            element.textContent = formattedDate;
        });
        
        log(`Текущая дата: ${formattedDate}`);
    }
}
// Простой эффект печатной машинки для заголовка
function initTypewriter() {
    const titles = document.querySelectorAll('.site-title');
    
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Запускаем с задержкой
        setTimeout(typeWriter, 500);
    });
}   
// Функция для виджета статистики
function initStatsWidget() {
    const widget = document.querySelector('.visit-stats-widget');
    if (!widget) return;
    
    const visitData = JSON.parse(localStorage.getItem('visitData')) || {counts: {}};
    const totalVisits = Object.values(visitData.counts).reduce((sum, val) => sum + val, 0);
    const pagesCount = Object.keys(visitData.counts).length;
    
    // Форматируем дату первого посещения
    let firstVisitDate = 'ещё нет';
    const firstVisits = Object.values(visitData.firstVisit || {});
    if (firstVisits.length > 0) {
        const earliest = new Date(Math.min(...firstVisits.filter(d => d).map(d => new Date(d))));
        firstVisitDate = earliest.toLocaleDateString('ru-RU');
    }
    
    // Самые популярные страницы
    const popularPages = Object.entries(visitData.counts || {})
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([page, count]) => {
            const pageName = getPageName(page);
            return `${pageName}: ${count}`;
        });
    
    const statsHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
            <div>
                <div style="font-size: 2rem; font-weight: bold;">${totalVisits}</div>
                <div>всего посещений</div>
            </div>
            <div>
                <div style="font-size: 2rem; font-weight: bold;">${pagesCount}</div>
                <div>страниц отслеживается</div>
            </div>
            <div>
                <div style="font-size: 1.5rem; font-weight: bold;">${firstVisitDate}</div>
                <div>первое посещение</div>
            </div>
        </div>
        ${popularPages.length > 0 ? `
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2);">
            <strong>Самые популярные страницы:</strong><br>
            ${popularPages.join(' | ')}
        </div>` : ''}
    `;
    
    document.getElementById('stats-content').innerHTML = statsHTML;
    log('Виджет статистики обновлён');
}

// Вспомогательная функция для красивого имени страницы
function getPageName(pageKey) {
    const pageNames = {
        'index.html': 'Главная',
        'diary.html': 'Дневник',
        'projects.html': 'Проекты'
    };
    return pageNames[pageKey] || pageKey.replace('.html', '');
}

// Добавьте вызов в initializeApp():
// initStatsWidget();
// Запускаем когда страница полностью загружена
document.addEventListener('DOMContentLoaded', function() {
    log('Страница загружена!');
    initTypewriter(); // После других инициализаций
    // Здесь будем запускать все наши функции
    initThemeSwitcher();
    initVisitCounter();
    initProjectGallery();
    initCurrentDate();
});