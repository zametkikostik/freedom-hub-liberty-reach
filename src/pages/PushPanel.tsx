import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Send,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  Smartphone,
  Globe,
  Zap,
  Image,
  Link as LinkIcon,
  Trash2,
  Eye,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

interface PushNotification {
  id: string;
  title: string;
  message: string;
  sentAt: Date;
  recipients: number;
  opened: number;
  status: 'sent' | 'scheduled' | 'draft';
  type: 'all' | 'segment' | 'individual';
}

const PUSH_HISTORY: PushNotification[] = [
  {
    id: 'p1',
    title: 'Новая функция: AI перевод',
    message: 'Теперь сообщения переводятся автоматически в реальном времени!',
    sentAt: new Date(Date.now() - 86400000),
    recipients: 284000,
    opened: 142000,
    status: 'sent',
    type: 'all',
  },
  {
    id: 'p2',
    title: 'Обновление безопасности',
    message: 'Мы обновили систему шифрования. Ваши данные под надёжной защитой.',
    sentAt: new Date(Date.now() - 604800000),
    recipients: 284000,
    opened: 198800,
    status: 'sent',
    type: 'all',
  },
  {
    id: 'p3',
    title: 'Premium со скидкой 50%',
    message: 'Только 48 часов! Получите Lifetime Premium по специальной цене.',
    sentAt: new Date(Date.now() - 1209600000),
    recipients: 45200,
    opened: 38420,
    status: 'sent',
    type: 'segment',
  },
  {
    id: 'p4',
    title: 'Добро пожаловать!',
    message: 'Спасибо за регистрацию. Изучите все возможности Freedom Hub.',
    sentAt: new Date(Date.now() - 2592000000),
    recipients: 12450,
    opened: 9960,
    status: 'sent',
    type: 'individual',
  },
];

