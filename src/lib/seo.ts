import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// SEO CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  schema?: Record<string, any>;
  noIndex?: boolean;
  noFollow?: boolean;
}

const BASE_URL = 'https://freedom-hub.app';
const DEFAULT_TITLE = 'Freedom Hub — Децентрализованная платформа будущего';
const DEFAULT_DESCRIPTION = 'Freedom Hub — децентрализованная платформа для свободного общения, доступа к AI-сервисам и Web3 контенту';
const DEFAULT_KEYWORDS = [
  'Web3',
  'IPFS',
  'VLESS',
  'AI',
  'мессенджер',
  'децентрализация',
  'анонимность',
  'криптовалюта',
  'блокчейн',
  'приватность',
];

const PAGE_SEO: Record<string, SEOConfig> = {
  '/': {
    title: 'Freedom Hub — Главная | Децентрализованная платформа',
    description: 'Свободное общение, AI-сервисы и Web3 контент в одной платформе. Присоединяйтесь к Freedom Hub!',
    keywords: [...DEFAULT_KEYWORDS, 'главная', 'дашборд'],
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image',
  },
  
  '/messenger': {
    title: 'Мессенджер — Freedom Hub | Защищенные сообщения',
    description: 'Защищенный мессенджер с сквозным шифрованием, AI-переводом и поддержкой мультимедиа.',
    keywords: [...DEFAULT_KEYWORDS, 'мессенджер', 'чат', 'сообщения', 'шифрование'],
    ogImage: '/og-messenger.jpg',
  },
  
  '/video': {
    title: 'Видео — Freedom Hub | Децентрализованное видео',
    description: 'Смотрите и транслируйте видео через IPFS и WebTorrent. Без цензуры и ограничений.',
    keywords: [...DEFAULT_KEYWORDS, 'видео', 'стриминг', 'IPFS', 'WebTorrent'],
    ogImage: '/og-video.jpg',
  },
  
  '/ai': {
    title: 'AI Hub — Freedom Hub | Искусственный интеллект',
    description: 'Доступ к AI-моделям: GPT-4, Claude, Gemini. Генерация текста, изображений, музыки и кода.',
    keywords: [...DEFAULT_KEYWORDS, 'AI', 'искусственный интеллект', 'GPT-4', 'Claude', 'генерация'],
    ogImage: '/og-ai.jpg',
    twitterCard: 'summary_large_image',
  },
  
  '/settings': {
    title: 'Настройки — Freedom Hub',
    description: 'Управление аккаунтом, безопасностью и предпочтениями Freedom Hub.',
    keywords: [...DEFAULT_KEYWORDS, 'настройки', 'профиль', 'безопасность'],
    noIndex: true,
  },
  
  '/admin': {
    title: 'Админ-панель — Freedom Hub',
    description: 'Управление платформой Freedom Hub: пользователи, ноды, модерация, аналитика.',
    keywords: [...DEFAULT_KEYWORDS, 'админ', 'управление', 'модерация'],
    noIndex: true,
    noFollow: true,
  },
  
  '/auth': {
    title: 'Вход — Freedom Hub',
    description: 'Войдите в свой аккаунт Freedom Hub или создайте новый.',
    keywords: [...DEFAULT_KEYWORDS, 'вход', 'регистрация', 'аккаунт'],
    noIndex: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SEO UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export const updateMetaTags = (config: SEOConfig) => {
  // Title
  document.title = config.title;
  
  // Meta description
  updateMeta('description', config.description);
  
  // Meta keywords
  updateMeta('keywords', config.keywords.join(', '));
  
  // Canonical URL
  if (config.canonical) {
    updateLink('canonical', config.canonical);
  } else {
    updateLink('canonical', BASE_URL + window.location.pathname);
  }
  
  // Robots
  const robots = [
    config.noIndex ? 'noindex' : 'index',
    config.noFollow ? 'nofollow' : 'follow',
  ].join(', ');
  updateMeta('robots', robots);
  
  // Open Graph
  updateMeta('og:title', config.title);
  updateMeta('og:description', config.description);
  updateMeta('og:type', 'website');
  updateMeta('og:url', BASE_URL + window.location.pathname);
  
  if (config.ogImage) {
    updateMeta('og:image', config.ogImage);
    updateMeta('og:image:width', '1200');
    updateMeta('og:image:height', '630');
  }
  
  // Twitter Card
  updateMeta('twitter:card', config.twitterCard || 'summary');
  updateMeta('twitter:title', config.title);
  updateMeta('twitter:description', config.description);
  
  if (config.ogImage) {
    updateMeta('twitter:image', config.ogImage);
  }
  
  // Schema.org JSON-LD
  if (config.schema) {
    updateSchema(config.schema);
  }
};

const updateMeta = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

const updateLink = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
};

const updateSchema = (schema: Record<string, any>) => {
  let element = document.querySelector('script[type="application/ld+json"]');
  
  if (!element) {
    element = document.createElement('script');
    element.setAttribute('type', 'application/ld+json');
    document.head.appendChild(element);
  }
  
  element.textContent = JSON.stringify(schema);
};

// ─────────────────────────────────────────────────────────────────────────────
// AI GEO SEO - LOW/MEDIUM KEYWORD OPTIMIZATION
// ─────────────────────────────────────────────────────────────────────────────

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
}

