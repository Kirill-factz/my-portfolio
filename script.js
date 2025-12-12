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
        if (document.body.classList.contains('dark-theme')) {
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
// ===== СЧЁТЧИК ПОСЕЩЕНИЙ =====
function initVisitCounter() {
    // Получаем текущую страницу
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Инициализируем счетчик в localStorage
    if (!localStorage.getItem('visitCounts')) {
        localStorage.setItem('visitCounts', JSON.stringify({}));
    }
    
    // Получаем все счетчики
    let visitCounts = JSON.parse(localStorage.getItem('visitCounts'));
    
    // Увеличиваем счетчик для текущей страницы
    visitCounts[currentPage] = (visitCounts[currentPage] || 0) + 1;
    
    // Сохраняем обратно
    localStorage.setItem('visitCounts', JSON.stringify(visitCounts));
    
    // Находим все места для вывода счетчика
    const counterElements = document.querySelectorAll('.visit-counter');
    
    if (counterElements.length > 0) {
        counterElements.forEach(element => {
            element.textContent = visitCounts[currentPage];
            element.style.fontWeight = 'bold';
            element.style.color = '#e74c3c';
        });
        
        log(`Посещений этой страницы: ${visitCounts[currentPage]}`);
    }
}
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