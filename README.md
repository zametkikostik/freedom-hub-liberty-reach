# 🌐 Freedom Hub — Liberty Reach

> **Децентрализованная платформа будущего для свободного общения, AI-сервисов и Web3 контента**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-cyan)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)
[![Discord](https://img.shields.io/discord/1234567890?color=7289da&label=Discord)](https://discord.gg/freedomhub)
[![Twitter](https://img.shields.io/twitter/follow/freedomhub?style=social)](https://twitter.com/freedomhub)

---

## 📋 Содержание

- [О проекте](#-о-проекте)
- [Возможности](#-возможности)
- [Быстрый старт](#-быстрый-старт)
- [Установка](#-установка)
- [Запуск ноды](#-запуск-ноды)
- [Архитектура](#-архитектура)
- [Технологии](#-технологии)
- [Безопасность](#-безопасность)
- [Правовая информация](#-правовая-информация)
- [Вклад в проект](#-вклад-в-проект)
- [Лицензия](#-лицензия)
- [Контакты](#-контакты)

---

## 🚀 О проекте

**Freedom Hub** — это децентрализованная федеративная сеть нового поколения, объединяющая:

- 💬 **Мессенджер** с сквозным шифрованием и AI-переводом
- 🎥 **Видео платформа** на IPFS и WebTorrent
- 🤖 **AI Hub** — доступ к GPT-4, Claude, Gemini
- 🌍 **Web3 интеграция** — кошельки, NFT, DeFi
- 📡 **Децентрализованные ноды** — любой может запустить свою ноду
- 💰 **Монетизация** — 2% комиссия протоколу

### 🎯 Миссия

Создать платформу для **свободного общения без цензуры**, где каждый пользователь владеет своими данными и может зарабатывать на предоставлении сервисов.

---

## ✨ Возможности

### Для пользователей

| Функция | Описание |
|---------|----------|
| 💬 **Мессенджер** | Защищённые чаты, группы, каналы с AI-переводом на 11 языков |
| 🎥 **Видео** | Децентрализованный стриминг через IPFS/WebTorrent |
| 🤖 **AI Сервисы** | GPT-4, Claude, Gemini, генерация изображений и музыки |
| 🌐 **Мультиязычность** | 11 языков включая болгарский, русский, украинский |
| 📱 **PWA** | Работает как нативное приложение на любом устройстве |
| 🔐 **Безопасность** | E2E шифрование, 2FA, защита от XSS/CSRF |

### Для владельцев нод

| Возможность | Описание |
|-------------|----------|
| 📡 **Запуск ноды** | Docker compose для быстрого развёртывания |
| 💰 **Доход** | 98% от доходов ноды остаётся владельцу |
| 🔄 **Авто-выплаты** | 2% комиссия протоколу автоматически |
| 📊 **Мониторинг** | Панель управления с аналитикой |
| 🌍 **Федерация** | Объединение в децентрализованную сеть |

### Для администраторов

| Панель | Описание |
|--------|----------|
| 👥 **Пользователи** | Управление пользователями и верификация |
| 🛡️ **Модерация** | AI-модератор + ручная модерация |
| 📊 **Активность** | Статистика и аналитика в реальном времени |
| 🔑 **API Ключи** | Управление ключами для AI сервисов |
| 📍 **Карта** | Глобальная карта пользователей (Super Admin) |
| 📞 **SIP VoIP** | Интеграция с облачными операторами |

---

## ⚡ Быстрый старт

### Требования

- **Node.js** 18+ 
- **npm** 9+
- **Docker** (для развёртывания ноды)
- **Git**

### Установка за 5 минут

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/zametkikostik/freedom-hub-liberty-reach.git
cd freedom-hub-liberty-reach

# 2. Установите зависимости
npm install

# 3. Скопируйте .env.example в .env
cp .env.example .env

# 4. Отредактируйте .env (укажите свои ключи)
nano .env

# 5. Запустите разработку
npm run dev
```

**Откройте:** http://localhost:5173

---

## 📦 Установка

### Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
# Supabase (база данных и аутентификация)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Web3 (кошельки)
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id

# AI Сервисы
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_ELEVENLABS_API_KEY=...

# SIP VoIP (опционально)
SIP_PROVIDER=twilio
SIP_SERVER=sip.twilio.com
SIP_USERNAME=...
SIP_PASSWORD=...

# Безопасность
VITE_SENTRY_DSN=https://...@sentry.io/...
```

### Команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Предпросмотр сборки
npm run preview

# Линтинг
npm run lint

# Проверка типов
npm run typecheck

# Тесты
npm run test
```

---

## 📡 Запуск ноды

### Docker Compose (рекомендуется)

```bash
# 1. Создайте директорию для ноды
mkdir -p ~/freedom-node
cd ~/freedom-node

# 2. Скачайте конфигурацию
curl -O https://raw.githubusercontent.com/zametkikostik/freedom-hub-liberty-reach/main/docker-compose.yml
curl -O https://raw.githubusercontent.com/zametkikostik/freedom-hub-liberty-reach/main/.env.federation

# 3. Настройте переменные
cp .env.federation .env
nano .env

# 4. Запустите ноду
docker-compose up -d

# 5. Проверьте статус
docker-compose ps

# 6. Откройте панель управления
# https://your-domain.com/admin
```

### Требования к серверу

| Компонент | Минимальные | Рекомендуемые |
|-----------|-------------|---------------|
| CPU | 2 ядра | 4+ ядра |
| RAM | 4 GB | 8+ GB |
| Storage | 50 GB SSD | 100+ GB NVMe |
| Network | 100 Mbps | 1+ Gbps |

### Монетизация ноды

```
┌─────────────────────────────────────┐
│         Node Revenue: $1000         │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐         ┌─────▼────┐
│  2%    │         │   98%    │
│ $20    │         │  $980    │
│        │         │          │
│Protocol│         │   Node   │
│ Wallet │         │  Owner   │
└────────┘         └──────────┘
```

**Источники дохода:**
- Premium подписки ($4.99-$199.99)
- AI сервисы (pay-per-use)
- Хранение данных ($0.10/GB)
- Кастомные домены ($5/мес)

---

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                    Freedom Hub Protocol                         │
│                    (Super Admin: zametkikostik)                 │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Node 1    │  │   Node 2    │  │   Node N    │            │
│  │ cyber-rebel │  │ matrix.org  │  │  ...        │            │
│  │     2% ─────┼──┼──── 2% ─────┼──┼──── 2% ─────┤            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                     │
│         └────────────────┴────────────────┘                     │
│                          │                                      │
│                  ┌───────▼────────┐                             │
│                  │  Protocol Fee  │                             │
│                  │  Wallet (2%)   │                             │
│                  └────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

### Компоненты

1. **Frontend** (React + Vite + TypeScript)
   - Мессенджер с AI-переводом
   - Видео платформа
   - AI Hub
   - Админ-панели

2. **Backend** (Supabase)
   - Аутентификация
   - База данных
   - Realtime подписки

3. **Децентрализация**
   - IPFS (хранение файлов)
   - WebTorrent (видео стриминг)
   - Federation (ноды)

4. **Web3**
   - Ethereum, Polygon, BSC
   - WalletConnect
   - Смарт-контракты

---

## 🛠️ Технологии

| Категория | Технологии |
|-----------|------------|
| **Frontend** | React 18, TypeScript, Vite 5 |
| **UI** | Tailwind CSS, Radix UI, Lucide Icons |
| **State** | Zustand, React Query |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime) |
| **Web3** | ethers.js, viem, wagmi, WalletConnect |
| **AI** | OpenAI, Anthropic, Google AI |
| **P2P** | IPFS, WebTorrent, simple-peer |
| **DevOps** | Docker, Docker Compose |
| **Monitoring** | Sentry, Prometheus, Grafana |

---

## 🛡️ Безопасность

### Реализованная защита

| Защита | Описание |
|--------|----------|
| **CSP** | Content Security Policy для всех ресурсов |
| **XSS Protection** | Санитизация HTML, экранирование |
| **CSRF Protection** | Токены для всех форм |
| **Rate Limiting** | Ограничение запросов (API, login, messages) |
| **Шифрование** | AES-GCM 256-bit для чувствительных данных |
| **Security Headers** | 5 заголовков безопасности |
| **Audit Logging** | Логирование security событий |

### Security Score: **A-** (85/100)

```bash
# Проверка уязвимостей
npm audit

# Запуск с проверкой безопасности
npm run security-check
```

---

## ⚖️ Правовая информация

### Документы по конфиденциальности и безопасности

Мы соблюдаем требования законодательства о защите данных по всему миру:

| Регион | Документ | Описание |
|--------|----------|----------|
| 🇪🇺 **ЕС/EEA** | [GDPR Privacy Policy](docs/PRIVACY_POLICY_EU_GDPR.md) | Соответствие GDPR (Regulation (EU) 2016/679) |
| 🇷🇺 **Россия** | [152-ФЗ Политика](docs/PRIVACY_POLICY_RU_152FZ.md) | Соответствие Федеральному закону № 152-ФЗ |
| 🌍 **Мир** | [Global Privacy Policy](docs/PRIVACY_POLICY_GLOBAL.md) | Универсальная политика для всех стран |
| 🍪 **Все** | [Cookie Policy](docs/COOKIE_POLICY.md) | Политика использования файлов cookie |
| 📜 **Все** | [Terms of Service](docs/TERMS_OF_SERVICE.md) | Условия использования платформы |

### Ваши права

- **Доступ к данным**: Запросите копию ваших персональных данных
- **Исправление**: Исправьте неточную информацию
- **Удаление**: Запросите удаление ваших данных («право на забвение»)
- **Переносимость**: Экспортируйте данные в машиночитаемом формате
- **Возражение**: Возразите против обработки данных

Для реализации прав обращайтесь: **privacy@freedom-hub.app**

---

## 🤝 Вклад в проект

### Как помочь

1. **Форкните репозиторий**
2. **Создайте ветку** (`git checkout -b feature/amazing-feature`)
3. **Закоммитьте изменения** (`git commit -m 'Add amazing feature'`)
4. **Запушьте** (`git push origin feature/amazing-feature`)
5. **Откройте Pull Request**

### Направления для вклада

- 🌍 **Переводы** — добавьте свой язык в `src/lib/i18n.ts`
- 🐛 **Баги** — откройте issue с описанием
- ✨ **Фичи** — предлагайте новые функции
- 📚 **Документация** — улучшайте документацию
- 🛡️ **Безопасность** — сообщайте об уязвимостях

---

## 📄 Лицензия

Этот проект лицензирован под [MIT License](LICENSE).

```
Copyright (c) 2025 zametkikostik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 Контакты

- **GitHub:** [@zametkikostik](https://github.com/zametkikostik)
- **Discord:** [Freedom Hub Community](https://discord.gg/freedomhub)
- **Twitter:** [@freedomhub](https://twitter.com/freedomhub)
- **Email:** admin@freedom-hub.app
- **Website:** https://freedom-hub.app

---

## 📊 Статистика

[![Stars](https://img.shields.io/github/stars/zametkikostik/freedom-hub-liberty-reach?style=social)](https://github.com/zametkikostik/freedom-hub-liberty-reach/stargazers)
[![Forks](https://img.shields.io/github/forks/zametkikostik/freedom-hub-liberty-reach?style=social)](https://github.com/zametkikostik/freedom-hub-liberty-reach/network/members)
[![Issues](https://img.shields.io/github/issues/zametkikostik/freedom-hub-liberty-reach)](https://github.com/zametkikostik/freedom-hub-liberty-reach/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/zametkikostik/freedom-hub-liberty-reach)](https://github.com/zametkikostik/freedom-hub-liberty-reach/pulls)

---

## 🙏 Благодарности

- **Supabase** — за отличную BaaS платформу
- **OpenRouter** — за доступ к AI моделям
- **IPFS** — за децентрализованное хранение
- **Tailwind CSS** — за потрясающий CSS фреймворк
- **Всем контрибьюторам** — за помощь в развитии проекта

---

<div align="center">

**Made with ❤️ by zametkikostik**

[🔝 Back to Top](#-freedom-hub--liberty-reach)

</div>
