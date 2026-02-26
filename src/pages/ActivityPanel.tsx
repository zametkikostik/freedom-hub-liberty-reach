import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Activity,
  MessageSquare,
  Users,
  Video,
  Hash,
  Calendar,
  Clock,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  Send,
  Eye,
  ThumbsUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const ACTIVITY_DATA = {
  messages: {
    total: 1847293,
    today: 12450,
    yesterday: 11230,
    trend: '+10.9%',
    hourly: [120, 85, 45, 30, 25, 40, 95, 180, 320, 450, 520, 580, 620, 590, 540, 480, 420, 380, 290, 220, 180, 150, 130, 110],
  },
  rooms: {
    total: 1248,
    active: 892,
    chats: 4520,
    groups: 3180,
    channels: 1890,
    video: 456,
  },
  engagement: {
    dau: 45200,
    mau: 284000,
    retention: '68.5%',
    sessionTime: '24м 30с',
  },
  topRooms: [
    { id: 1, name: 'Crypto Trading', type: 'group', messages: 45200, members: 12500, growth: '+15%' },
    { id: 2, name: 'AI Discussion', type: 'channel', messages: 38900, members: 8900, growth: '+22%' },
    { id: 3, name: 'DeFi Degens', type: 'group', messages: 32100, members: 6700, growth: '+8%' },
    { id: 4, name: 'NFT Marketplace', type: 'channel', messages: 28400, members: 5400, growth: '+12%' },
    { id: 5, name: 'Tech Talk', type: 'group', messages: 24800, members: 4200, growth: '+5%' },
  ],
  weeklyActivity: [
    { day: 'Пн', messages: 8200, users: 3800 },
    { day: 'Вт', messages: 9100, users: 4200 },
    { day: 'Ср', messages: 8800, users: 4100 },
    { day: 'Чт', messages: 9500, users: 4500 },
    { day: 'Пт', messages: 10200, users: 4800 },
    { day: 'Сб', messages: 7200, users: 3500 },
    { day: 'Вс', messages: 6800, users: 3200 },
  ],
  messageTypes: [
    { type: 'Текст', count: 1245000, percentage: 67, color: 'bg-cyan-500' },
    { type: 'Изображения', count: 385000, percentage: 21, color: 'bg-purple-500' },
    { type: 'Видео', count: 129000, percentage: 7, color: 'bg-pink-500' },
    { type: 'Войсы', count: 88293, percentage: 5, color: 'bg-amber-500' },
  ],
};

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
  subtitle?: string;
}> = ({ title, value, icon, color, trend, trendPositive, subtitle }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-white/20 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={cn('p-3 rounded-xl bg-white/10', color)}>{icon}</div>
      {trend && (
        <div className={cn(
          'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold',
          trendPositive ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
        )}>
          {trendPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{trend}</span>
        </div>
      )}
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-white/60 text-sm">{title}</p>
    {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
  </div>
);

const MessagesChart: React.FC = () => {
  const maxMessages = Math.max(...ACTIVITY_DATA.messages.hourly);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Активность сообщений</h3>
          <p className="text-white/60 text-sm">За последние 24 часа</p>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 text-sm font-semibold">{ACTIVITY_DATA.messages.today.toLocaleString()}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end space-x-1 h-48">
        {ACTIVITY_DATA.messages.hourly.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-gradient-to-t from-cyan-500/20 to-cyan-500 rounded-t transition-all hover:from-cyan-400/30 hover:to-cyan-400 group relative"
            style={{ height: `${(value / maxMessages) * 100}%` }}
          >
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-900 px-2 py-1 rounded text-xs font-bold whitespace-nowrap z-10">
              {value} msg
            </div>
          </div>
        ))}
      </div>

      {/* Hours */}
      <div className="flex justify-between mt-2 text-white/40 text-xs">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </div>
  );
};

const WeeklyActivityChart: React.FC = () => {
  const maxMessages = Math.max(...ACTIVITY_DATA.weeklyActivity.map(d => d.messages));

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Недельная активность</h3>
          <p className="text-white/60 text-sm">Сообщения и пользователи</p>
        </div>
        <Calendar className="w-5 h-5 text-purple-400" />
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between space-x-2 h-48">
        {ACTIVITY_DATA.weeklyActivity.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-full flex space-x-1 items-end">
              {/* Messages bar */}
              <div
                className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t transition-all hover:from-cyan-400 hover:to-cyan-300"
                style={{ height: `${(day.messages / maxMessages) * 100}%`, minHeight: '20px' }}
              />
            </div>
            <span className="text-white/60 text-xs font-medium">{day.day}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" />
          <span className="text-white/60 text-xs">Сообщения</span>
        </div>
      </div>
    </div>
  );
};

