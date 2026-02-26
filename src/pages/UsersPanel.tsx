import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  Mail,
  Shield,
  Crown,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  RefreshCw,
  Calendar,
  DollarSign,
  Activity,
  UserCheck,
  MessageSquare,
  CreditCard,
  BadgeCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'active' | 'banned' | 'pending' | 'verified';
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
  isVerified?: boolean;
  verificationType?: 'creator' | 'admin' | 'partner' | 'premium';
  isPremium?: boolean;
  registeredAt: Date;
  lastSeen: Date;
  messagesCount: number;
  balance: string;
  subscription?: {
    type: 'monthly' | 'yearly' | 'lifetime';
    expiresAt?: Date;
  };
  ip?: string;
  device?: string;
}

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: '@crypto_queen',
    email: 'queen@crypto.com',
    avatar: 'https://picsum.photos/seed/u1/100/100',
    status: 'verified',
    role: 'user',
    isVerified: true,
    verificationType: 'creator',
    isPremium: true,
    registeredAt: new Date(Date.now() - 86400000 * 365),
    lastSeen: new Date(Date.now() - 300000),
    messagesCount: 15420,
    balance: '2.45 ETH',
    subscription: { type: 'lifetime' },
    ip: '192.168.1.100',
    device: 'Chrome / Windows',
  },
  {
    id: 'u2',
    username: '@neo_matrix',
    email: 'neo@matrix.org',
    avatar: 'https://picsum.photos/seed/u2/100/100',
    status: 'active',
    role: 'admin',
    isVerified: true,
    verificationType: 'admin',
    isPremium: true,
    registeredAt: new Date(Date.now() - 86400000 * 300),
    lastSeen: new Date(Date.now() - 60000),
    messagesCount: 8920,
    balance: '1.20 ETH',
    subscription: { type: 'yearly', expiresAt: new Date(Date.now() + 86400000 * 65) },
    ip: '10.0.0.50',
    device: 'Firefox / Linux',
  },
  {
    id: 'u3',
    username: '@vitalik_fan',
    email: 'vitalik@eth.org',
    avatar: 'https://picsum.photos/seed/u3/100/100',
    status: 'active',
    role: 'moderator',
    isVerified: true,
    verificationType: 'partner',
    isPremium: true,
    registeredAt: new Date(Date.now() - 86400000 * 200),
    lastSeen: new Date(Date.now() - 3600000),
    messagesCount: 5630,
    balance: '0.85 ETH',
    subscription: { type: 'yearly', expiresAt: new Date(Date.now() + 86400000 * 165) },
    ip: '172.16.0.25',
    device: 'Safari / macOS',
  },
  {
    id: 'u4',
    username: '@alice_crypto',
    email: 'alice@quantum.io',
    avatar: 'https://picsum.photos/seed/u4/100/100',
    status: 'active',
    role: 'user',
    isVerified: false,
    isPremium: true,
    registeredAt: new Date(Date.now() - 86400000 * 150),
    lastSeen: new Date(Date.now() - 7200000),
    messagesCount: 3240,
    balance: '0.42 ETH',
    subscription: { type: 'monthly', expiresAt: new Date(Date.now() + 86400000 * 15) },
    ip: '192.168.0.15',
    device: 'Chrome / Android',
  },
  {
    id: 'u5',
    username: '@bob_trader',
    email: 'bob@trading.com',
    avatar: 'https://picsum.photos/seed/u5/100/100',
    status: 'banned',
    role: 'user',
    isVerified: false,
    isPremium: false,
    registeredAt: new Date(Date.now() - 86400000 * 100),
    lastSeen: new Date(Date.now() - 86400000 * 30),
    messagesCount: 1250,
    balance: '0.00 ETH',
    banReason: 'Спам и мошенничество',
    bannedUntil: new Date(Date.now() + 86400000 * 60),
    ip: '192.168.2.50',
    device: 'Chrome / Windows',
  },
  {
    id: 'u6',
    username: '@emma_defi',
    email: 'emma@defi.io',
    avatar: 'https://picsum.photos/seed/u6/100/100',
    status: 'pending',
    role: 'user',
    isVerified: false,
    isPremium: false,
    registeredAt: new Date(Date.now() - 86400000 * 50),
    lastSeen: new Date(Date.now() - 86400000),
    messagesCount: 890,
    balance: '0.15 ETH',
    ip: '10.10.10.10',
    device: 'Firefox / macOS',
  },
  {
    id: 'u7',
    username: '@john_doe',
    email: 'john@example.com',
    avatar: 'https://picsum.photos/seed/u7/100/100',
    status: 'active',
    role: 'user',
    isVerified: false,
    isPremium: false,
    registeredAt: new Date(Date.now() - 86400000 * 30),
    lastSeen: new Date(Date.now() - 1800000),
    messagesCount: 450,
    balance: '0.05 ETH',
    ip: '192.168.5.5',
    device: 'Edge / Windows',
  },
  {
    id: 'u8',
    username: '@sarah_dev',
    email: 'sarah@dev.io',
    avatar: 'https://picsum.photos/seed/u8/100/100',
    status: 'verified',
    role: 'super_admin',
    isVerified: true,
    verificationType: 'admin',
    isPremium: true,
    registeredAt: new Date(Date.now() - 86400000 * 500),
    lastSeen: new Date(Date.now() - 10000),
    messagesCount: 25600,
    balance: '5.80 ETH',
    subscription: { type: 'lifetime' },
    ip: '10.0.0.1',
    device: 'VS Code / Linux',
  },
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

