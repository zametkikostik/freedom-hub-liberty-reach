import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  ChevronLeft,
  Gift,
  Star,
  Zap,
  Infinity,
  Calendar,
  CreditCard,
  Award,
  Shield,
  BadgeCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

interface PremiumUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'active' | 'expired' | 'lifetime' | 'none';
  subscribedAt?: Date;
  expiresAt?: Date;
  type: 'monthly' | 'yearly' | 'lifetime' | 'promo';
  paymentMethod?: 'crypto' | 'card' | 'promo' | 'reward';
}

interface PremiumStats {
  totalUsers: number;
  activeSubscriptions: number;
  lifetimeMembers: number;
  monthlyRevenue: number;
  conversionRate: string;
}

const PREMIUM_USERS: PremiumUser[] = [
  {
    id: 'p1',
    username: '@crypto_queen',
    email: 'queen@crypto.com',
    avatar: 'https://picsum.photos/seed/pu1/100/100',
    status: 'lifetime',
    subscribedAt: new Date(Date.now() - 86400000 * 30),
    type: 'lifetime',
    paymentMethod: 'crypto',
  },
  {
    id: 'p2',
    username: '@neo_matrix',
    email: 'neo@matrix.org',
    avatar: 'https://picsum.photos/seed/pu2/100/100',
    status: 'active',
    subscribedAt: new Date(Date.now() - 86400000 * 15),
    expiresAt: new Date(Date.now() + 86400000 * 15),
    type: 'monthly',
    paymentMethod: 'card',
  },
  {
    id: 'p3',
    username: '@vitalik_fan',
    email: 'vitalik@eth.org',
    avatar: 'https://picsum.photos/seed/pu3/100/100',
    status: 'active',
    subscribedAt: new Date(Date.now() - 86400000 * 300),
    expiresAt: new Date(Date.now() + 86400000 * 65),
    type: 'yearly',
    paymentMethod: 'crypto',
  },
  {
    id: 'p4',
    username: '@alice_crypto',
    email: 'alice@quantum.io',
    avatar: 'https://picsum.photos/seed/pu4/100/100',
    status: 'expired',
    subscribedAt: new Date(Date.now() - 86400000 * 60),
    expiresAt: new Date(Date.now() - 86400000 * 30),
    type: 'monthly',
    paymentMethod: 'card',
  },
  {
    id: 'p5',
    username: '@bob_trader',
    email: 'bob@trading.com',
    avatar: 'https://picsum.photos/seed/pu5/100/100',
    status: 'none',
    type: 'lifetime',
  },
  {
    id: 'p6',
    username: '@emma_defi',
    email: 'emma@defi.io',
    avatar: 'https://picsum.photos/seed/pu6/100/100',
    status: 'lifetime',
    subscribedAt: new Date(Date.now() - 86400000 * 100),
    type: 'lifetime',
    paymentMethod: 'reward',
  },
];

const PREMIUM_PLANS = [
  {
    id: 'monthly',
    name: 'Premium Monthly',
    price: '$4.99',
    duration: '30 дней',
    icon: Calendar,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500/30',
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    price: '$49.99',
    duration: '365 дней',
    icon: Award,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    savings: '17% скидка',
  },
  {
    id: 'lifetime',
    name: 'Premium Lifetime',
    price: '$199.99',
    duration: 'Навсегда',
    icon: Infinity,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    popular: true,
  },
  {
    id: 'promo',
    name: 'Promo Access',
    price: 'Бесплатно',
    duration: '30 дней',
    icon: Gift,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
  },
];

const EARN_METHODS = [
  {
    id: 'referral',
    name: 'Приведи друга',
    reward: '7 дней Premium',
    description: 'За каждого приглашённого пользователя',
    icon: Users,
    color: 'text-cyan-400',
  },
  {
    id: 'content',
    name: 'Создай контент',
    reward: '14 дней Premium',
    description: 'За публикацию популярного материала',
    icon: Star,
    color: 'text-amber-400',
  },
  {
    id: 'bug_bounty',
    name: 'Найди баг',
    reward: '30 дней Premium',
    description: 'За сообщение о критической уязвимости',
    icon: Shield,
    color: 'text-red-400',
  },
  {
    id: 'ambassador',
    name: 'Стань амбассадором',
    reward: 'Lifetime Premium',
    description: 'За активное продвижение платформы',
    icon: Crown,
    color: 'text-purple-400',
    lifetime: true,
  },
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

const PlanCard: React.FC<{
  plan: typeof PREMIUM_PLANS[0];
  onGrant: (planId: string) => void;
}> = ({ plan, onGrant }) => {
  const Icon = plan.icon;

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border transition-all hover:scale-105',
      plan.bgColor,
      plan.borderColor,
      plan.popular && 'ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent'
    )}>
      {plan.popular && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
          Популярный
        </div>
      )}

      <div className="flex items-center space-x-3 mb-4">
        <div className={cn('p-3 rounded-xl bg-white/10', plan.color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">{plan.name}</h3>
          <p className="text-white/60 text-sm">{plan.duration}</p>
        </div>
      </div>

      <p className="text-4xl font-bold text-white mb-4">{plan.price}</p>

      {plan.savings && (
        <div className="mb-4 px-3 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
          <p className="text-green-400 text-xs font-semibold">{plan.savings}</p>
        </div>
      )}

      <button
        onClick={() => onGrant(plan.id)}
        className={cn(
          'w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2',
          plan.popular
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white'
            : 'bg-white/10 hover:bg-white/20 text-white'
        )}
      >
        <Gift className="w-4 h-4" />
        <span>Выдать</span>
      </button>
    </div>
  );
};

