// Internationalization (i18n) System
class I18n {
  constructor() {
    this.currentLocale = localStorage.getItem('locale') || 'es';
    this.translations = {};
    this.loadedLocales = new Set();
    this.defaultLocale = 'es';
    this.init();
  }

  async init() {
    await this.loadLocale(this.currentLocale);
    this.updatePageLanguage();
    this.setupLanguageSwitcher();
  }

  async loadLocale(locale) {
    if (this.loadedLocales.has(locale)) return;

    try {
      const response = await fetch(`/locales/${locale}.json`);
      if (!response.ok) throw new Error(`Failed to load locale: ${locale}`);
      
      this.translations[locale] = await response.json();
      this.loadedLocales.add(locale);
    } catch (error) {
      console.error(`Error loading locale ${locale}:`, error);
      
      // Fallback to default locale
      if (locale !== this.defaultLocale) {
        await this.loadLocale(this.defaultLocale);
        this.currentLocale = this.defaultLocale;
      }
    }
  }

  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLocale];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    if (value === undefined) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    // Replace parameters
    return value.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
  }

  async changeLocale(locale) {
    if (locale === this.currentLocale) return;
    
    await this.loadLocale(locale);
    this.currentLocale = locale;
    localStorage.setItem('locale', locale);
    this.updatePageLanguage();
  }

  updatePageLanguage() {
    // Update HTML lang attribute
    document.documentElement.lang = this.currentLocale;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });
    
    // Update all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });
    
    // Update all elements with data-i18n-title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });
    
    // Update all elements with data-i18n-aria-label attribute
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria-label');
      element.setAttribute('aria-label', this.t(key));
    });
    
    // Update language switcher
    const langCode = document.querySelector('.language-code');
    if (langCode) {
      langCode.textContent = this.currentLocale.toUpperCase();
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('localeChanged', { 
      detail: { locale: this.currentLocale } 
    }));
  }

  setupLanguageSwitcher() {
    const languageBtn = document.querySelector('.language-btn');
    if (!languageBtn) return;
    
    // Create language dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'language-dropdown';
    dropdown.innerHTML = `
      <button class="language-option" data-locale="es">
        <span class="flag">🇪🇸</span>
        <span>Español</span>
      </button>
      <button class="language-option" data-locale="en">
        <span class="flag">🇺🇸</span>
        <span>English</span>
      </button>
    `;
    
    languageBtn.parentElement.appendChild(dropdown);
    
    // Toggle dropdown
    languageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('show');
      dropdown.classList.toggle('show');
      languageBtn.setAttribute('aria-expanded', !isOpen);
    });
    
    // Handle language selection
    dropdown.addEventListener('click', async (e) => {
      const option = e.target.closest('.language-option');
      if (!option) return;
      
      const locale = option.getAttribute('data-locale');
      await this.changeLocale(locale);
      dropdown.classList.remove('show');
      languageBtn.setAttribute('aria-expanded', 'false');
    });
    
    // Close dropdown on outside click
    document.addEventListener('click', () => {
      dropdown.classList.remove('show');
      languageBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Helper method to update specific elements dynamically
  updateElement(element, key) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    
    if (element) {
      element.textContent = this.t(key);
    }
  }
}

// Initialize i18n system
const i18n = new I18n();

// Add CSS for language switcher
const style = document.createElement('style');
style.textContent = `
  .language-switcher {
    position: relative;
    margin-left: 1rem;
  }
  
  .language-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--surface-foreground);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .language-btn:hover {
    background: var(--gray-200);
    border-color: var(--border-default);
  }
  
  .language-flag {
    font-size: 1.2rem;
  }
  
  .language-code {
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .language-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background: var(--surface-background);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    box-shadow: var(--elevation-lg);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    z-index: var(--z-dropdown);
  }
  
  .language-dropdown.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  .language-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease;
    white-space: nowrap;
  }
  
  .language-option:hover {
    background: var(--surface-foreground);
  }
  
  .language-option:first-child {
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }
  
  .language-option:last-child {
    border-radius: 0 0 var(--radius-md) var(--radius-md);
  }
  
  .language-option .flag {
    font-size: 1.2rem;
  }
`;
document.head.appendChild(style);

// Update dashboard elements with i18n attributes
document.addEventListener('DOMContentLoaded', () => {
  // Add i18n attributes to sidebar navigation
  const sidebarItems = {
    'a[href="#inicio"]': 'sidebar.home',
    'a[href="#bandeja"]': 'sidebar.inbox',
    'a[href="#canales"]': 'sidebar.channels',
    'a[href="#flujos"]': 'sidebar.flows',
    'a[href="#ventas"]': 'sidebar.sales',
    'a[href="#clientes"]': 'sidebar.customers',
    'a[href="#campanas"]': 'sidebar.campaigns',
    'a[href="#analytics"]': 'sidebar.analytics',
    'a[href="#configuracion"]': 'sidebar.settings'
  };
  
  Object.entries(sidebarItems).forEach(([selector, key]) => {
    const element = document.querySelector(selector);
    if (element) {
      const textElement = element.querySelector('span');
      if (textElement) {
        textElement.setAttribute('data-i18n', key);
      }
    }
  });
  
  // Add i18n attributes to header elements
  const headerButton = document.querySelector('.header-controls .primary-cta');
  if (headerButton) {
    headerButton.setAttribute('data-i18n', 'header.newMessage');
  }
  
  // Add i18n attributes to dashboard sections
  const quickActionsTitle = document.querySelector('.quick-actions h2');
  if (quickActionsTitle) {
    quickActionsTitle.setAttribute('data-i18n', 'dashboard.quickActions');
  }
  
  // Trigger initial translation
  i18n.updatePageLanguage();
});