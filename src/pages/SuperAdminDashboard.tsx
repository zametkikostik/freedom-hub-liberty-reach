import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Shield,
  Bell,
  Mail,
  Settings,
  User,
  Activity,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Calendar,
  BarChart3,
  FileText,
  MessageSquare,
  Video,
  Image,
  Music,
  Brain,
  Map,
  Key,
  Sparkles,
  BadgeCheck,
  Send,
  Search,
  Filter,
  Download,
  Moon,
  Sun,
  Monitor,
  LogOut,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Star,
  Bookmark,
  Pin,
  Server,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const SUPER_ADMIN = {
  id: 'super_admin_001',
  username: 'zametkikostik',
  email: 'admin@freedom-hub.app',
  avatar: 'https://picsum.photos/seed/zametkikostik/200/200',
  role: 'Super Administrator',
  accessLevel: 'GLOBAL',
  createdAt: new Date('2024-01-01'),
  lastLogin: new Date(),
  twoFactorEnabled: true,
  canAccessMap: true,
  canManageNodes: true,
  canViewAllAPI: true,
};

const NODE_STATS = {
  totalNodes: 1248,
  activeNodes: 1186,
  pendingNodes: 42,
  suspendedNodes: 20,
  totalRevenue: '$486,240',
  protocolFee2percent: '$84,000',
  avgNodeRevenue: '$389',
  topNode: 'cyber-rebel.net ($2,409)',
};

const DASHBOARD_STATS = {
  totalUsers: 284000,
  activeNodes: 1248,
  totalRevenue: '$486,240',
  protocolFee: '$84,000',
  messagesToday: 12450,
  violationsPending: 342,
  apiRequests24h: 2847293,
  uptime: '99.97%',
};

const RECENT_ACTIVITY = [
  { id: 1, type: 'violation', user: '@crypto_spammer', action: 'Заблокирован за спам', time: '5 мин назад', icon: AlertTriangle, color: 'text-red-400' },
  { id: 2, type: 'premium', user: '@neo_matrix', action: 'Активирован Premium Lifetime', time: '12 мин назад', icon: Crown, color: 'text-amber-400' },
  { id: 3, type: 'verification', user: '@vitalik_fan', action: 'Верифицирован как Партнёр', time: '25 мин назад', icon: BadgeCheck, color: 'text-cyan-400' },
  { id: 4, type: 'api', user: 'AI Hub', action: 'Создан новый API ключ', time: '1 час назад', icon: Key, color: 'text-purple-400' },
  { id: 5, type: 'push', user: 'System', action: 'Отправлено push-уведомление (284K)', time: '2 часа назад', icon: Bell, color: 'text-pink-400' },
  { id: 6, type: 'map', user: '@lost_user', action: 'Запрос на отслеживание (МВД)', time: '3 часа назад', icon: Map, color: 'text-blue-400' },
];

const QUICK_ACTIONS = [
  { id: 1, name: 'Пользователи', icon: Users, color: 'bg-blue-500', href: '/admin/users' },
  { id: 2, name: 'Верификация', icon: BadgeCheck, color: 'bg-cyan-500', href: '/admin/verification' },
  { id: 3, name: 'Premium', icon: Crown, color: 'bg-pink-500', href: '/admin/premium' },
  { id: 4, name: 'Активность', icon: Activity, color: 'bg-purple-500', href: '/admin/activity' },
  { id: 5, name: 'API Ключи', icon: Key, color: 'bg-amber-500', href: '/admin/api' },
  { id: 6, name: 'Модератор', icon: Brain, color: 'bg-green-500', href: '/admin/moderator' },
  { id: 7, name: 'Модерация', icon: Shield, color: 'bg-red-500', href: '/admin/moderation' },
  { id: 8, name: 'Карта', icon: Map, color: 'bg-indigo-500', href: '/admin/map' },
  { id: 9, name: 'Push', icon: Bell, color: 'bg-orange-500', href: '/admin/push' },
];

