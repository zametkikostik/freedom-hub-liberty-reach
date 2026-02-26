import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import {
  Mail,
  Shield,
  Send,
  Inbox,
  Archive,
  Trash2,
  Reply,
  Forward,
  Lock,
  Check,
  Settings,
  Paperclip,
  ChevronDown,
} from 'lucide-react';

// Типы
interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  time: string;
  isRead: boolean;
  provider: 'proton' | 'tutanota' | 'gmail';
  to: string;
  encrypted: boolean;
}

interface Folder {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
}

interface ConnectedService {
  id: 'proton' | 'tutanota' | 'gmail';
  name: string;
  email: string;
  isConnected: boolean;
  color: string;
}

// Моковые данные
const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'Alex Cipher',
    senderEmail: 'alex.cipher@proton.me',
    subject: 'Доступ к новому узлу VLESS',
    snippet: 'Привет! Настроил новый узел в Нидерландах. Конфигурация во вложении...',
    body: `Привет!

Настроил новый узел VLESS в Нидерландах. Конфигурация во вложении.

Характеристики:
- Скорость: до 1 Gbps
- Пинг: ~25ms
- Протокол: VLESS + Reality
- Шифрование: TLS 1.3

Для подключения используй актуальный клиент v2rayNG или Nekobox.

Безопасность превыше всего!

С уважением,
Alex Cipher`,
    time: '10:45',
    isRead: false,
    provider: 'proton',
    to: 'neo@proton.me',
    encrypted: true,
  },
  {
    id: '2',
    sender: 'Freedom Hub Team',
    senderEmail: 'noreply@freedomhub.io',
    subject: 'Обновление безопасности платформы',
    snippet: 'Мы обновили протоколы шифрования. Узнайте, что изменилось...',
    body: `Уважаемый пользователь!

Мы обновили протоколы шифрования на платформе Freedom Hub.

Что изменилось:
✓ Улучшено сквозное шифрование сообщений
✓ Добавлена поддержка PGP для почты
✓ Обновлены сертификаты TLS для всех узлов

Ваши данные под надёжной защитой.

Команда Freedom Hub`,
    time: '09:30',
    isRead: false,
    provider: 'gmail',
    to: 'neo@gmail.com',
    encrypted: true,
  },
  {
    id: '3',
    sender: 'Maria Quantum',
    senderEmail: 'maria.q@tuta.io',
    subject: 'Встреча в метавселенной',
    snippet: 'Давай встретимся завтра в 18:00 в децентрализованном пространстве...',
    body: `Привет!

Давай встретимся завтра в 18:00 в децентрализованном пространстве для обсуждения нового проекта.

Ссылка на комнату будет отправлена отдельно через защищённый канал.

До связи!
Maria`,
    time: 'Вчера',
    isRead: true,
    provider: 'tutanota',
    to: 'neo@tuta.io',
    encrypted: true,
  },
  {
    id: '4',
    sender: 'Crypto Watch',
    senderEmail: 'alerts@cryptowatch.pro',
    subject: 'BTC пробил $95,000!',
    snippet: 'Экстренное уведомление: Биткоин достиг нового исторического максимума...',
    body: `🚀 ЭКСТРЕННОЕ УВЕДОМЛЕНИЕ

Bitcoin пробил отметку $95,000!

Текущая цена: $95,247 (+12.5% за 24ч)
Рыночная капитализация: $1.87T

Это новый исторический максимум!

Не пропустите следующие движения рынка.

Crypto Watch Team`,
    time: 'Вчера',
    isRead: true,
    provider: 'proton',
    to: 'neo@proton.me',
    encrypted: false,
  },
  {
    id: '5',
    sender: 'DevOps Bot',
    senderEmail: 'bot@infra.freedomhub.io',
    subject: 'Деплой успешен: v2.4.1',
    snippet: 'Версия 2.4.1 успешно развёрнута на production. Лог изменений...',
    body: `✅ ДЕПЛОЙ УСПЕШЕН

Версия: v2.4.1
Среда: Production
Время: 2026-02-25 23:45 UTC

Изменения:
• Исправлена уязвимость в модуле аутентификации
• Улучшена производительность WebSocket соединений
• Добавлена поддержка новых провайдеров почты

Статус всех сервисов: 🟢 OK

DevOps Team`,
    time: '25 фев',
    isRead: true,
    provider: 'gmail',
    to: 'neo@gmail.com',
    encrypted: true,
  },
];

