const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const toggleIcon = toggle?.querySelector('span');

function preferredTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (!toggle || !toggleIcon) return;
  const isDark = theme === 'dark';
  toggleIcon.textContent = isDark ? '☀' : '☾';
  toggle.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
}

applyTheme(preferredTheme());

toggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', nextTheme);
  applyTheme(nextTheme);
});