const NODE_QUICK_ACTIONS = [
  { id: 1, name: 'Управление нодами', icon: Server, color: 'bg-emerald-500', href: '/admin/nodes' },
  { id: 2, name: 'API Нод', icon: Key, color: 'bg-teal-500', href: '/admin/nodes/api' },
  { id: 3, name: 'Доходы 2%', icon: DollarSign, color: 'bg-green-500', href: '/admin/nodes/revenue' },
  { id: 4, name: 'Мониторинг', icon: Activity, color: 'bg-cyan-500', href: '/admin/nodes/monitoring' },
];

const PERSONAL_NOTES = [
  { id: 1, title: 'Проверить запрос от ФСБ', content: 'Документы в папке /requests/fsb/2025-02', pinned: true, createdAt: new Date(Date.now() - 86400000) },
  { id: 2, title: 'Обновление протокола v2.5', content: 'Запланировать на следующую неделю', pinned: true, createdAt: new Date(Date.now() - 172800000) },
  { id: 3, title: 'Найти пропавшего пользователя', content: '@lost_user - последний раз видели в Новосибирске', pinned: false, createdAt: new Date(Date.now() - 259200000) },
];

const SYSTEM_HEALTH = [
  { name: 'API Gateway', status: 'operational', latency: '24ms', uptime: '99.99%' },
  { name: 'Database Cluster', status: 'operational', latency: '8ms', uptime: '99.97%' },
  { name: 'AI Services', status: 'operational', latency: '156ms', uptime: '99.95%' },
  { name: 'Push Notifications', status: 'degraded', latency: '340ms', uptime: '98.50%' },
  { name: 'Map Services', status: 'operational', latency: '45ms', uptime: '99.92%' },
  { name: 'Storage (IPFS)', status: 'operational', latency: '89ms', uptime: '99.88%' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  trendPositive?: boolean;
}> = ({ title, value, icon, color, trend, trendPositive }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-white/20 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={cn('p-3 rounded-xl bg-white/10', color)}>{icon}</div>
      {trend && (
        <div className={cn(
          'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold',
          trendPositive ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
        )}>
          {trendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
          <span>{trend}</span>
        </div>
      )}
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-white/60 text-sm">{title}</p>
  </div>
);

const QuickAction: React.FC<{
  action: typeof QUICK_ACTIONS[0];
  onClick: () => void;
}> = ({ action, onClick }) => {
  const Icon = action.icon;
  
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
    >
      <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity', action.color)} />
      <div className="relative">
        <div className={cn('p-3 rounded-xl mb-3', action.color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <p className="text-white font-semibold">{action.name}</p>
        <ChevronRight className="absolute top-6 right-6 w-5 h-5 text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  );
};

const ActivityItem: React.FC<{
  activity: typeof RECENT_ACTIVITY[0];
}> = ({ activity }) => {
  const Icon = activity.icon;
  
  return (
    <div className="flex items-center space-x-4 p-3 hover:bg-white/5 rounded-xl transition-all">
      <div className={cn('p-2 rounded-lg bg-white/5', activity.color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">{activity.action}</p>
        <p className="text-white/40 text-xs">{activity.user}</p>
      </div>
      <span className="text-white/40 text-xs whitespace-nowrap">{activity.time}</span>
    </div>
  );
};

const SystemHealthItem: React.FC<{
  service: typeof SYSTEM_HEALTH[0];
}> = ({ service }) => (
  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
    <div className="flex items-center space-x-3">
      <div className={cn(
        'w-2 h-2 rounded-full',
        service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
      )} />
      <span className="text-white/80 text-sm">{service.name}</span>
    </div>
    <div className="flex items-center space-x-4 text-xs text-white/40">
      <span>{service.latency}</span>
      <span>{service.uptime}</span>
    </div>
  </div>
);

const NoteCard: React.FC<{
  note: typeof PERSONAL_NOTES[0];
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
}> = ({ note, onEdit, onDelete, onPin }) => (
  <div className={cn(
    'p-4 rounded-xl border transition-all hover:border-white/20',
    note.pinned ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'
  )}>
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center space-x-2">
        {note.pinned && <Pin className="w-3 h-3 text-amber-400" />}
        <h4 className="text-white font-semibold text-sm">{note.title}</h4>
      </div>
      <div className="flex items-center space-x-1">
        <button onClick={onPin} className="p-1 hover:bg-white/10 rounded">
          <Pin className={cn('w-3 h-3', note.pinned ? 'text-amber-400' : 'text-white/40')} />
        </button>
        <button onClick={onEdit} className="p-1 hover:bg-white/10 rounded">
          <Edit className="w-3 h-3 text-white/60" />
        </button>
        <button onClick={onDelete} className="p-1 hover:bg-red-500/20 rounded">
          <Trash2 className="w-3 h-3 text-red-400" />
        </button>
      </div>
    </div>
    <p className="text-white/60 text-xs">{note.content}</p>
    <p className="text-white/40 text-xs mt-2">{note.createdAt.toLocaleDateString()}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [notes, setNotes] = useState(PERSONAL_NOTES);
  const [showNewNote, setShowNewNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (newNoteTitle && newNoteContent) {
      setNotes(prev => [{
        id: Date.now(),
        title: newNoteTitle,
        content: newNoteContent,
        pinned: false,
        createdAt: new Date(),
      }, ...prev]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowNewNote(false);
    }
  };

  const handlePinNote = (id: number) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const handleDeleteNote = (id: number) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-amber-500/20 to-purple-500/20 rounded-2xl border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Панель Супер-Администратора</h1>
              <p className="text-white/60">Добро пожаловать, <span className="text-amber-400 font-semibold">zametkikostik</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-white/80" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Messages */}
            <button className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <Mail className="w-5 h-5 text-white/80" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 p-2 pr-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <img src={SUPER_ADMIN.avatar} alt={SUPER_ADMIN.username} className="w-8 h-8 rounded-full border-2 border-amber-400" />
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{SUPER_ADMIN.username}</p>
                  <p className="text-white/40 text-xs">{SUPER_ADMIN.role}</p>
                </div>
                <ChevronRight className={cn('w-4 h-4 text-white/60 transition-transform', showProfile && 'rotate-90')} />
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <img src={SUPER_ADMIN.avatar} alt={SUPER_ADMIN.username} className="w-12 h-12 rounded-full border-2 border-amber-400" />
                      <div>
                        <p className="text-white font-bold">{SUPER_ADMIN.username}</p>
                        <p className="text-white/40 text-xs">{SUPER_ADMIN.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-xl transition-all text-left text-white/80">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Профиль</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-xl transition-all text-left text-white/80">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Настройки</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-xl transition-all text-left text-white/80">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Безопасность</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-red-500/20 rounded-xl transition-all text-left text-red-400">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Выйти</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Access Level Badge */}
        <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-amber-400 font-bold text-lg">GLOBAL ACCESS LEVEL</p>
                <p className="text-white/60 text-sm">Полный доступ ко всем системам Freedom Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <p className="text-white font-bold text-xl">{SUPER_ADMIN.accessLevel}</p>
                <p className="text-white/40 text-xs">Уровень доступа</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 font-bold text-xl">2FA</p>
                <p className="text-white/40 text-xs">Защищено</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-xl">{Math.round((Date.now() - SUPER_ADMIN.createdAt.getTime()) / 86400000)}</p>
                <p className="text-white/40 text-xs">Дней в системе</p>
              </div>
            </div>
          </div>
        </div>

        {/* Node Management Section */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <Server className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 font-bold text-lg">Управление Нодами</p>
                <p className="text-white/60 text-sm">Децентрализованная федерация Freedom Hub</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/nodes')}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl transition-all text-emerald-400 border border-emerald-500/30"
            >
              <span className="font-semibold">Все ноды</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Node Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/60 text-xs mb-1">Всего нод</p>
              <p className="text-2xl font-bold text-white">{NODE_STATS.totalNodes}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-green-400 text-xs">● {NODE_STATS.activeNodes} активны</span>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/60 text-xs mb-1">Ожидают</p>
              <p className="text-2xl font-bold text-amber-400">{NODE_STATS.pendingNodes}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-amber-400 text-xs">На проверке</span>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/60 text-xs mb-1">Доход (2% комиссия)</p>
              <p className="text-2xl font-bold text-green-400">{NODE_STATS.protocolFee2percent}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-green-400 text-xs">В месяц</span>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/60 text-xs mb-1">Средний доход ноды</p>
              <p className="text-2xl font-bold text-cyan-400">{NODE_STATS.avgNodeRevenue}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-cyan-400 text-xs">98% ноды</span>
              </div>
            </div>
          </div>

          {/* Node Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {NODE_QUICK_ACTIONS.map((action) => (
              <QuickAction
                key={action.id}
                action={action}
                onClick={() => navigate(action.href)}
              />
            ))}
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            title="Пользователей"
            value={DASHBOARD_STATS.totalUsers.toLocaleString()}
            icon={<Users className="w-6 h-6 text-blue-400" />}
            color="bg-blue-500/20"
            trend="+2.4%"
            trendPositive
          />
          <StatCard
            title="Активных нод"
            value={DASHBOARD_STATS.activeNodes.toLocaleString()}
            icon={<Activity className="w-6 h-6 text-cyan-400" />}
            color="bg-cyan-500/20"
            trend="+12"
            trendPositive
          />
          <StatCard
            title="Доход (месяц)"
            value={DASHBOARD_STATS.totalRevenue}
            icon={<DollarSign className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
            trend="+15%"
            trendPositive
          />
          <StatCard
            title="Commission Fee (2%)"
            value={DASHBOARD_STATS.protocolFee}
            icon={<Crown className="w-6 h-6 text-amber-400" />}
            color="bg-amber-500/20"
            trend="+31%"
            trendPositive
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            title="Сообщений сегодня"
            value={DASHBOARD_STATS.messagesToday.toLocaleString()}
            icon={<MessageSquare className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
          />
          <StatCard
            title="Нарушений на проверке"
            value={DASHBOARD_STATS.violationsPending}
            icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
            color="bg-red-500/20"
            trend="Требует внимания"
            trendPositive={false}
          />
          <StatCard
            title="API запросов (24ч)"
            value={DASHBOARD_STATS.apiRequests24h.toLocaleString()}
            icon={<Key className="w-6 h-6 text-pink-400" />}
            color="bg-pink-500/20"
            trend="+8.5%"
            trendPositive
          />
          <StatCard
            title="Uptime системы"
            value={DASHBOARD_STATS.uptime}
            icon={<CheckCircle className="w-6 h-6 text-emerald-400" />}
            color="bg-emerald-500/20"
          />
        </div>

        {/* Quick Actions & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Быстрый доступ</span>
                </h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {QUICK_ACTIONS.map((action) => (
                  <QuickAction
                    key={action.id}
                    action={action}
                    onClick={() => navigate(action.href)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>Активность</span>
              </h2>
              <button className="text-white/60 hover:text-white text-xs flex items-center space-x-1">
                <span>Все</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1">
              {RECENT_ACTIVITY.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Personal Notes & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Notes */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Личные заметки</span>
              </h2>
              <button
                onClick={() => setShowNewNote(true)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить</span>
              </button>
            </div>

            {showNewNote && (
              <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Заголовок..."
                  className="w-full mb-2 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50"
                />
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Заметка..."
                  rows={2}
                  className="w-full mb-3 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddNote}
                    className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => setShowNewNote(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => {}}
                  onDelete={() => handleDeleteNote(note.id)}
                  onPin={() => handlePinNote(note.id)}
                />
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span>Здоровье системы</span>
              </h2>
              <BarChart3 className="w-5 h-5 text-green-400" />
            </div>
            <div className="space-y-3">
              {SYSTEM_HEALTH.map((service, idx) => (
                <SystemHealthItem key={idx} service={service} />
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/30">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-green-200 text-sm font-semibold mb-1">Все системы работают нормально</p>
                  <p className="text-green-400/60 text-xs">Последняя проверка: {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
