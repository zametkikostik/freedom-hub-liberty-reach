import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type Language = 'en' | 'ru' | 'bg' | 'uk' | 'es' | 'de' | 'fr' | 'pt' | 'tr' | 'zh' | 'ja';

export interface Translation {
  [key: string]: string | Translation;
}

export interface LanguageConfig {
  code: Language;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export interface I18nState {
  language: Language;
  fallbackLanguage: Language;
  translations: Record<Language, Translation>;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  getTranslations: () => Translation;
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', direction: 'ltr' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', direction: 'ltr' },
  { code: 'bg', name: 'Български', flag: '🇧🇬', direction: 'ltr' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦', direction: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', direction: 'ltr' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', direction: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', direction: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', direction: 'ltr' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────────────────────────────────────

const translations: Record<Language, Translation> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.messenger': 'Messenger',
    'nav.video': 'Video',
    'nav.ai': 'AI Hub',
    'nav.settings': 'Settings',
    
    // Auth
    'auth.title': 'Welcome to Freedom Hub',
    'auth.subtitle': 'Decentralized platform for uncensored communication',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.forgot': 'Forgot Password?',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    
    // Messenger
    'messenger.typeMessage': 'Type a message...',
    'messenger.send': 'Send',
    'messenger.online': 'Online',
    'messenger.offline': 'Offline',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
  },
  
  ru: {
    // Navigation
    'nav.dashboard': 'Дашборд',
    'nav.messenger': 'Мессенджер',
    'nav.video': 'Видео',
    'nav.ai': 'AI Хаб',
    'nav.settings': 'Настройки',
    
    // Auth
    'auth.title': 'Добро пожаловать в Freedom Hub',
    'auth.subtitle': 'Децентрализованная платформа для свободного общения',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.signin': 'Войти',
    'auth.signup': 'Зарегистрироваться',
    'auth.forgot': 'Забыли пароль?',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.search': 'Поиск',
    
    // Messenger
    'messenger.typeMessage': 'Введите сообщение...',
    'messenger.send': 'Отправить',
    'messenger.online': 'Онлайн',
    'messenger.offline': 'Офлайн',
    
    // Footer
    'footer.rights': 'Все права защищены',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
    'footer.contact': 'Контакты',
  },
  
  bg: {
    // Navigation
    'nav.dashboard': 'Табло',
    'nav.messenger': 'Съобщения',
    'nav.video': 'Видео',
    'nav.ai': 'AI Хъб',
    'nav.settings': 'Настройки',
    
    // Auth
    'auth.title': 'Добре дошли в Freedom Hub',
    'auth.subtitle': 'Децентрализирана платформа за нецензурирана комуникация',
    'auth.email': 'Имейл',
    'auth.password': 'Парола',
    'auth.signin': 'Вход',
    'auth.signup': 'Регистрация',
    'auth.forgot': 'Забравена парола?',
    
    // Common
    'common.loading': 'Зареждане...',
    'common.error': 'Грешка',
    'common.success': 'Успех',
    'common.save': 'Запази',
    'common.cancel': 'Отказ',
    'common.delete': 'Изтрий',
    'common.edit': 'Редактирай',
    'common.search': 'Търсене',
    
    // Messenger
    'messenger.typeMessage': 'Въведете съобщение...',
    'messenger.send': 'Изпрати',
    'messenger.online': 'Онлайн',
    'messenger.offline': 'Офлайн',
    
    // Footer
    'footer.rights': 'Всички права запазени',
    'footer.privacy': 'Политика за поверителност',
    'footer.terms': 'Условия за ползване',
    'footer.contact': 'Контакти',
  },
  
  uk: {
    // Navigation
    'nav.dashboard': 'Панель',
    'nav.messenger': 'Месенджер',
    'nav.video': 'Відео',
    'nav.ai': 'AI Хаб',
    'nav.settings': 'Налаштування',
    
    // Auth
    'auth.title': 'Ласкаво просимо до Freedom Hub',
    'auth.subtitle': 'Децентралізована платформа для вільного спілкування',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.signin': 'Увійти',
    'auth.signup': 'Зареєструватися',
    'auth.forgot': 'Забули пароль?',
    
    // Common
    'common.loading': 'Завантаження...',
    'common.error': 'Помилка',
    'common.success': 'Успішно',
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.search': 'Пошук',
    
    // Footer
    'footer.rights': 'Всі права захищені',
    'footer.privacy': 'Політика конфіденційності',
    'footer.terms': 'Умови використання',
    'footer.contact': 'Контакти',
  },
  