const UserRow: React.FC<{
  user: User;
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onVerify: (userId: string) => void;
  onGrantPremium: (userId: string) => void;
  onDelete: (userId: string) => void;
  onResetPassword: (userId: string) => void;
}> = ({ user, onBan, onUnban, onVerify, onGrantPremium, onDelete, onResetPassword }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusBadge = () => {
    switch (user.status) {
      case 'verified':
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Verified</span>
          </span>
        );
      case 'active':
        return (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
            Active
          </span>
        );
      case 'banned':
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
            Banned
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
            Pending
          </span>
        );
    }
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-amber-400" title="Super Admin" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-cyan-400" title="Admin" />;
      case 'moderator':
        return <UserCheck className="w-4 h-4 text-purple-400" title="Moderator" />;
      default:
        return null;
    }
  };

  const getLastSeenText = () => {
    const diff = Date.now() - user.lastSeen.getTime();
    const minutes = Math.round(diff / 60000);
    const hours = Math.round(diff / 3600000);
    const days = Math.round(diff / 86400000);

    if (minutes < 1) return 'Онлайн';
    if (minutes < 60) return `${minutes}м назад`;
    if (hours < 24) return `${hours}ч назад`;
    return `${days}д назад`;
  };

  return (
    <div className={cn(
      'bg-white/5 border rounded-2xl p-6 backdrop-blur-xl transition-all hover:border-white/20',
      user.status === 'banned' && 'border-red-500/30',
      user.status === 'verified' && 'border-green-500/30',
      user.role === 'super_admin' && 'border-amber-500/30'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img src={user.avatar} alt={user.username} className="w-14 h-14 rounded-full border-2 border-white/20" />
            <div className={cn(
              'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900',
              user.lastSeen > new Date(Date.now() - 300000) ? 'bg-green-500' : 'bg-gray-500'
            )} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-bold text-lg">{user.username}</h3>
              {getRoleBadge()}
              {user.isVerified && <VerifiedBadge isVerified verificationType={user.verificationType} size="sm" />}
            </div>
            <p className="text-white/60 text-sm">{user.email}</p>
            <div className="flex items-center space-x-3 mt-2">
              {getStatusBadge()}
              {user.isPremium && (
                <span className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Premium</span>
                </span>
              )}
              <span className="text-white/40 text-xs">{getLastSeenText()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* User Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 text-white/60 text-xs mb-1">
            <Calendar className="w-3 h-3" />
            <span>Дата регистрации</span>
          </div>
          <p className="text-white font-semibold text-sm">{user.registeredAt.toLocaleDateString()}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 text-white/60 text-xs mb-1">
            <MessageSquare className="w-3 h-3" />
            <span>Сообщения</span>
          </div>
          <p className="text-white font-semibold text-sm">{user.messagesCount.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 text-white/60 text-xs mb-1">
            <DollarSign className="w-3 h-3" />
            <span>Баланс</span>
          </div>
          <p className="text-white font-semibold text-sm">{user.balance}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2 text-white/60 text-xs mb-1">
            <Activity className="w-3 h-3" />
            <span>IP адрес</span>
          </div>
          <p className="text-white font-semibold text-sm">{user.ip || 'N/A'}</p>
        </div>
      </div>

      {/* Subscription Info */}
      {user.subscription && (
        <div className="mb-4 p-3 bg-gradient-to-r from-pink-500/10 to-amber-500/10 rounded-xl border border-pink-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-pink-400" />
              <span className="text-white/80 text-sm font-medium">
                {user.subscription.type === 'lifetime' ? 'Lifetime Premium' : 
                 user.subscription.type === 'yearly' ? 'Yearly Premium' : 'Monthly Premium'}
              </span>
            </div>
            {user.subscription.expiresAt && (
              <span className="text-white/60 text-xs">
                До: {user.subscription.expiresAt.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Ban Reason */}
      {user.status === 'banned' && 'banReason' in user && (
        <div className="mb-4 p-3 bg-red-500/10 rounded-xl border border-red-500/30">
          <div className="flex items-center space-x-2 mb-1">
            <Ban className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-xs font-semibold">Причина бана</span>
          </div>
          <p className="text-red-200 text-sm">{(user as any).banReason}</p>
          {'bannedUntil' in user && (
            <p className="text-red-400/60 text-xs mt-1">
              До: {(user as any).bannedUntil.toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {user.status !== 'banned' ? (
            <button
              onClick={() => onBan(user.id)}
              className="py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <Ban className="w-4 h-4" />
              <span>Забанить</span>
            </button>
          ) : (
            <button
              onClick={() => onUnban(user.id)}
              className="py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Разбанить</span>
            </button>
          )}
          
          {!user.isVerified && (
            <button
              onClick={() => onVerify(user.id)}
              className="py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Верифицировать</span>
            </button>
          )}
          
          {!user.isPremium && (
            <button
              onClick={() => onGrantPremium(user.id)}
              className="py-2.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <Crown className="w-4 h-4" />
              <span>Premium</span>
            </button>
          )}
          
          <button
            onClick={() => onResetPassword(user.id)}
            className="py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Сброс пароля</span>
          </button>
          
          {user.role !== 'super_admin' && (
            <button
              onClick={() => onDelete(user.id)}
              className="py-2.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Удалить</span>
            </button>
          )}
          
          <button
            className="py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <Edit className="w-4 h-4" />
            <span>Ред.</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const UsersPanel: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [filter, setFilter] = useState<'all' | 'active' | 'banned' | 'verified' | 'pending'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'messages' | 'balance'>('recent');

  const handleBan = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'banned' as const } : u));
  };

  const handleUnban = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' as const } : u));
  };

  const handleVerify = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { 
      ...u, 
      status: 'verified' as const,
      isVerified: true,
      verificationType: 'admin'
    } : u));
  };

  const handleGrantPremium = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { 
      ...u, 
      isPremium: true,
      subscription: { type: 'lifetime' as const }
    } : u));
  };

  const handleDelete = (userId: string) => {
    if (confirm('Вы уверены? Это действие нельзя отменить.')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleResetPassword = (userId: string) => {
    alert('Пароль сброшен. Письмо отправлено на email пользователя.');
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesRole && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.registeredAt.getTime() - a.registeredAt.getTime();
      case 'oldest':
        return a.registeredAt.getTime() - b.registeredAt.getTime();
      case 'messages':
        return b.messagesCount - a.messagesCount;
      case 'balance':
        return parseFloat(b.balance) - parseFloat(a.balance);
    }
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active' || u.status === 'verified').length,
    banned: users.filter(u => u.status === 'banned').length,
    premium: users.filter(u => u.isPremium).length,
    verified: users.filter(u => u.isVerified).length,
    online: users.filter(u => u.lastSeen > new Date(Date.now() - 300000)).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Пользователи</h1>
              <p className="text-white/60">Управление пользователями платформы</p>
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
            title="Всего"
            value={stats.total}
            icon={<Users className="w-6 h-6 text-white" />}
            color="text-white"
          />
          <StatCard
            title="Активные"
            value={stats.active}
            icon={<CheckCircle className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
          />
          <StatCard
            title="Забанены"
            value={stats.banned}
            icon={<Ban className="w-6 h-6 text-red-400" />}
            color="bg-red-500/20"
          />
          <StatCard
            title="Premium"
            value={stats.premium}
            icon={<Crown className="w-6 h-6 text-pink-400" />}
            color="bg-pink-500/20"
          />
          <StatCard
            title="Verified"
            value={stats.verified}
            icon={<BadgeCheck className="w-6 h-6 text-cyan-400" />}
            color="bg-cyan-500/20"
          />
          <StatCard
            title="Онлайн"
            value={stats.online}
            icon={<Activity className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
            trend="+12%"
            trendPositive
          />
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по username или email..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/40" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="all" className="bg-slate-900">Все статусы</option>
                <option value="active" className="bg-slate-900">Active</option>
                <option value="verified" className="bg-slate-900">Verified</option>
                <option value="banned" className="bg-slate-900">Banned</option>
                <option value="pending" className="bg-slate-900">Pending</option>
              </select>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="all" className="bg-slate-900">Все роли</option>
              <option value="super_admin" className="bg-slate-900">Super Admin</option>
              <option value="admin" className="bg-slate-900">Admin</option>
              <option value="moderator" className="bg-slate-900">Moderator</option>
              <option value="user" className="bg-slate-900">User</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="recent" className="bg-slate-900">Сначала новые</option>
              <option value="oldest" className="bg-slate-900">Сначала старые</option>
              <option value="messages" className="bg-slate-900">По сообщениям</option>
              <option value="balance" className="bg-slate-900">По балансу</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Пользователи ({filteredUsers.length})</span>
            </h2>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Рассылка</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onBan={handleBan}
                onUnban={handleUnban}
                onVerify={handleVerify}
                onGrantPremium={handleGrantPremium}
                onDelete={handleDelete}
                onResetPassword={handleResetPassword}
              />
            ))}
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-white/20" />
            </div>
            <p className="text-white/60">Пользователи не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPanel;
