/**
 * 主题切换功能
 * 支持三种模式：light（明亮）、dark（暗色）、auto（跟随系统）
 */

(function() {
  const THEME_KEY = 'theme-preference';
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  };

  // 获取存储的主题偏好，默认为 auto
  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || THEMES.AUTO;
  }

  // 存储主题偏好
  function setStoredTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }

  // 获取系统主题偏好
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
  }

  // 应用主题
  function applyTheme(theme) {
    const effectiveTheme = theme === THEMES.AUTO ? getSystemTheme() : theme;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    // 更新按钮状态
    updateToggleButton(theme);
  }

  // 更新切换按钮显示
  function updateToggleButton(theme) {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    const icon = button.querySelector('i');
    const text = button.querySelector('.theme-text');
    
    // 移除所有图标类
    icon.className = '';
    
    // 获取 i18n 文本
    const i18n = window.themeI18n || {
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto'
    };
    
    switch(theme) {
      case THEMES.LIGHT:
        icon.className = 'fa-solid fa-sun';
        if (text) text.textContent = i18n.light;
        button.setAttribute('data-theme', 'light');
        break;
      case THEMES.DARK:
        icon.className = 'fa-solid fa-moon';
        if (text) text.textContent = i18n.dark;
        button.setAttribute('data-theme', 'dark');
        break;
      case THEMES.AUTO:
      default:
        icon.className = 'fa-solid fa-circle-half-stroke';
        if (text) text.textContent = i18n.auto;
        button.setAttribute('data-theme', 'auto');
        break;
    }
  }

  // 切换主题（循环：auto -> light -> dark -> auto）
  function toggleTheme() {
    const currentTheme = getStoredTheme();
    let nextTheme;
    
    switch(currentTheme) {
      case THEMES.AUTO:
        nextTheme = THEMES.LIGHT;
        break;
      case THEMES.LIGHT:
        nextTheme = THEMES.DARK;
        break;
      case THEMES.DARK:
      default:
        nextTheme = THEMES.AUTO;
        break;
    }
    
    setStoredTheme(nextTheme);
    applyTheme(nextTheme);
  }

  // 初始化主题
  function initTheme() {
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme);

    // 监听系统主题变化（仅在 auto 模式下生效）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (getStoredTheme() === THEMES.AUTO) {
        applyTheme(THEMES.AUTO);
      }
    });

    // 绑定按钮点击事件
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
      });
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // 暴露给全局以便其他脚本使用
  window.ThemeToggle = {
    toggle: toggleTheme,
    getTheme: getStoredTheme,
    setTheme: function(theme) {
      setStoredTheme(theme);
      applyTheme(theme);
    }
  };
})();