const UserRow: React.FC<{
  user: PremiumUser;
  onGrant: (userId: string, type: string) => void;
  onRevoke: (userId: string) => void;
}> = ({ user, onGrant, onRevoke }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusBadge = () => {
    switch (user.status) {
      case 'lifetime':
        return (
          <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Infinity className="w-3 h-3" />
            <span>Lifetime</span>
          </span>
        );
      case 'active':
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
            Активен
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
            Истёк
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-semibold">
            Нет подписки
          </span>
        );
    }
  };

  const getDaysRemaining = () => {
    if (!user.expiresAt) return null;
    const days = Math.round((user.expiresAt.getTime() - Date.now()) / 86400000);
    return days;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className={cn(
      'bg-white/5 border rounded-2xl p-6 backdrop-blur-xl transition-all hover:border-white/20',
      user.status === 'lifetime' && 'border-amber-500/30',
      user.status === 'active' && 'border-green-500/30',
      user.status === 'expired' && 'border-red-500/30',
      user.status === 'none' && 'border-white/10'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img src={user.avatar} alt={user.username} className="w-14 h-14 rounded-full border-2 border-white/20" />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-bold text-lg">{user.username}</h3>
              {user.status === 'lifetime' && <Crown className="w-5 h-5 text-amber-400" />}
            </div>
            <p className="text-white/60 text-sm">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusBadge()}
              {user.paymentMethod && (
                <span className="text-white/40 text-xs flex items-center space-x-1">
                  {user.paymentMethod === 'crypto' && <CreditCard className="w-3 h-3" />}
                  {user.paymentMethod === 'reward' && <Gift className="w-3 h-3" />}
                  <span>{user.paymentMethod === 'crypto' ? 'Crypto' : user.paymentMethod === 'reward' ? 'Награда' : 'Card'}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <Filter className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {user.subscribedAt && (
        <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Начало:</span>
            <span className="text-white">{user.subscribedAt.toLocaleDateString()}</span>
          </div>
          {user.expiresAt && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-white/60">Окончание:</span>
              <span className={cn('font-semibold',
                daysRemaining! > 7 ? 'text-green-400' : daysRemaining! > 0 ? 'text-yellow-400' : 'text-red-400'
              )}>
                {user.expiresAt.toLocaleDateString()} ({daysRemaining! > 0 ? `${daysRemaining} дн.` : 'Истёк'})
              </span>
            </div>
          )}
        </div>
      )}

      {showActions && (
        <div className="flex space-x-3">
          {user.status !== 'lifetime' && user.status !== 'active' && (
            <>
              <button
                onClick={() => onGrant(user.id, 'monthly')}
                className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all text-sm"
              >
                30 дней
              </button>
              <button
                onClick={() => onGrant(user.id, 'yearly')}
                className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all text-sm"
              >
                Год
              </button>
              <button
                onClick={() => onGrant(user.id, 'lifetime')}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-all text-sm"
              >
                ∞
              </button>
            </>
          )}
          {user.status === 'active' || user.status === 'lifetime' ? (
            <button
              onClick={() => onRevoke(user.id)}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Отозвать</span>
            </button>
          ) : (
            <button
              onClick={() => onGrant(user.id, 'promo')}
              className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all text-sm"
            >
              Promo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const EarnMethodCard: React.FC<{
  method: typeof EARN_METHODS[0];
  onGrant: (methodId: string) => void;
}> = ({ method, onGrant }) => {
  const Icon = method.icon;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-white/20 transition-all">
      <div className="flex items-center space-x-3 mb-4">
        <div className={cn('p-3 rounded-xl bg-white/10', method.color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-white font-bold">{method.name}</h3>
          <p className={cn('text-sm font-semibold', method.color)}>{method.reward}</p>
        </div>
      </div>
      <p className="text-white/60 text-sm mb-4">{method.description}</p>
      <button
        onClick={() => onGrant(method.id)}
        className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2"
      >
        <Gift className="w-4 h-4" />
        <span>Выдать награду</span>
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const PremiumPanel: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<PremiumUser[]>(PREMIUM_USERS);
  const [filter, setFilter] = useState<'all' | 'active' | 'lifetime' | 'expired' | 'none'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGrantModal, setShowGrantModal] = useState<{ userId: string; type: string } | null>(null);

  const handleGrant = (userId: string, type: string) => {
    const now = new Date();
    let expiresAt: Date | undefined;
    let status: PremiumUser['status'];

    if (type === 'lifetime') {
      status = 'lifetime';
    } else if (type === 'monthly' || type === 'promo') {
      expiresAt = new Date(now.getTime() + 30 * 86400000);
      status = 'active';
    } else if (type === 'yearly') {
      expiresAt = new Date(now.getTime() + 365 * 86400000);
      status = 'active';
    }

    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      status,
      subscribedAt: now,
      expiresAt,
      type: type as any,
      paymentMethod: 'promo',
    } : u));
    setShowGrantModal(null);
  };

  const handleRevoke = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      status: 'none',
      subscribedAt: undefined,
      expiresAt: undefined,
      type: 'lifetime',
      paymentMethod: undefined,
    } : u));
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats: PremiumStats = {
    totalUsers: users.length,
    activeSubscriptions: users.filter(u => u.status === 'active').length,
    lifetimeMembers: users.filter(u => u.status === 'lifetime').length,
    monthlyRevenue: users.filter(u => u.status === 'active' && u.type === 'monthly').length * 4.99,
    conversionRate: '12.5%',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-pink-500/20 to-amber-500/20 rounded-2xl border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
              <Crown className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Premium Подписка</h1>
              <p className="text-white/60">Управление подписками и выдача Premium</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Всего пользователей"
            value={stats.totalUsers}
            icon={<Users className="w-6 h-6 text-white" />}
            color="text-white"
          />
          <StatCard
            title="Активные подписки"
            value={stats.activeSubscriptions}
            icon={<CheckCircle className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
            trend="+8%"
            trendPositive
          />
          <StatCard
            title="Lifetime участники"
            value={stats.lifetimeMembers}
            icon={<Infinity className="w-6 h-6 text-amber-400" />}
            color="bg-amber-500/20"
          />
          <StatCard
            title="Доход за месяц"
            value={`$${stats.monthlyRevenue.toFixed(0)}`}
            icon={<DollarSign className="w-6 h-6 text-cyan-400" />}
            color="bg-cyan-500/20"
            trend="+15%"
            trendPositive
          />
          <StatCard
            title="Конверсия"
            value={stats.conversionRate}
            icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
          />
        </div>

        {/* Premium Plans */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Crown className="w-5 h-5 text-pink-400" />
            <span>Планы Premium</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PREMIUM_PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onGrant={(planId) => setShowGrantModal({ userId: 'select', type: planId })}
              />
            ))}
          </div>
        </div>

        {/* Earn Premium Methods */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Gift className="w-5 h-5 text-green-400" />
            <span>Получение Premium бесплатно</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EARN_METHODS.map((method) => (
              <EarnMethodCard
                key={method.id}
                method={method}
                onGrant={(methodId) => console.log('Grant reward:', methodId)}
              />
            ))}
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
                placeholder="Поиск по username или email..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/40" />
              {(['all', 'active', 'lifetime', 'expired', 'none'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    filter === status
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  {status === 'all' && 'Все'}
                  {status === 'active' && 'Активные'}
                  {status === 'lifetime' && 'Lifetime'}
                  {status === 'expired' && 'Истёк'}
                  {status === 'none' && 'Нет'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Пользователи ({filteredUsers.length})</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onGrant={(userId, type) => setShowGrantModal({ userId, type })}
                onRevoke={handleRevoke}
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

      {/* Grant Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {showGrantModal.type === 'lifetime' && 'Выдать Lifetime Premium?'}
              {showGrantModal.type === 'monthly' && 'Выдать Premium на 30 дней?'}
              {showGrantModal.type === 'yearly' && 'Выдать Premium на 1 год?'}
              {showGrantModal.type === 'promo' && 'Выдать Promo Premium?'}
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={() => handleGrant(showGrantModal.userId, showGrantModal.type)}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-white font-bold rounded-xl transition-all"
              >
                Подтвердить
              </button>
              <button
                onClick={() => setShowGrantModal(null)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
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

export default PremiumPanel;