const MessageTypesChart: React.FC = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Типы сообщений</h3>
        <p className="text-white/60 text-sm">Распределение по типам</p>
      </div>
      <Send className="w-5 h-5 text-pink-400" />
    </div>

    {/* Bars */}
    <div className="space-y-4">
      {ACTIVITY_DATA.messageTypes.map((item) => (
        <div key={item.type}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">{item.type}</span>
            <div className="flex items-center space-x-2">
              <span className="text-white/60 text-xs">{item.count.toLocaleString()}</span>
              <span className="text-white font-bold text-xs w-8 text-right">{item.percentage}%</span>
            </div>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-1000', item.color)}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TopRoomsTable: React.FC = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Топ комнат</h3>
          <p className="text-white/60 text-sm">По активности за неделю</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 text-sm">
          <span>Все комнаты</span>
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">#</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Комната</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Тип</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Сообщения</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Участники</th>
            <th className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-6 py-4">Рост</th>
          </tr>
        </thead>
        <tbody>
          {ACTIVITY_DATA.topRooms.map((room) => (
            <tr key={room.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  {room.id <= 3 ? (
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      room.id === 1 && 'bg-amber-500/20 text-amber-400',
                      room.id === 2 && 'bg-gray-400/20 text-gray-300',
                      room.id === 3 && 'bg-orange-500/20 text-orange-400'
                    )}>
                      {room.id}
                    </div>
                  ) : (
                    <span className="text-white/60 text-sm">{room.id}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  {room.type === 'group' ? (
                    <Users className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Hash className="w-4 h-4 text-purple-400" />
                  )}
                  <span className="text-white font-medium">{room.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  room.type === 'group' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-purple-500/20 text-purple-400'
                )}>
                  {room.type === 'group' ? 'Группа' : 'Канал'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-white/80 font-mono">{room.messages.toLocaleString()}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-white/80 font-mono">{room.members.toLocaleString()}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-green-400 font-semibold text-xs">{room.growth}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const EngagementMetrics: React.FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard
      title="DAU (в день)"
      value={ACTIVITY_DATA.engagement.dau.toLocaleString()}
      icon={<Users className="w-6 h-6 text-blue-400" />}
      color="bg-blue-500/20"
      trend="+12%"
      trendPositive
      subtitle="Уникальных пользователей"
    />
    <StatCard
      title="MAU (в месяц)"
      value={ACTIVITY_DATA.engagement.mau.toLocaleString()}
      icon={<Activity className="w-6 h-6 text-purple-400" />}
      color="bg-purple-500/20"
      trend="+8.5%"
      trendPositive
      subtitle="Активных пользователей"
    />
    <StatCard
      title="Удержание"
      value={ACTIVITY_DATA.engagement.retention}
      icon={<TrendingUp className="w-6 h-6 text-green-400" />}
      color="bg-green-500/20"
      trend="+2.1%"
      trendPositive
      subtitle="7-дневное"
    />
    <StatCard
      title="Время в приложении"
      value={ACTIVITY_DATA.engagement.sessionTime}
      icon={<Clock className="w-6 h-6 text-amber-400" />}
      color="bg-amber-500/20"
      trend="+5м"
      trendPositive
      subtitle="Средняя сессия"
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ActivityPanel: React.FC = () => {
  const navigate = useNavigate();

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
              <Activity className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Активность и Статистика</h1>
              <p className="text-white/60">Мониторинг активности сообщений и комнат</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Всего сообщений"
            value={ACTIVITY_DATA.messages.total.toLocaleString()}
            icon={<MessageSquare className="w-6 h-6 text-cyan-400" />}
            color="bg-cyan-500/20"
            trend={ACTIVITY_DATA.messages.trend}
            trendPositive
            subtitle={`${ACTIVITY_DATA.messages.today.toLocaleString()} сегодня`}
          />
          <StatCard
            title="Активных комнат"
            value={ACTIVITY_DATA.rooms.active.toLocaleString()}
            icon={<Hash className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
            trend="+5.2%"
            trendPositive
            subtitle={`Из ${ACTIVITY_DATA.rooms.total.toLocaleString()} всего`}
          />
          <StatCard
            title="Видео звонков"
            value={ACTIVITY_DATA.rooms.video.toLocaleString()}
            icon={<Video className="w-6 h-6 text-pink-400" />}
            color="bg-pink-500/20"
            trend="+18%"
            trendPositive
            subtitle="За сегодня"
          />
          <StatCard
            title="Всего чатов"
            value={(ACTIVITY_DATA.rooms.chats + ACTIVITY_DATA.rooms.groups + ACTIVITY_DATA.rooms.channels).toLocaleString()}
            icon={<MessageCircle className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
            trend="+3.8%"
            trendPositive
            subtitle="Чаты + Группы + Каналы"
          />
        </div>

        {/* Engagement Metrics */}
        <EngagementMetrics />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MessagesChart />
          <WeeklyActivityChart />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MessageTypesChart />
          
          {/* Rooms Stats */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Статистика комнат</h3>
                <p className="text-white/60 text-sm">Распределение по типам</p>
              </div>
              <Users className="w-5 h-5 text-blue-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span className="text-white/80 text-sm">Группы</span>
                </div>
                <p className="text-2xl font-bold text-white">{ACTIVITY_DATA.rooms.groups.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Hash className="w-5 h-5 text-purple-400" />
                  <span className="text-white/80 text-sm">Каналы</span>
                </div>
                <p className="text-2xl font-bold text-white">{ACTIVITY_DATA.rooms.channels.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-pink-500/10 rounded-xl border border-pink-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-pink-400" />
                  <span className="text-white/80 text-sm">Чаты</span>
                </div>
                <p className="text-2xl font-bold text-white">{ACTIVITY_DATA.rooms.chats.toLocaleString()}</p>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Video className="w-5 h-5 text-amber-400" />
                  <span className="text-white/80 text-sm">Видео</span>
                </div>
                <p className="text-2xl font-bold text-white">{ACTIVITY_DATA.rooms.video.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rooms */}
        <TopRoomsTable />
      </div>
    </div>
  );
};

export default ActivityPanel;