const PUSH_STATS = {
  totalSent: 1847293,
  avgOpenRate: '68.5%',
  totalUsers: 284000,
  enabled: 245600,
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
    <div className="flex items-center justify-between mb-4">
      <div className={cn('p-3 rounded-xl bg-white/10', color)}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-white/60 text-sm">{title}</p>
    {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
  </div>
);

const NotificationPreview: React.FC<{
  title: string;
  message: string;
  icon?: React.ReactNode;
}> = ({ title, message, icon }) => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl p-4 max-w-sm">
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
        {icon || <Bell className="w-5 h-5 text-cyan-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
        <p className="text-white/60 text-xs line-clamp-2">{message}</p>
        <div className="flex items-center space-x-2 mt-3">
          <span className="text-white/40 text-xs">Freedom Hub</span>
          <span className="text-white/30 text-xs">•</span>
          <span className="text-white/40 text-xs">Сейчас</span>
        </div>
      </div>
    </div>
  </div>
);

const HistoryTable: React.FC<{
  notifications: PushNotification[];
  onResend: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notifications, onResend, onDelete }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">История уведомлений</h3>
          <p className="text-white/60 text-sm">Последние отправленные push-уведомления</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 text-sm">
          <BarChart3 className="w-4 h-4" />
          <span>Аналитика</span>
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Уведомление</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Отправлено</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Получатели</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Открытия</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Статус</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notif) => {
            const openRate = Math.round((notif.opened / notif.recipients) * 100);
            
            return (
              <tr key={notif.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-white font-medium">{notif.title}</p>
                    <p className="text-white/60 text-xs truncate max-w-md">{notif.message}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{notif.sentAt.toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white/80 font-mono text-sm">{notif.recipients.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-white/80 font-mono text-sm">{notif.opened.toLocaleString()}</span>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      openRate >= 60 ? 'bg-green-500/20 text-green-400' :
                      openRate >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    )}>
                      {openRate}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    notif.status === 'sent' && 'bg-green-500/20 text-green-400',
                    notif.status === 'scheduled' && 'bg-yellow-500/20 text-yellow-400',
                    notif.status === 'draft' && 'bg-gray-500/20 text-gray-400'
                  )}>
                    {notif.status === 'sent' && 'Отправлено'}
                    {notif.status === 'scheduled' && 'Запланировано'}
                    {notif.status === 'draft' && 'Черновик'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onResend(notif.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Отправить повторно"
                    >
                      <Send className="w-4 h-4 text-white/60" />
                    </button>
                    <button
                      onClick={() => onDelete(notif.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const PushPanel: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [audience, setAudience] = useState<'all' | 'premium' | 'unverified'>('all');
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [history, setHistory] = useState<PushNotification[]>(PUSH_HISTORY);

  const handleSend = () => {
    setIsSending(true);
    
    // Имитация отправки
    setTimeout(() => {
      const newNotification: PushNotification = {
        id: `p${Date.now()}`,
        title,
        message,
        sentAt: new Date(),
        recipients: audience === 'all' ? PUSH_STATS.totalUsers : 
                    audience === 'premium' ? 45200 : 12450,
        opened: 0,
        status: 'sent',
        type: audience === 'all' ? 'all' : 'segment',
      };
      
      setHistory(prev => [newNotification, ...prev]);
      setIsSending(false);
      setShowConfirm(false);
      setTitle('');
      setMessage('');
      setLink('');
      setImage('');
    }, 2000);
  };

  const handleResend = (id: string) => {
    const notif = history.find(n => n.id === id);
    if (notif) {
      setTitle(notif.title);
      setMessage(notif.message);
      setShowConfirm(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены? Это действие нельзя отменить.')) {
      setHistory(prev => prev.filter(n => n.id !== id));
    }
  };

  const getAudienceCount = () => {
    switch (audience) {
      case 'all': return PUSH_STATS.enabled.toLocaleString();
      case 'premium': return '45,200';
      case 'unverified': return '12,450';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <Bell className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Push-уведомления</h1>
              <p className="text-white/60">Отправка уведомлений пользователям</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад в админку</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Всего отправлено"
            value={PUSH_STATS.totalSent.toLocaleString()}
            icon={<Send className="w-6 h-6 text-cyan-400" />}
            color="bg-cyan-500/20"
            subtitle="За всё время"
          />
          <StatCard
            title="Средний Open Rate"
            value={PUSH_STATS.avgOpenRate}
            icon={<BarChart3 className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
            subtitle="Процент открытий"
          />
          <StatCard
            title="Всего пользователей"
            value={PUSH_STATS.totalUsers.toLocaleString()}
            icon={<Users className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
            subtitle="Аккаунтов"
          />
          <StatCard
            title="Push включён"
            value={PUSH_STATS.enabled.toLocaleString()}
            icon={<Bell className="w-6 h-6 text-amber-400" />}
            color="bg-amber-500/20"
            subtitle={`${Math.round((PUSH_STATS.enabled / PUSH_STATS.totalUsers) * 100)}% пользователей`}
          />
        </div>

        {/* Send Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-6">
              <Send className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Новое уведомление</h2>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="text-white/60 text-sm mb-2 block flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Заголовок</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Новая функция!"
                  maxLength={50}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                <p className="text-white/40 text-xs mt-1 text-right">{title.length}/50</p>
              </div>

              {/* Message */}
              <div>
                <label className="text-white/60 text-sm mb-2 block flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Текст сообщения</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Опишите, что вы хотите сообщить..."
                  maxLength={200}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                />
                <p className="text-white/40 text-xs mt-1 text-right">{message.length}/200</p>
              </div>

              {/* Link */}
              <div>
                <label className="text-white/60 text-sm mb-2 block flex items-center space-x-2">
                  <LinkIcon className="w-4 h-4" />
                  <span>Ссылка (необязательно)</span>
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://freedom-hub.app/..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              {/* Image */}
              <div>
                <label className="text-white/60 text-sm mb-2 block flex items-center space-x-2">
                  <Image className="w-4 h-4" />
                  <span>Изображение (необязательно)</span>
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              {/* Audience */}
              <div>
                <label className="text-white/60 text-sm mb-3 block flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Аудитория</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setAudience('all')}
                    className={cn(
                      'p-4 rounded-xl border transition-all text-left',
                      audience === 'all'
                        ? 'bg-cyan-500/20 border-cyan-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    )}
                  >
                    <Globe className={cn('w-5 h-5 mb-2', audience === 'all' ? 'text-cyan-400' : 'text-white/60')} />
                    <p className={cn('text-sm font-semibold', audience === 'all' ? 'text-white' : 'text-white/80')}>Все пользователи</p>
                    <p className="text-white/40 text-xs mt-1">{PUSH_STATS.enabled.toLocaleString()} человек</p>
                  </button>

                  <button
                    onClick={() => setAudience('premium')}
                    className={cn(
                      'p-4 rounded-xl border transition-all text-left',
                      audience === 'premium'
                        ? 'bg-pink-500/20 border-pink-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    )}
                  >
                    <Zap className={cn('w-5 h-5 mb-2', audience === 'premium' ? 'text-pink-400' : 'text-white/60')} />
                    <p className={cn('text-sm font-semibold', audience === 'premium' ? 'text-white' : 'text-white/80')}>Premium</p>
                    <p className="text-white/40 text-xs mt-1">45,200 человек</p>
                  </button>

                  <button
                    onClick={() => setAudience('unverified')}
                    className={cn(
                      'p-4 rounded-xl border transition-all text-left',
                      audience === 'unverified'
                        ? 'bg-amber-500/20 border-amber-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    )}
                  >
                    <AlertCircle className={cn('w-5 h-5 mb-2', audience === 'unverified' ? 'text-amber-400' : 'text-white/60')} />
                    <p className={cn('text-sm font-semibold', audience === 'unverified' ? 'text-white' : 'text-white/80')}>Без верификации</p>
                    <p className="text-white/40 text-xs mt-1">12,450 человек</p>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={() => setShowPreview(true)}
                  disabled={!title || !message}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Предпросмотр</span>
                </button>

                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={!title || !message || isSending}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  {isSending ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Отправить</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Предпросмотр</h2>
            </div>

            <div className="space-y-4">
              <p className="text-white/60 text-sm mb-4">Так уведомление будет выглядеть на устройстве пользователя:</p>
              
              <NotificationPreview
                title={title || 'Заголовок уведомления'}
                message={message || 'Текст сообщения появится здесь...'}
              />

              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Информация</p>
                    <p className="text-blue-400/60 text-xs mt-1">
                      Уведомление получат только пользователи с включёнными push-уведомлениями
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
                <div className="flex items-start space-x-2">
                  <Users className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-amber-200 text-sm font-medium">Аудитория</p>
                    <p className="text-amber-400/60 text-xs mt-1">
                      {getAudienceCount()} получателей
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <HistoryTable
          notifications={history}
          onResend={handleResend}
          onDelete={handleDelete}
        />
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Предпросмотр</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </button>
            </div>
            <NotificationPreview title={title} message={message} />
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Отправить уведомление?</h3>
              <p className="text-white/60 text-sm">
                Уведомление будет отправлено <span className="text-white font-semibold">{getAudienceCount()}</span> пользователям
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSend}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Подтвердить отправку</span>
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Icon component
const MessageSquare: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default PushPanel;