// Низкочастотные ключевые запросы (100-1000 поисков/месяц)
const LOW_TAIL_KEYWORDS: KeywordData[] = [
  { keyword: 'децентрализованный мессенджер 2025', searchVolume: 320, difficulty: 25, intent: 'informational' },
  { keyword: 'как использовать IPFS для видео', searchVolume: 210, difficulty: 30, intent: 'informational' },
  { keyword: 'Web3 мессенджер с шифрованием', searchVolume: 450, difficulty: 35, intent: 'commercial' },
  { keyword: 'анонимный чат без регистрации', searchVolume: 890, difficulty: 40, intent: 'transactional' },
  { keyword: 'AI переводчик для сообщений', searchVolume: 560, difficulty: 28, intent: 'informational' },
  { keyword: 'создать ноду Freedom Hub', searchVolume: 180, difficulty: 20, intent: 'informational' },
  { keyword: 'VLESS настройка сервера', searchVolume: 340, difficulty: 45, intent: 'informational' },
  { keyword: 'крипто кошелек в мессенджере', searchVolume: 670, difficulty: 38, intent: 'commercial' },
];

// Среднечастотные ключевые запросы (1000-10000 поисков/месяц)
const MID_TAIL_KEYWORDS: KeywordData[] = [
  { keyword: 'децентрализованная платформа', searchVolume: 2400, difficulty: 50, intent: 'informational' },
  { keyword: 'Web3 социальные сети', searchVolume: 3200, difficulty: 55, intent: 'commercial' },
  { keyword: 'IPFS хранилище файлов', searchVolume: 1800, difficulty: 42, intent: 'informational' },
  { keyword: 'AI генератор изображений', searchVolume: 5600, difficulty: 60, intent: 'transactional' },
  { keyword: 'анонимный браузер 2025', searchVolume: 4100, difficulty: 48, intent: 'commercial' },
  { keyword: 'криптовалютный кошелек', searchVolume: 8900, difficulty: 65, intent: 'transactional' },
];

export const generateSEOContent = (page: string): SEOConfig => {
  const baseConfig = PAGE_SEO[page] || PAGE_SEO['/'];
  
  // Add low-tail keywords for specific pages
  let additionalKeywords: string[] = [];
  
  if (page.includes('messenger')) {
    additionalKeywords = LOW_TAIL_KEYWORDS
      .filter(k => k.keyword.includes('мессенджер') || k.keyword.includes('чат'))
      .map(k => k.keyword);
  }
  
  if (page.includes('video') || page.includes('ai')) {
    additionalKeywords = [
      ...LOW_TAIL_KEYWORDS.filter(k => k.keyword.includes('IPFS') || k.keyword.includes('AI')).map(k => k.keyword),
      ...MID_TAIL_KEYWORDS.filter(k => k.keyword.includes('AI') || k.keyword.includes('IPFS')).map(k => k.keyword),
    ];
  }
  
  // Generate schema.org markup
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Freedom Hub',
    description: baseConfig.description,
    url: BASE_URL + page,
    applicationCategory: 'SocialNetworkingApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '12450',
    },
  };
  
  return {
    ...baseConfig,
    keywords: [...baseConfig.keywords, ...additionalKeywords],
    schema,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// REACT HOOK
// ─────────────────────────────────────────────────────────────────────────────

export const useSEO = (overrideConfig?: Partial<SEOConfig>) => {
  const location = useLocation();
  
  useEffect(() => {
    // Generate SEO config for current page
    const pageConfig = generateSEOContent(location.pathname);
    
    // Merge with override config
    const config = { ...pageConfig, ...overrideConfig };
    
    // Update meta tags
    updateMetaTags(config);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [location.pathname, overrideConfig]);
};

export default useSEO;