const folders: Folder[] = [
  { id: 'inbox', label: 'Входящие', icon: <Inbox className="w-4 h-4" />, count: 3 },
  { id: 'sent', label: 'Отправленные', icon: <Send className="w-4 h-4" />, count: 0 },
  { id: 'archive', label: 'Архив', icon: <Archive className="w-4 h-4" />, count: 12 },
  { id: 'trash', label: 'Корзина', icon: <Trash2 className="w-4 h-4" />, count: 5 },
];

const services: ConnectedService[] = [
  {
    id: 'proton',
    name: 'ProtonMail',
    email: 'neo@proton.me',
    isConnected: true,
    color: 'bg-blue-500',
  },
  {
    id: 'tutanota',
    name: 'Tutanota',
    email: 'neo@tuta.io',
    isConnected: false,
    color: 'bg-green-500',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    email: 'neo@gmail.com',
    isConnected: true,
    color: 'bg-red-500',
  },
];

const providerColors = {
  proton: 'bg-blue-500',
  tutanota: 'bg-green-500',
  gmail: 'bg-red-500',
};

const providerIcons = {
  proton: 'P',
  tutanota: 'T',
  gmail: 'G',
};

export const EmailPage: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: '',
    from: 'neo@proton.me',
    encrypted: true,
  });

  const connectedServices = services.filter((s) => s.isConnected);

  const handleSendEmail = () => {
    console.log('Отправка письма:', composeData);
    setIsComposeModalOpen(false);
    setComposeData({
      to: '',
      subject: '',
      body: '',
      from: 'neo@proton.me',
      encrypted: true,
    });
  };

  const handleDeleteEmail = (id: string) => {
    setEmails(emails.filter((e) => e.id !== id));
    if (selectedEmail?.id === id) {
      setSelectedEmail(null);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setEmails(emails.map((e) => (e.id === id ? { ...e, isRead: true } : e)));
  };

  React.useEffect(() => {
    if (selectedEmail && !selectedEmail.isRead) {
      handleMarkAsRead(selectedEmail.id);
    }
  }, [selectedEmail?.id]);

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan/30">
              <Mail className="w-6 h-6 text-cyber-cyan" />
            </div>
            <h1 className="text-3xl font-bold text-white">Защищённая почта</h1>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl glass-sm max-w-2xl">
            <Shield className="w-5 h-5 text-cyber-green flex-shrink-0" />
            <p className="text-sm text-gray-400">
              Безопасный доступ к почте через VLESS узлы. Все соединения шифруются TLS, ваши данные защищены от перехвата.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsComposeModalOpen(true)}
          leftIcon={<Send className="w-5 h-5" />}
          className="bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/90 shadow-neon-cyan"
        >
          Написать письмо
        </Button>
      </div>

      {/* Карточки сервисов */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} variant="glass" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg', service.color)}>
                  {providerIcons[service.id]}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-400">{service.email}</p>
                </div>
              </div>
              {service.isConnected ? (
                <span className="px-2 py-1 rounded-lg bg-cyber-green/20 text-cyber-green text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Подключен
                </span>
              ) : (
                <span className="px-2 py-1 rounded-lg bg-gray-500/20 text-gray-400 text-xs font-medium">
                  Не подключен
                </span>
              )}
            </div>
            <Button
              variant={service.isConnected ? 'outline' : 'primary'}
              size="sm"
              fullWidth
              leftIcon={service.isConnected ? <Settings className="w-4 h-4" /> : undefined}
            >
              {service.isConnected ? 'Настройки' : 'Подключить'}
            </Button>
          </Card>
        ))}
      </div>

      {/* Основная рабочая область - 3 колонки */}
      <div className="grid grid-cols-12 gap-4 min-h-[60vh]">
        {/* Левая колонка - папки */}
        <div className="col-span-2 hidden lg:block">
          <Card variant="glass" className="p-3 h-full">
            <nav className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all',
                    selectedFolder === folder.id
                      ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {folder.icon}
                    <span className="text-sm font-medium">{folder.label}</span>
                  </div>
                  {folder.count > 0 && (
                    <span className={cn('text-xs font-bold', selectedFolder === folder.id ? 'text-cyber-cyan' : 'text-cyber-cyan/70')}>
                      {folder.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Средняя колонка - список писем */}
        <div className="col-span-12 lg:col-span-4">
          <Card variant="glass" className="h-full overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-cyber-cyan" />
                Входящие
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {emails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={cn(
                    'w-full p-4 text-left border-b border-white/5 transition-all hover:bg-white/5',
                    selectedEmail?.id === email.id && 'bg-cyber-cyan/10 border-cyber-cyan/30',
                    !email.isRead && 'bg-white/[0.02]'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn('w-2 h-2 rounded-full flex-shrink-0', email.isRead ? 'bg-transparent' : 'bg-cyber-cyan animate-pulse')} />
                      <span className={cn('text-sm font-medium truncate', !email.isRead ? 'text-white' : 'text-gray-400')}>
                        {email.sender}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{email.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-sm truncate', !email.isRead ? 'text-white font-medium' : 'text-gray-300')}>
                      {email.subject}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-2">{email.snippet}</p>
                  <div className="flex items-center gap-2">
                    <span className={cn('w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white', providerColors[email.provider])}>
                      {providerIcons[email.provider]}
                    </span>
                    {email.encrypted && (
                      <Lock className="w-3 h-3 text-cyber-green" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Правая колонка - просмотр письма */}
        <div className="col-span-12 lg:col-span-6">
          <Card variant="glass" className="h-full overflow-hidden flex flex-col">
            {selectedEmail ? (
              <>
                {/* Заголовок письма */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-xl font-bold text-white">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-2">
                      {selectedEmail.encrypted && (
                        <span className="px-2 py-1 rounded-lg bg-cyber-green/20 text-cyber-green text-xs font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          PGP Encrypted
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white font-bold', providerColors[selectedEmail.provider])}>
                      {providerIcons[selectedEmail.provider]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{selectedEmail.sender}</p>
                      <p className="text-xs text-gray-400 truncate">{selectedEmail.senderEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{selectedEmail.time}</p>
                      <p className="text-xs text-gray-500">→ {selectedEmail.to}</p>
                    </div>
                  </div>
                </div>

                {/* Тело письма */}
                <div className="flex-1 overflow-y-auto p-6">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {selectedEmail.body}
                  </pre>
                </div>

                {/* Панель действий */}
                <div className="p-4 border-t border-white/10 flex items-center gap-2">
                  <Button variant="outline" size="sm" leftIcon={<Reply className="w-4 h-4" />}>
                    Ответить
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<Forward className="w-4 h-4" />}>
                    Переслать
                  </Button>
                  <Button variant="ghost" size="sm" leftIcon={<Archive className="w-4 h-4" />}>
                    В архив
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDeleteEmail(selectedEmail.id)}
                  >
                    Удалить
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Выберите письмо для чтения</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Модальное окно - Написать письмо */}
      <Modal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        size="xl"
        title="Написать письмо"
        showCloseButton
      >
        <div className="space-y-4">
          {/* От кого */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              От кого
            </label>
            <div className="relative">
              <select
                value={composeData.from}
                onChange={(e) => setComposeData({ ...composeData, from: e.target.value })}
                className="w-full bg-cyber-gray border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-cyber-cyan/50"
              >
                {connectedServices.map((service) => (
                  <option key={service.id} value={service.email}>
                    {service.name} — {service.email}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Кому */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Кому
            </label>
            <input
              type="email"
              value={composeData.to}
              onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
              placeholder="recipient@example.com"
              className="w-full bg-cyber-gray border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50"
            />
          </div>

          {/* Тема */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Тема
            </label>
            <input
              type="text"
              value={composeData.subject}
              onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
              placeholder="Тема письма"
              className="w-full bg-cyber-gray border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50"
            />
          </div>

          {/* Сообщение */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Сообщение
            </label>
            <textarea
              value={composeData.body}
              onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
              placeholder="Введите текст сообщения..."
              rows={10}
              className="w-full bg-cyber-gray border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50 resize-none"
            />
          </div>

          {/* Опции */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={composeData.encrypted}
                onChange={(e) => setComposeData({ ...composeData, encrypted: e.target.checked })}
                className="w-4 h-4 rounded border-white/10 bg-cyber-gray text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <Lock className="w-4 h-4" />
                Зашифровать PGP
              </span>
            </label>
            <Button variant="ghost" size="sm" leftIcon={<Paperclip className="w-4 h-4" />}>
              Прикрепить файл
            </Button>
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setIsComposeModalOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleSendEmail}
              leftIcon={<Send className="w-4 h-4" />}
              className="bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/90"
            >
              Отправить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
