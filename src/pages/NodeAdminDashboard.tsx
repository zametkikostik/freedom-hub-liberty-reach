import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Server,
  Shield,
  Activity,
  Users,
  DollarSign,
  Key,
  Bell,
  Mail,
  Settings,
  User,
  ChevronRight,
  LogOut,
  Crown,
  BadgeCheck,
  Brain,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const NODE_ADMIN = {
  id: 'node_admin_001',
  username: 'node_operator',
  email: 'admin@cyber-rebel.net',
  avatar: 'https://picsum.photos/seed/nodeadmin/200/200',
  role: 'Node Administrator',
  nodeName: 'cyber-rebel.net',
  accessLevel: 'NODE',
  canAccessMap: false, // НЕТ ДОСТУПА К КАРТЕ
  canManageUsers: true,
  canViewNodeAPI: true,
};

const NODE_STATS = {
  users: 12500,
  revenue: '$120,450',
  protocolFee2percent: '$2,409',
  uptime: '99.95%',
  apiRequests24h: 284729,
  messagesToday: 1240,
};

const NODE_QUICK_ACTIONS = [
  { id: 1, name: 'Пользователи', icon: Users, color: 'bg-blue-500', href: '/node/users' },
  { id: 2, name: 'API Ключи', icon: Key, color: 'bg-amber-500', href: '/node/api' },
  { id: 3, name: 'Модерация', icon: Brain, color: 'bg-green-500', href: '/node/moderator' },
  { id: 4, name: 'Доходы', icon: DollarSign, color: 'bg-green-500', href: '/node/revenue' },
  { id: 5, name: 'Мониторинг', icon: Activity, color: 'bg-cyan-500', href: '/node/monitoring' },
  { id: 6, name: 'Push', icon: Bell, color: 'bg-orange-500', href: '/node/push' },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'user', user: '@crypto_trader', action: 'Новый пользователь', time: '5 мин назад', icon: User, color: 'text-blue-400' },
  { id: 2, type: 'revenue', user: 'Node Revenue', action: 'Получено $2,409 (2% комиссия)', time: '1 час назад', icon: DollarSign, color: 'text-green-400' },
  { id: 3, type: 'violation', user: '@spammer', action: 'Заблокирован за спам', time: '2 часа назад', icon: AlertTriangle, color: 'text-red-400' },
  { id: 4, type: 'api', user: 'AI Service', action: 'Создан API ключ', time: '3 часа назад', icon: Key, color: 'text-purple-400' },
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
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
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
  action: typeof NODE_QUICK_ACTIONS[0];
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const NodeAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl border border-emerald-500/30">
              <Server className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Панель Ноды</h1>
              <p className="text-white/60">Добро пожаловать, <span className="text-emerald-400 font-semibold">{NODE_ADMIN.username}</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-white/80" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <Mail className="w-5 h-5 text-white/80" />
            </button>
            <div className="flex items-center space-x-3 p-2 pr-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
              <img src={NODE_ADMIN.avatar} alt={NODE_ADMIN.username} className="w-8 h-8 rounded-full border-2 border-emerald-400" />
              <div className="text-left">
                <p className="text-white font-semibold text-sm">{NODE_ADMIN.username}</p>
                <p className="text-white/40 text-xs">{NODE_ADMIN.nodeName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Access Level Badge - NODE LEVEL (NO MAP ACCESS) */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 font-bold text-lg">NODE ACCESS LEVEL</p>
                <p className="text-white/60 text-sm">Доступ к управлению нодой {NODE_ADMIN.nodeName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <p className="text-white font-bold text-xl">{NODE_ADMIN.accessLevel}</p>
                <p className="text-white/40 text-xs">Уровень доступа</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-400 font-bold text-xl">{NODE_ADMIN.nodeName}</p>
                <p className="text-white/40 text-xs">Нода</p>
              </div>
              <div className="text-center px-3 py-1 bg-red-500/20 rounded-full border border-red-500/30">
                <p className="text-red-400 font-bold text-xs">NO MAP ACCESS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Node Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <StatCard
            title="Пользователей"
            value={NODE_STATS.users.toLocaleString()}
            icon={<Users className="w-6 h-6 text-blue-400" />}
            color="bg-blue-500/20"
            trend="+5.2%"
            trendPositive
          />
          <StatCard
            title="Доход ноды"
            value={NODE_STATS.revenue}
            icon={<DollarSign className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
            trend="+12%"
            trendPositive
          />
          <StatCard
            title="2% Комиссия"
            value={NODE_STATS.protocolFee2percent}
            icon={<Crown className="w-6 h-6 text-amber-400" />}
            color="bg-amber-500/20"
            subtitle="Протоколу"
          />
          <StatCard
            title="Uptime"
            value={NODE_STATS.uptime}
            icon={<CheckCircle className="w-6 h-6 text-emerald-400" />}
            color="bg-emerald-500/20"
          />
          <StatCard
            title="API (24ч)"
            value={NODE_STATS.apiRequests24h.toLocaleString()}
            icon={<Key className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
          />
          <StatCard
            title="Сообщений"
            value={NODE_STATS.messagesToday.toLocaleString()}
            icon={<MessageSquare className="w-6 h-6 text-cyan-400" />}
            color="bg-cyan-500/20"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              <span>Быстрый доступ</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {NODE_QUICK_ACTIONS.map((action) => (
              <QuickAction
                key={action.id}
                action={action}
                onClick={() => navigate(action.href)}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Активность ноды</span>
            </h2>
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-white/5 rounded-xl transition-all">
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
            })}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 mt-0.5" />
            <div>
              <h3 className="text-white font-bold mb-2">Ограничения доступа администратора ноды</h3>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• <span className="text-red-400">НЕТ доступа к карте пользователей</span> — только у супер-администратора</li>
                <li>• Используйте свои API ключи ноды для интеграций</li>
                <li>• 2% от дохода ноды автоматически перечисляются протоколу</li>
                <li>• Управление пользователями только вашей ноды</li>
                <li>• Модерация контента только вашей ноды</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeAdminDashboard;
