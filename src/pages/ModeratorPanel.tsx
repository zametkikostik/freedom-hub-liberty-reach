import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Ban,
  RefreshCw,
  ChevronLeft,
  MessageSquare,
  Image,
  Video,
  FileText,
  Users,
  Activity,
  Settings,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  Search,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

interface ModerationAction {
  id: string;
  type: 'message' | 'image' | 'video' | 'user';
  content: string;
  userId: string;
  username: string;
  reason: string;
  confidence: number;
  action: 'blocked' | 'flagged' | 'approved' | 'pending';
  timestamp: Date;
  category: 'spam' | 'hate' | 'nsfw' | 'violence' | 'harassment' | 'misinformation';
}

interface ModerationStats {
  totalProcessed: number;
  blocked: number;
  flagged: number;
  pending: number;
  accuracy: string;
  avgResponseTime: string;
}

const MODERATION_HISTORY: ModerationAction[] = [
  {
    id: 'm1',
    type: 'message',
    content: 'Спам сообщение с рекламой крипто-сигналов...',
    userId: 'u123',
    username: '@crypto_spammer',
    reason: 'Автоматическое обнаружение спама: повторяющиеся сообщения с рекламным контентом',
    confidence: 98,
    action: 'blocked',
    timestamp: new Date(Date.now() - 300000),
    category: 'spam',
  },
  {
    id: 'm2',
    type: 'image',
    content: 'Изображение загружено в чат',
    userId: 'u456',
    username: '@bad_actor',
    reason: 'Обнаружен NSFW контент',
    confidence: 95,
    action: 'blocked',
    timestamp: new Date(Date.now() - 900000),
    category: 'nsfw',
  },
  {
    id: 'm3',
    type: 'message',
    content: 'Сообщение с потенциальными оскорблениями...',
    userId: 'u789',
    username: '@angry_user',
    reason: 'Возможный язык вражды',
    confidence: 72,
    action: 'flagged',
    timestamp: new Date(Date.now() - 1800000),
    category: 'hate',
  },
  {
    id: 'm4',
    type: 'video',
    content: 'Видео в канале "Tech Talk"',
    userId: 'u321',
    username: '@tech_guru',
    reason: 'Ожидает проверки модератором',
    confidence: 45,
    action: 'pending',
    timestamp: new Date(Date.now() - 3600000),
    category: 'violence',
  },
  {
    id: 'm5',
    type: 'message',
    content: 'Фейковая новость о криптовалюте...',
    userId: 'u654',
    username: '@fake_news',
    reason: 'Распространение дезинформации',
    confidence: 89,
    action: 'blocked',
    timestamp: new Date(Date.now() - 7200000),
    category: 'misinformation',
  },
];

