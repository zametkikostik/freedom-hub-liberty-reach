import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import {
  LayoutDashboard,
  MessageSquare,
  Video,
  Brain,
  Settings,
  LogOut,
  Menu,
  User,
  Mail,
  Shield,
  Users,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Дашборд' },
  { path: '/messenger', icon: MessageSquare, label: 'Мессенджер' },
  { path: '/video', icon: Video, label: 'Видео' },
  { path: '/ai', icon: Brain, label: 'AI-сервисы' },
  { path: '/social', icon: Users, label: 'Social Hub' },
  { path: '/email', icon: Mail, label: 'Почта' },
  { path: '/proxy', icon: Shield, label: 'Proxy' },
  { path: '/settings', icon: Settings, label: 'Настройки' },
];

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-cyber-black cyber-grid-bg">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-72 glass-panel z-50',
          'transform transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-gradient">Freedom Hub</h1>
          <p className="text-xs text-gray-400 mt-1">Децентрализованная платформа</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl',
                  'transition-all duration-200',
                  isActive
                    ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-cyber-gray/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.username || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {profile?.wallet_address
                  ? `${profile.wallet_address.slice(0, 6)}...${profile.wallet_address.slice(-4)}`
                  : 'No wallet'}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            fullWidth
            className="mt-3"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Выйти
          </Button>
        </div>
      </aside>

      <main className="lg:ml-72 min-h-screen">
        <header className="lg:hidden glass-panel sticky top-0 z-30 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/5"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-lg font-bold text-gradient">Freedom Hub</h1>
            <div className="w-10" />
          </div>
        </header>

        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