  es: {
    'nav.dashboard': 'Panel',
    'nav.messenger': 'Mensajería',
    'nav.video': 'Video',
    'nav.ai': 'IA Hub',
    'nav.settings': 'Configuración',
    'auth.title': 'Bienvenido a Freedom Hub',
    'auth.email': 'Correo',
    'auth.password': 'Contraseña',
    'auth.signin': 'Iniciar sesión',
    'messenger.typeMessage': 'Escribe un mensaje...',
    'messenger.send': 'Enviar',
  },
  
  de: {
    'nav.dashboard': 'Dashboard',
    'nav.messenger': 'Messenger',
    'nav.video': 'Video',
    'nav.ai': 'KI Hub',
    'nav.settings': 'Einstellungen',
    'auth.title': 'Willkommen bei Freedom Hub',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.signin': 'Anmelden',
    'messenger.typeMessage': 'Nachricht eingeben...',
    'messenger.send': 'Senden',
  },
  
  fr: {
    'nav.dashboard': 'Tableau de bord',
    'nav.messenger': 'Messagerie',
    'nav.video': 'Vidéo',
    'nav.ai': 'IA Hub',
    'nav.settings': 'Paramètres',
    'auth.title': 'Bienvenue sur Freedom Hub',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.signin': 'Se connecter',
    'messenger.typeMessage': 'Tapez un message...',
    'messenger.send': 'Envoyer',
  },
  
  pt: {
    'nav.dashboard': 'Painel',
    'nav.messenger': 'Mensageiro',
    'nav.video': 'Vídeo',
    'nav.ai': 'IA Hub',
    'nav.settings': 'Configurações',
    'auth.title': 'Bem-vindo ao Freedom Hub',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.signin': 'Entrar',
    'messenger.typeMessage': 'Digite uma mensagem...',
    'messenger.send': 'Enviar',
  },
  
  tr: {
    'nav.dashboard': 'Panel',
    'nav.messenger': 'Mesaj',
    'nav.video': 'Video',
    'nav.ai': 'Yapay Zeka',
    'nav.settings': 'Ayarlar',
    'auth.title': 'Freedom Hub\'a Hoş Geldiniz',
    'auth.email': 'E-posta',
    'auth.password': 'Şifre',
    'auth.signin': 'Giriş Yap',
    'messenger.typeMessage': 'Mesaj yaz...',
    'messenger.send': 'Gönder',
  },
  
  zh: {
    'nav.dashboard': '仪表板',
    'nav.messenger': '信使',
    'nav.video': '视频',
    'nav.ai': '人工智能',
    'nav.settings': '设置',
    'auth.title': '欢迎来到 Freedom Hub',
    'auth.email': '电子邮件',
    'auth.password': '密码',
    'auth.signin': '登录',
    'messenger.typeMessage': '输入消息...',
    'messenger.send': '发送',
  },
  
  ja: {
    'nav.dashboard': 'ダッシュボード',
    'nav.messenger': 'メッセンジャー',
    'nav.video': 'ビデオ',
    'nav.ai': 'AI ハブ',
    'nav.settings': '設定',
    'auth.title': 'Freedom Hub へようこそ',
    'auth.email': 'メール',
    'auth.password': 'パスワード',
    'auth.signin': 'ログイン',
    'messenger.typeMessage': 'メッセージを入力...',
    'messenger.send': '送信',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// I18N STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'en',
      fallbackLanguage: 'en',
      translations,
      
      setLanguage: (lang: Language) => {
        set({ language: lang });
        document.documentElement.lang = lang;
        document.documentElement.dir = LANGUAGES.find(l => l.code === lang)?.direction || 'ltr';
      },
      
      t: (key: string, params?: Record<string, string>) => {
        const { language, fallbackLanguage, translations } = get();
        
        // Get translation for current language
        let value = translations[language]?.[key] as string | undefined;
        
        // Fallback to English if not found
        if (!value && language !== fallbackLanguage) {
          value = translations[fallbackLanguage]?.[key] as string | undefined;
        }
        
        // Return key if translation not found
        if (!value) {
          console.warn(`Translation missing for key: ${key}`);
          return key;
        }
        
        // Replace parameters
        if (params) {
          Object.entries(params).forEach(([param, value]) => {
            value = value.replace(new RegExp(`{${param}}`, 'g'), value);
          });
        }
        
        return value;
      },
      
      getTranslations: () => {
        const { language, translations } = get();
        return translations[language] || translations.en;
      },
    }),
    {
      name: 'freedom-hub-i18n',
      partialize: (state) => ({ language: state.language }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export const useTranslation = () => {
  const { language, setLanguage, t, getTranslations } = useI18n();
  
  return {
    t,
    i18n: {
      language,
      setLanguage,
      translations: getTranslations(),
      languages: LANGUAGES,
    },
  };
};

export default useI18n;