const MODERATION_CONFIG = {
  autoBlock: {
    spam: true,
    hate: true,
    nsfw: true,
    violence: false,
    harassment: true,
    misinformation: false,
  },
  confidenceThreshold: 75,
  humanReviewRequired: ['violence', 'misinformation'],
  enabledCategories: ['messages', 'images', 'videos', 'profiles'],
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  trendPositive?: boolean;
}> = ({ title, value, icon, color, trend, trendPositive }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
    <div className="flex items-center justify-between mb-4">
      <div className={cn('p-3 rounded-xl bg-white/10', color)}>{icon}</div>
      {trend && (
        <span className={cn(
          'text-xs px-2 py-1 rounded-full',
          trendPositive ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
        )}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-white/60 text-sm">{title}</p>
  </div>
);

const ModerationRow: React.FC<{
  action: ModerationAction;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (id: string) => void;
}> = ({ action, onApprove, onReject, onViewDetails }) => {
  const getTypeIcon = () => {
    switch (action.type) {
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = () => {
    switch (action.category) {
      case 'spam': return 'bg-yellow-500/20 text-yellow-400';
      case 'hate': return 'bg-red-500/20 text-red-400';
      case 'nsfw': return 'bg-pink-500/20 text-pink-400';
      case 'violence': return 'bg-orange-500/20 text-orange-400';
      case 'harassment': return 'bg-purple-500/20 text-purple-400';
      case 'misinformation': return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getActionBadge = () => {
    switch (action.action) {
      case 'blocked':
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>Заблокировано</span>
          </span>
        );
      case 'flagged':
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Помечено</span>
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>На проверке</span>
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Одобрено</span>
          </span>
        );
    }
  };

  return (
    <div className={cn(
      'bg-white/5 border rounded-2xl p-6 backdrop-blur-xl transition-all hover:border-white/20',
      action.action === 'blocked' && 'border-red-500/20',
      action.action === 'pending' && 'border-blue-500/20'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={cn('p-3 rounded-xl', getCategoryColor())}>
            {getTypeIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold">{action.username}</span>
              {getActionBadge()}
            </div>
            <p className="text-white/60 text-sm mt-1 line-clamp-2">{action.content}</p>
          </div>
        </div>

        <div className="text-right">
          <div className={cn(
            'px-3 py-1 rounded-full text-xs font-bold mb-2',
            action.confidence >= 90 ? 'bg-green-500/20 text-green-400' :
            action.confidence >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          )}>
            {action.confidence}% уверенность
          </div>
          <p className="text-white/40 text-xs">
            {action.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 mb-4">
        <div className="flex items-start space-x-2">
          <Brain className="w-4 h-4 text-purple-400 mt-0.5" />
          <div>
            <p className="text-purple-200 text-xs font-semibold mb-1">Причина AI модератора</p>
            <p className="text-white/60 text-sm">{action.reason}</p>
          </div>
        </div>
      </div>

      {action.action === 'pending' && (
        <div className="flex space-x-3">
          <button
            onClick={() => onApprove(action.id)}
            className="flex-1 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Одобрить</span>
          </button>
          <button
            onClick={() => onReject(action.id)}
            className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <XCircle className="w-4 h-4" />
            <span>Заблокировать</span>
          </button>
          <button
            onClick={() => onViewDetails(action.id)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Детали</span>
          </button>
        </div>
      )}

      {action.action !== 'pending' && (
        <div className="flex space-x-3">
          <button
            onClick={() => onViewDetails(action.id)}
            className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Детали</span>
          </button>
          <button
            onClick={() => onReject(action.id)}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl font-semibold transition-all flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Пересмотреть</span>
          </button>
        </div>
      )}
    </div>
  );
};

const ConfigToggle: React.FC<{
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
}> = ({ label, description, enabled, onToggle, icon }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
      <div>
        <p className="text-white font-medium text-sm">{label}</p>
        <p className="text-white/40 text-xs">{description}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className={cn(
        'relative w-12 h-6 rounded-full transition-all',
        enabled ? 'bg-cyan-500' : 'bg-white/20'
      )}
    >
      <div className={cn(
        'absolute top-1 w-4 h-4 bg-white rounded-full transition-all',
        enabled ? 'left-7' : 'left-1'
      )} />
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ModeratorPanel: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'blocked' | 'flagged'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [config, setConfig] = useState(MODERATION_CONFIG);
  const [history, setHistory] = useState<ModerationAction[]>(MODERATION_HISTORY);

  const handleApprove = (id: string) => {
    setHistory(prev => prev.map(a => a.id === id ? { ...a, action: 'approved' as const } : a));
  };

  const handleReject = (id: string) => {
    setHistory(prev => prev.map(a => a.id === id ? { ...a, action: 'blocked' as const } : a));
  };

  const toggleConfig = (key: keyof typeof config.autoBlock) => {
    setConfig(prev => ({
      ...prev,
      autoBlock: { ...prev.autoBlock, [key]: !prev.autoBlock[key] }
    }));
  };

  const filteredHistory = history.filter(action => {
    const matchesFilter = filter === 'all' || action.action === filter;
    const matchesSearch = action.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          action.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats: ModerationStats = {
    totalProcessed: 184729,
    blocked: history.filter(a => a.action === 'blocked').length,
    flagged: history.filter(a => a.action === 'flagged').length,
    pending: history.filter(a => a.action === 'pending').length,
    accuracy: '97.8%',
    avgResponseTime: '0.3с',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">AI Модератор</h1>
              <p className="text-white/60">Глобальная система модерации контента</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Всего обработано"
            value={stats.totalProcessed.toLocaleString()}
            icon={<Activity className="w-6 h-6 text-cyan-400" />}
            color="bg-cyan-500/20"
          />
          <StatCard
            title="Заблокировано"
            value={stats.blocked}
            icon={<XCircle className="w-6 h-6 text-red-400" />}
            color="bg-red-500/20"
          />
          <StatCard
            title="Помечено"
            value={stats.flagged}
            icon={<AlertTriangle className="w-6 h-6 text-yellow-400" />}
            color="bg-yellow-500/20"
          />
          <StatCard
            title="На проверке"
            value={stats.pending}
            icon={<Clock className="w-6 h-6 text-blue-400" />}
            color="bg-blue-500/20"
          />
          <StatCard
            title="Точность AI"
            value={stats.accuracy}
            icon={<Brain className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
            trend="+2.1%"
            trendPositive
          />
          <StatCard
            title="Ср. время"
            value={stats.avgResponseTime}
            icon={<RefreshCw className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
          />
        </div>

        {/* Configuration */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Настройки AI модерации</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ConfigToggle
              label="Спам"
              description="Автоматическая блокировка спама"
              enabled={config.autoBlock.spam}
              onToggle={() => toggleConfig('spam')}
              icon={<MessageSquare className="w-4 h-4 text-yellow-400" />}
            />
            <ConfigToggle
              label="Язык вражды"
              description="Hate speech дискриминация"
              enabled={config.autoBlock.hate}
              onToggle={() => toggleConfig('hate')}
              icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
            />
            <ConfigToggle
              label="NSFW"
              description="Контент для взрослых"
              enabled={config.autoBlock.nsfw}
              onToggle={() => toggleConfig('nsfw')}
              icon={<Image className="w-4 h-4 text-pink-400" />}
            />
            <ConfigToggle
              label="Насилие"
              description="Сцены насилия"
              enabled={config.autoBlock.violence}
              onToggle={() => toggleConfig('violence')}
              icon={<Video className="w-4 h-4 text-orange-400" />}
            />
            <ConfigToggle
              label="Оскорбления"
              description="Харасмент и буллинг"
              enabled={config.autoBlock.harassment}
              onToggle={() => toggleConfig('harassment')}
              icon={<Users className="w-4 h-4 text-purple-400" />}
            />
            <ConfigToggle
              label="Дезинформация"
              description="Фейковые новости"
              enabled={config.autoBlock.misinformation}
              onToggle={() => toggleConfig('misinformation')}
              icon={<FileText className="w-4 h-4 text-blue-400" />}
            />
          </div>

          <div className="mt-6 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <p className="text-cyan-200 text-sm font-semibold mb-1">Глобальная защита экосистемы</p>
                <p className="text-cyan-400/60 text-xs">
                  AI модератор работает во всех разделах: Мессенджер, Видео, Каналы, Группы, Профили пользователей.
                  Автоматически сканирует сообщения, изображения, видео и аватары.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по username или контенту..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/40" />
              {(['all', 'pending', 'blocked', 'flagged'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    filter === status
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  {status === 'all' && 'Все'}
                  {status === 'pending' && 'На проверке'}
                  {status === 'blocked' && 'Заблокировано'}
                  {status === 'flagged' && 'Помечено'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Moderation History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>История модерации ({filteredHistory.length})</span>
            </h2>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>Аналитика</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredHistory.map((action) => (
              <ModerationRow
                key={action.id}
                action={action}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={() => {}}
              />
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-white/20" />
              </div>
              <p className="text-white/60">Записи не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorPanel;
