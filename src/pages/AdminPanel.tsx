import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Shield,
  DollarSign,
  Globe,
  AlertTriangle,
  TrendingUp,
  Server,
  Users,
  Database,
  RefreshCw,
  Send,
  Power,
  ChevronRight,
  ExternalLink,
  Clock,
  Zap,
  BadgeCheck,
  Sparkles,
  UserCheck,
  Activity,
  Bell,
  Key,
  Brain,
  Scale,
  Map,
  PhoneCall,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const METRICS = {
  totalNodes: 1248,
  nodesTrend: '+12%',
  globalUsers: '2.4M',
  usersTrend: '+8.5%',
  networkVolume: '$4.2M',
  volumeTrend: '+23%',
  protocolRevenue: '$84,000',
  revenueTrend: '+31%',
};

const TOP_NODES = [
  { rank: 1, domain: 'cyber-rebel.net', admin: '@neo', volume: '$120,450', commission: '$2,409', location: '🇩🇪 DE', status: 'active' },
  { rank: 2, domain: 'matrix.org', admin: '@admin', volume: '$85,200', commission: '$1,704', location: '🇬🇧 UK', status: 'active' },
  { rank: 3, domain: 'crypto-bros.eth', admin: '@vitalik', volume: '$50,000', commission: '$1,000', location: '🇺🇸 US', status: 'active' },
  { rank: 4, domain: 'freedom-node.io', admin: '@satoshi', volume: '$42,300', commission: '$846', location: '🇯🇵 JP', status: 'active' },
  { rank: 5, domain: 'quantum-hub.net', admin: '@alice', volume: '$38,900', commission: '$778', location: '🇨🇦 CA', status: 'warning' },
  { rank: 6, domain: 'darkweb-relay.onion', admin: '@anon', volume: '$31,200', commission: '$624', location: '🇳🇱 NL', status: 'active' },
  { rank: 7, domain: 'ai-gateway.tech', admin: '@sam', volume: '$28,700', commission: '$574', location: '🇸🇬 SG', status: 'active' },
  { rank: 8, domain: 'mesh-network.org', admin: '@bob', volume: '$24,100', commission: '$482', location: '🇫🇷 FR', status: 'offline' },
];

const REVENUE_DATA = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 61000 },
  { month: 'Apr', revenue: 58000 },
  { month: 'May', revenue: 67000 },
  { month: 'Jun', revenue: 74000 },
  { month: 'Jul', revenue: 84000 },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const MetricCard: React.FC<{
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  isHighlighted?: boolean;
  trendPositive?: boolean;
}> = ({ title, value, trend, icon, isHighlighted = false, trendPositive = true }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105',
      isHighlighted
        ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/50 shadow-[0_0_30px_rgba(251,191,36,0.15)]'
        : 'bg-white/5 border-white/10 hover:border-white/20'
    )}
  >
    {/* Background Glow */}
    {isHighlighted && (
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
    )}

    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-xl', isHighlighted ? 'bg-amber-500/20' : 'bg-white/10')}>
          {icon}
        </div>
        <div
          className={cn(
            'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold',
            trendPositive
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          )}
        >
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      </div>

      <h3 className="text-white/60 text-sm font-medium mb-1">{title}</h3>
      <p className={cn('text-3xl font-bold', isHighlighted ? 'text-amber-400' : 'text-white')}>
        {value}
      </p>
    </div>
  </div>
);

