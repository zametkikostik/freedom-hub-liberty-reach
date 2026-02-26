import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  MessageSquare,
  Image,
  Video,
  Users,
  FileText,
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  RefreshCw,
  Gavel,
  Scale,
  UserX,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const MODERATION_STATS = {
  total: 15847,
  pending: 342,
  approved: 8920,
  rejected: 6243,
  appeals: 342,
  accuracy: '97.8%',
  avgReviewTime: '2.4м',
};

const VIOLATIONS_BY_CATEGORY = [
  { category: 'Спам', count: 4520, percentage: 28.5, color: 'bg-yellow-500', trend: '+12%' },
  { category: 'Оскорбления', count: 3180, percentage: 20.1, color: 'bg-red-500', trend: '+8%' },
  { category: 'NSFW', count: 2890, percentage: 18.2, color: 'bg-pink-500', trend: '-5%' },
  { category: 'Дезинформация', count: 2140, percentage: 13.5, color: 'bg-blue-500', trend: '+22%' },
  { category: 'Насилие', count: 1680, percentage: 10.6, color: 'bg-orange-500', trend: '-3%' },
  { category: 'Другое', count: 1437, percentage: 9.1, color: 'bg-gray-500', trend: '+2%' },
];

const WEEKLY_DATA = [
  { day: 'Пн', violations: 245, approved: 180, rejected: 65 },
  { day: 'Вт', violations: 312, approved: 245, rejected: 67 },
  { day: 'Ср', violations: 289, approved: 210, rejected: 79 },
  { day: 'Чт', violations: 378, approved: 290, rejected: 88 },
  { day: 'Пт', violations: 425, approved: 320, rejected: 105 },
  { day: 'Сб', violations: 198, approved: 145, rejected: 53 },
  { day: 'Вс', violations: 167, approved: 120, rejected: 47 },
];

const APPEALS_DATA = [
  {
    id: 'a1',
    userId: 'u123',
    username: '@crypto_trader',
    originalAction: 'ban_7d',
    reason: 'Я не нарушал правила, это была шутка',
    status: 'pending',
    submittedAt: new Date(Date.now() - 3600000),
    violationType: 'harassment',
  },
  {
    id: 'a2',
    userId: 'u456',
    username: '@news_bot',
    originalAction: 'content_removed',
    reason: 'Это была реальная новость, а не фейк',
    status: 'pending',
    submittedAt: new Date(Date.now() - 7200000),
    violationType: 'misinformation',
  },
  {
    id: 'a3',
    userId: 'u789',
    username: '@artist_pro',
    originalAction: 'ban_30d',
    reason: 'Мое искусство не является NSFW',
    status: 'approved',
    submittedAt: new Date(Date.now() - 86400000),
    violationType: 'nsfw',
    resolvedAt: new Date(Date.now() - 43200000),
    resolvedBy: '@admin_sarah',
  },
  {
    id: 'a4',
    userId: 'u321',
    username: '@angry_user',
    originalAction: 'ban_permanent',
    reason: 'Прошу разбанить, я исправлюсь',
    status: 'rejected',
    submittedAt: new Date(Date.now() - 172800000),
    violationType: 'hate',
    resolvedAt: new Date(Date.now() - 86400000),
    resolvedBy: '@admin_mike',
  },
];

