import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Wallet, Users, Video, Brain, TrendingUp, Activity, Crown, Shield, BadgeCheck, Sparkles, Server, Globe } from 'lucide-react';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

export const DashboardPage: React.FC = () => {
  const stats = [
    { icon: Wallet, label: 'Баланс', value: '0.00 ETH', color: 'text-cyber-cyan' },
    { icon: Users, label: 'Контакты', value: '0', color: 'text-cyber-purple' },
    { icon: Video, label: 'Видео', value: '0', color: 'text-cyber-pink' },
    { icon: Brain, label: 'AI запросы', value: '0', color: 'text-cyber-green' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Дашборд</h1>
        <p className="text-gray-400">Добро пожаловать в Freedom Hub</p>
      </div>

      {/* Verification Quick Access */}
      <Link to="/admin/verification">
        <div className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
          {/* Background Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-cyan-500/20 rounded-xl border border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                <BadgeCheck className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cyan-400">Верификация аккаунта</h3>
                <p className="text-white/60 text-sm">Подтверди личность и получи галочку</p>
                <div className="flex items-center space-x-2 mt-2">
                  <VerifiedBadge isVerified verificationType="creator" size="sm" />
                  <VerifiedBadge isVerified verificationType="admin" size="sm" />
                  <VerifiedBadge isVerified verificationType="premium" size="sm" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-cyan-400 group-hover:translate-x-2 transition-transform">
              <span className="text-sm font-semibold">Подать заявку</span>
              <BadgeCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>

      {/* Premium Quick Access */}
      <Link to="/admin/premium">
        <div className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-pink-500/10 via-amber-500/10 to-transparent border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
          {/* Background Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-all" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-pink-500/20 rounded-xl border border-pink-500/30 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all">
                <Sparkles className="w-8 h-8 text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-pink-400">Premium Подписка</h3>
                <p className="text-white/60 text-sm">Управление подписками и наградами</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-pink-400/80 text-xs font-mono">30 дней / Год / Lifetime</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-pink-400 group-hover:translate-x-2 transition-transform">
              <span className="text-sm font-semibold">Управлять</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>

      {/* Federation Quick Access */}
      <Link to="https://github.com/freedom-hub/federation" target="_blank">
        <div className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-cyan-500/10 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
          {/* Background Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl group-hover:bg-green-500/30 transition-all" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-green-500/20 rounded-xl border border-green-500/30 group-hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all">
                <Globe className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-400">Запустить свою ноду</h3>
                <p className="text-white/60 text-sm">Децентрализованная федерация Freedom Hub</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-green-400/80 text-xs font-mono">2% комиссия • Docker • Авто-выплаты</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-400 group-hover:translate-x-2 transition-transform">
              <span className="text-sm font-semibold">Узнать больше</span>
              <Server className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>

      {/* Admin Panel Quick Access */}
      <Link to="/admin">
        <div className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
          {/* Background Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-all" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-amber-500/20 rounded-xl border border-amber-500/30 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-400">Админ-панель Liberty Reach</h3>
                <p className="text-white/60 text-sm">Управление протоколом и сбор комиссии 2%</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-white/80 text-xs flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Super Admin Access
                  </span>
                  <span className="text-amber-400/80 text-xs font-mono">1,248 nodes</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-amber-400 group-hover:translate-x-2 transition-transform">
              <span className="text-sm font-semibold">Открыть</span>
              <Crown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} variant="glass" hoverable>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-cyber-gray/50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyber-cyan" />
            Активность
          </h2>
          <div className="text-center py-8 text-gray-400">
            <p>Нет недавней активности</p>
          </div>
        </Card>

        <Card variant="glass">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyber-green" />
            Статистика
          </h2>
          <div className="text-center py-8 text-gray-400">
            <p>Статистика пока пуста</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