const RevenueChart: React.FC = () => {
  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.revenue));

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Поступление комиссий</h3>
          <p className="text-white/60 text-sm">Protocol Fee (2%) за последние 7 месяцев</p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-amber-500/20 rounded-xl border border-amber-500/30">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 text-sm font-semibold">Live Sync</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-64">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[100, 75, 50, 25, 0].map((percent) => (
            <div key={percent} className="flex items-center space-x-3">
              <span className="text-white/40 text-xs w-12 text-right">${percent}K</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-around pl-16 pb-8">
          {REVENUE_DATA.map((data) => {
            const height = (data.revenue / maxRevenue) * 100;
            return (
              <div key={data.month} className="flex flex-col items-center space-y-2 group">
                <div className="relative w-12">
                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg transition-all duration-500 group-hover:from-amber-400 group-hover:to-amber-300"
                    style={{ height: `${height * 1.8}px` }}
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-amber-500/30 rounded-t-lg blur-md" />
                  </div>

                  {/* Value Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-900 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                    ${(data.revenue / 1000).toFixed(0)}K
                  </div>
                </div>
                <span className="text-white/60 text-xs font-medium">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sync Status */}
      <div className="mt-6 flex items-center justify-center space-x-2 text-white/40 text-xs">
        <Clock className="w-3 h-3" />
        <span>Синхронизация со смарт-контрактом: 0x7F3A...B9C2</span>
      </div>
    </div>
  );
};

const TopNodesTable: React.FC = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Топ Нод по доходности</h3>
          <p className="text-white/60 text-sm">Рейтинг серверов по объёму комиссии за месяц</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 text-sm">
          <span>Показать все</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Rank</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Node Domain</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Admin</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Location</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Volume (30d)</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Your 2% Cut</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {TOP_NODES.map((node) => (
            <tr
              key={node.domain}
              className="border-b border-white/5 hover:bg-white/5 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  {node.rank <= 3 ? (
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                        node.rank === 1 && 'bg-amber-500/20 text-amber-400',
                        node.rank === 2 && 'bg-gray-400/20 text-gray-300',
                        node.rank === 3 && 'bg-orange-500/20 text-orange-400'
                      )}
                    >
                      {node.rank}
                    </div>
                  ) : (
                    <span className="text-white/60 text-sm">{node.rank}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <Server className="w-4 h-4 text-white/40 group-hover:text-amber-400 transition-colors" />
                  <span className="text-white font-medium">{node.domain}</span>
                  <ExternalLink className="w-3 h-3 text-white/20 hover:text-white/60 cursor-pointer transition-colors" />
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-white/80">{node.admin}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-xl">{node.location}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-white/80 font-mono">{node.volume}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-amber-400 font-bold font-mono">{node.commission}</span>
              </td>
              <td className="px-6 py-4">
                <div
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-semibold w-fit',
                    node.status === 'active' && 'bg-green-500/20 text-green-400',
                    node.status === 'warning' && 'bg-yellow-500/20 text-yellow-400',
                    node.status === 'offline' && 'bg-red-500/20 text-red-400'
                  )}
                >
                  {node.status === 'active' && '● Active'}
                  {node.status === 'warning' && '● Warning'}
                  {node.status === 'offline' && '● Offline'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DangerZone: React.FC = () => {
  const [isConfirming, setIsConfirming] = useState<string | null>(null);

  const handleAction = (action: string) => {
    if (isConfirming === action) {
      // Execute action
      console.log(`Executing: ${action}`);
      setIsConfirming(null);
    } else {
      setIsConfirming(action);
    }
  };

  return (
    <div className="bg-red-500/5 border border-red-500/30 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-red-500/20 rounded-xl">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Protocol Control (Danger Zone)</h3>
          <p className="text-white/60 text-sm">Критические операции управления протоколом</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Update Smart Contract */}
        <button
          onClick={() => handleAction('update')}
          className={cn(
            'relative overflow-hidden p-4 rounded-xl border transition-all duration-300 text-left group',
            isConfirming === 'update'
              ? 'bg-red-500/20 border-red-500/50'
              : 'bg-white/5 border-white/10 hover:border-red-500/30 hover:bg-red-500/10'
          )}
        >
          <div className="flex items-center space-x-3 mb-2">
            <RefreshCw className={cn('w-5 h-5 transition-colors', isConfirming === 'update' ? 'text-red-400' : 'text-white/60 group-hover:text-red-400')} />
            <span className="text-white font-semibold text-sm">Обновить смарт-контракт</span>
          </div>
          <p className="text-white/50 text-xs">
            {isConfirming === 'update' ? 'Вы уверены? Это затронет все ноды.' : 'Deploy новой версии протокола Liberty Reach'}
          </p>
          {isConfirming === 'update' && (
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleAction('update'); }}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded transition-colors"
              >
                Подтвердить
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsConfirming(null); }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded transition-colors"
              >
                Отмена
              </button>
            </div>
          )}
        </button>

        {/* Global Broadcast */}
        <button
          onClick={() => handleAction('broadcast')}
          className={cn(
            'relative overflow-hidden p-4 rounded-xl border transition-all duration-300 text-left group',
            isConfirming === 'broadcast'
              ? 'bg-orange-500/20 border-orange-500/50'
              : 'bg-white/5 border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10'
          )}
        >
          <div className="flex items-center space-x-3 mb-2">
            <Send className={cn('w-5 h-5 transition-colors', isConfirming === 'broadcast' ? 'text-orange-400' : 'text-white/60 group-hover:text-orange-400')} />
            <span className="text-white font-semibold text-sm">Глобальная рассылка</span>
          </div>
          <p className="text-white/50 text-xs">
            {isConfirming === 'broadcast' ? 'Вы уверены? Все админы получат уведомление.' : 'Отправить сообщение всем админам нод (1,248)'}
          </p>
          {isConfirming === 'broadcast' && (
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleAction('broadcast'); }}
                className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded transition-colors"
              >
                Подтвердить
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsConfirming(null); }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded transition-colors"
              >
                Отмена
              </button>
            </div>
          )}
        </button>

        {/* Kill Switch */}
        <button
          onClick={() => handleAction('kill')}
          className={cn(
            'relative overflow-hidden p-4 rounded-xl border transition-all duration-300 text-left group',
            isConfirming === 'kill'
              ? 'bg-red-600/30 border-red-500'
              : 'bg-white/5 border-white/10 hover:border-red-500 hover:bg-red-600/20'
          )}
        >
          <div className="flex items-center space-x-3 mb-2">
            <Power className={cn('w-5 h-5 transition-colors', isConfirming === 'kill' ? 'text-red-400 animate-pulse' : 'text-white/60 group-hover:text-red-400')} />
            <span className="text-white font-semibold text-sm">Kill Switch</span>
          </div>
          <p className="text-white/50 text-xs">
            {isConfirming === 'kill' ? 'ВНИМАНИЕ: Это остановит всю сеть!' : 'Экстренная остановка всех нод протокола'}
          </p>
          {isConfirming === 'kill' && (
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleAction('kill'); }}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors"
              >
                ОСТАНОВИТЬ
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setIsConfirming(null); }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded transition-colors"
              >
                Отмена
              </button>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* ───────── HEADER ───────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-2xl border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Глобальная Админ-панель</h1>
              <p className="text-white/60">Управление протоколом Liberty Reach и смарт-контрактами</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Super Admin Dashboard Button */}
            <button
              onClick={() => navigate('/super-admin')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 rounded-xl transition-all text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
            >
              <Crown className="w-4 h-4" />
              <span className="font-bold">Панель Super Admin</span>
            </button>

            {/* Sync Status */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/60 text-sm">Synced</span>
            </div>

            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white border border-white/10"
              >
                <Activity className="w-4 h-4" />
                <span>Разделы</span>
                <ChevronRight className={cn('w-4 h-4 transition-transform', showMenu && 'rotate-90')} />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <button
                    onClick={() => { navigate('/admin/activity'); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all text-left border-b border-white/10"
                  >
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Activity className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Активность</p>
                      <p className="text-white/40 text-xs">Статистика и диаграммы</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/admin/push'); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all text-left border-b border-white/10"
                  >
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Bell className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Push</p>
                      <p className="text-white/40 text-xs">Уведомления</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/admin/api'); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all text-left border-b border-white/10"
                  >
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Key className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">API</p>
                      <p className="text-white/40 text-xs">Настройки ключей</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/admin/moderator'); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all text-left border-b border-white/10"
                  >
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Brain className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">AI Модератор</p>
                      <p className="text-white/40 text-xs">Модерация контента</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/admin/moderation'); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all text-left"
                  >
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Scale className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Модерация</p>
                      <p className="text-white/40 text-xs">Статистика и апелляции</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/admin/map'); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all text-left"
                  >
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Map className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Карта</p>
                      <p className="text-white/40 text-xs">Мониторинг пользователей</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/admin/sip'); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all text-left"
                  >
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <PhoneCall className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">SIP VoIP</p>
                      <p className="text-white/40 text-xs">Настройки связи</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/admin/users'); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all text-left border-b border-white/10"
                  >
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Пользователи</p>
                      <p className="text-white/40 text-xs">Управление юзерами</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/admin/premium'); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all text-left border-b border-white/10"
                  >
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Premium</p>
                      <p className="text-white/40 text-xs">Подписки и награды</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { navigate('/admin/verification'); setShowMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all text-left"
                  >
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <BadgeCheck className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Верификация</p>
                      <p className="text-white/40 text-xs">Проверка аккаунтов</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 hover:text-white border border-white/10"
            >
              <Shield className="w-4 h-4" />
              <span>Вернуться в Дашборд</span>
            </button>
          </div>
        </div>

        {/* ───────── METRICS ───────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Active Nodes"
            value={METRICS.totalNodes.toLocaleString()}
            trend={METRICS.nodesTrend}
            icon={<Server className="w-6 h-6 text-cyan-400" />}
            trendPositive
          />
          <MetricCard
            title="Global Network Users"
            value={METRICS.globalUsers}
            trend={METRICS.usersTrend}
            icon={<Users className="w-6 h-6 text-purple-400" />}
            trendPositive
          />
          <MetricCard
            title="Total Network Volume"
            value={METRICS.networkVolume}
            trend={METRICS.volumeTrend}
            icon={<Database className="w-6 h-6 text-blue-400" />}
            trendPositive
          />
          <MetricCard
            title="Protocol Revenue (2% Fee)"
            value={METRICS.protocolRevenue}
            trend={METRICS.revenueTrend}
            icon={<DollarSign className="w-6 h-6 text-amber-400" />}
            isHighlighted
            trendPositive
          />
        </div>

        {/* ───────── MAIN CONTENT ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Revenue Chart */}
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>

          {/* Right: Network Stats */}
          <div className="space-y-6">
            {/* Network Distribution */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span>Распределение по регионам</span>
              </h3>
              <div className="space-y-3">
                {[
                  { region: 'Europe', percent: 42, color: 'bg-cyan-500' },
                  { region: 'North America', percent: 28, color: 'bg-purple-500' },
                  { region: 'Asia', percent: 18, color: 'bg-amber-500' },
                  { region: 'Other', percent: 12, color: 'bg-gray-500' },
                ].map((item) => (
                  <div key={item.region}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/60 text-sm">{item.region}</span>
                      <span className="text-white font-semibold text-sm">{item.percent}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-1000', item.color)}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>Super Admin Stats</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Ваша доля</span>
                  <span className="text-white font-bold">2% от всех нод</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Всего собрано</span>
                  <span className="text-amber-400 font-bold">$486,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Средний доход/день</span>
                  <span className="text-green-400 font-bold">$2,800</span>
                </div>
                <div className="pt-4 border-t border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Следующая выплата</span>
                    <span className="text-white font-bold">через 12 дней</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───────── TOP NODES TABLE ───────── */}
        <TopNodesTable />

        {/* ───────── DANGER ZONE ───────── */}
        <DangerZone />

        {/* ───────── FOOTER ───────── */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm mb-2">
            Liberty Reach Protocol v2.4.0 • Smart Contract: 0x7F3A...B9C2
          </p>
          <p className="text-white/30 text-xs">
            © 2025 Freedom Hub. Decentralized Network Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