const CONTENT_TYPE_DISTRIBUTION = [
  { type: 'Сообщения', count: 8920, percentage: 56, icon: MessageSquare, color: 'text-cyan-400' },
  { type: 'Изображения', count: 3180, percentage: 20, icon: Image, color: 'text-pink-400' },
  { type: 'Видео', count: 2140, percentage: 13, icon: Video, color: 'text-red-400' },
  { type: 'Профили', count: 1607, percentage: 11, icon: Users, color: 'text-purple-400' },
];

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
  subtitle?: string;
}> = ({ title, value, icon, color, trend, trendPositive, subtitle }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
    <div className="flex items-center justify-between mb-4">
      <div className={cn('p-3 rounded-xl bg-white/10', color)}>{icon}</div>
      {trend && (
        <div className={cn(
          'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold',
          trendPositive ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
        )}>
          {trendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trend}</span>
        </div>
      )}
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-white/60 text-sm">{title}</p>
    {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
  </div>
);

const ViolationsChart: React.FC = () => {
  const maxValue = Math.max(...WEEKLY_DATA.map(d => d.violations));

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Нарушения по дням</h3>
          <p className="text-white/60 text-sm">За последнюю неделю</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-white/60 text-xs">Всего</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-white/60 text-xs">Одобрено</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-white/60 text-xs">Отклонено</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between space-x-2 h-64">
        {WEEKLY_DATA.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-1">
            <div className="w-full flex space-x-0.5 items-end h-48">
              {/* Approved */}
              <div
                className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all hover:from-green-400 hover:to-green-300"
                style={{ height: `${(day.approved / maxValue) * 100}%`, minHeight: '4px' }}
              />
              {/* Rejected */}
              <div
                className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t transition-all hover:from-red-400 hover:to-red-300"
                style={{ height: `${(day.rejected / maxValue) * 100}%`, minHeight: '4px' }}
              />
            </div>
            {/* Total indicator */}
            <div className="w-full h-1 bg-amber-500/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(day.violations / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-white/60 text-xs font-medium">{day.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryBreakdown: React.FC = () => {
  const total = VIOLATIONS_BY_CATEGORY.reduce((sum, cat) => sum + cat.count, 0);
  const maxCount = Math.max(...VIOLATIONS_BY_CATEGORY.map(cat => cat.count));

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Категории нарушений</h3>
          <p className="text-white/60 text-sm">Распределение по типам</p>
        </div>
        <PieChart className="w-5 h-5 text-purple-400" />
      </div>

      <div className="space-y-4">
        {VIOLATIONS_BY_CATEGORY.map((category) => (
          <div key={category.category}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={cn('w-3 h-3 rounded-full', category.color)} />
                <span className="text-white/80 text-sm font-medium">{category.category}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-white/60 text-xs">{category.count.toLocaleString()}</span>
                <span className="text-white font-bold text-xs w-10 text-right">{category.percentage}%</span>
                <span className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-full',
                  category.trend.startsWith('+')
                    ? 'text-red-400 bg-red-500/20'
                    : 'text-green-400 bg-green-500/20'
                )}>
                  {category.trend}
                </span>
              </div>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-1000', category.color)}
                style={{ width: `${(category.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContentTypeGrid: React.FC = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Типы контента</h3>
        <p className="text-white/60 text-sm">Где больше нарушений</p>
      </div>
      <BarChart3 className="w-5 h-5 text-cyan-400" />
    </div>

    <div className="grid grid-cols-2 gap-4">
      {CONTENT_TYPE_DISTRIBUTION.map((item) => (
        <div key={item.type} className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <item.icon className={cn('w-5 h-5', item.color)} />
            <span className="text-white/80 text-sm">{item.type}</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{item.count.toLocaleString()}</p>
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs">{item.percentage}% от всех</span>
            <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full', item.color.replace('text-', 'bg-'))}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AppealsTable: React.FC<{
  appeals: typeof APPEALS_DATA;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ appeals, onApprove, onReject }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Апелляции</h3>
          <p className="text-white/60 text-sm">Запросы на пересмотр решений</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 text-sm">
          <Download className="w-4 h-4" />
          <span>Экспорт</span>
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Пользователь</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Причина</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Нарушение</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Статус</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Дата</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Действия</th>
          </tr>
        </thead>
        <tbody>
          {appeals.map((appeal) => (
            <tr key={appeal.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <p className="text-white font-medium">{appeal.username}</p>
                  <p className="text-white/40 text-xs">ID: {appeal.userId}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-white/80 text-sm max-w-xs truncate">{appeal.reason}</p>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  appeal.violationType === 'harassment' && 'bg-purple-500/20 text-purple-400',
                  appeal.violationType === 'misinformation' && 'bg-blue-500/20 text-blue-400',
                  appeal.violationType === 'nsfw' && 'bg-pink-500/20 text-pink-400',
                  appeal.violationType === 'hate' && 'bg-red-500/20 text-red-400'
                )}>
                  {appeal.violationType === 'harassment' && 'Оскорбления'}
                  {appeal.violationType === 'misinformation' && 'Дезинформация'}
                  {appeal.violationType === 'nsfw' && 'NSFW'}
                  {appeal.violationType === 'hate' && 'Язык вражды'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit',
                  appeal.status === 'pending' && 'bg-blue-500/20 text-blue-400',
                  appeal.status === 'approved' && 'bg-green-500/20 text-green-400',
                  appeal.status === 'rejected' && 'bg-red-500/20 text-red-400'
                )}>
                  {appeal.status === 'pending' && <Clock className="w-3 h-3" />}
                  {appeal.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                  {appeal.status === 'rejected' && <XCircle className="w-3 h-3" />}
                  <span>
                    {appeal.status === 'pending' && 'На рассмотрении'}
                    {appeal.status === 'approved' && 'Одобрено'}
                    {appeal.status === 'rejected' && 'Отклонено'}
                  </span>
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-white/80 text-sm">
                  {appeal.submittedAt.toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  {appeal.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => onApprove(appeal.id)}
                        className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                        title="Одобрить"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </button>
                      <button
                        onClick={() => onReject(appeal.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Отклонить"
                      >
                        <XCircle className="w-4 h-4 text-red-400" />
                      </button>
                    </>
                  ) : (
                    <button
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Просмотреть"
                    >
                      <Eye className="w-4 h-4 text-white/60" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ModerationPanel: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appeals, setAppeals] = useState(APPEALS_DATA);

  const handleApprove = (id: string) => {
    setAppeals(prev => prev.map(a => a.id === id ? { 
      ...a, 
      status: 'approved' as const,
      resolvedAt: new Date(),
      resolvedBy: '@admin_current'
    } : a));
  };

  const handleReject = (id: string) => {
    setAppeals(prev => prev.map(a => a.id === id ? { 
      ...a, 
      status: 'rejected' as const,
      resolvedAt: new Date(),
      resolvedBy: '@admin_current'
    } : a));
  };

  const filteredAppeals = appeals.filter(appeal => {
    if (filter !== 'all' && appeal.status !== filter) return false;
    if (searchQuery && !appeal.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !appeal.reason.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
              <Scale className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Модерация и Апелляции</h1>
              <p className="text-white/60">Статистика нарушений и пересмотр решений</p>
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

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Всего нарушений"
            value={MODERATION_STATS.total.toLocaleString()}
            icon={<AlertTriangle className="w-6 h-6 text-amber-400" />}
            color="bg-amber-500/20"
            trend="+15%"
            trendPositive={false}
          />
          <StatCard
            title="Ожидают рассмотрения"
            value={MODERATION_STATS.pending}
            icon={<Clock className="w-6 h-6 text-blue-400" />}
            color="bg-blue-500/20"
            trend="+8"
            trendPositive={false}
          />
          <StatCard
            title="Одобрено"
            value={MODERATION_STATS.approved.toLocaleString()}
            icon={<CheckCircle className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
            trend="+12%"
            trendPositive
          />
          <StatCard
            title="Отклонено"
            value={MODERATION_STATS.rejected.toLocaleString()}
            icon={<XCircle className="w-6 h-6 text-red-400" />}
            color="bg-red-500/20"
            trend="-5%"
            trendPositive
          />
          <StatCard
            title="Апелляции"
            value={MODERATION_STATS.appeals}
            icon={<HelpCircle className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
            subtitle="Активные запросы"
          />
          <StatCard
            title="Точность"
            value={MODERATION_STATS.accuracy}
            icon={<Gavel className="w-6 h-6 text-cyan-400" />}
            color="bg-cyan-500/20"
            trend="+2.1%"
            trendPositive
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ViolationsChart />
          <CategoryBreakdown />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ContentTypeGrid />
          </div>

          {/* Quick Stats */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">Быстрая статистика</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Успешных апелляций</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-green-400">127</p>
                <p className="text-green-400/60 text-xs mt-1">37% от всех апелляций</p>
              </div>

              <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Отклонённых апелляций</span>
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-red-400">215</p>
                <p className="text-red-400/60 text-xs mt-1">63% от всех апелляций</p>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Среднее время рассмотрения</span>
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-blue-400">4.2ч</p>
                <p className="text-blue-400/60 text-xs mt-1">На одну апелляцию</p>
              </div>

              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Забанено пользователей</span>
                  <UserX className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-purple-400">892</p>
                <p className="text-purple-400/60 text-xs mt-1">За последний месяц</p>
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
                placeholder="Поиск по username или причине..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/40" />
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
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
                  {status === 'pending' && 'На рассмотрении'}
                  {status === 'approved' && 'Одобрено'}
                  {status === 'rejected' && 'Отклонено'}
                </button>
              ))}
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80">
              <Calendar className="w-4 h-4" />
              <span>Период</span>
            </button>
          </div>
        </div>

        {/* Appeals Table */}
        <AppealsTable
          appeals={filteredAppeals}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
};

export default ModerationPanel;
