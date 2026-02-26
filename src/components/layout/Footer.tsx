import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Globe,
  Lock,
  Activity,
  Users,
  Server,
  MessageSquare,
  Video,
  Brain,
  Settings,
  Heart,
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Eye,
  MousePointerClick,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS TRACKER
// ─────────────────────────────────────────────────────────────────────────────

interface AnalyticsEvent {
  event: string;
  timestamp: string;
  page: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
}

const trackAnalytics = (eventName: string, additionalData?: Record<string, any>) => {
  const eventData: AnalyticsEvent = {
    event: eventName,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    referrer: document.referrer || undefined,
    utm_source: getQueryParam('utm_source'),
    utm_medium: getQueryParam('utm_medium'),
    utm_campaign: getQueryParam('utm_campaign'),
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...additionalData,
  };

  // Save to localStorage for later sync
  const events = JSON.parse(localStorage.getItem('freedom_analytics') || '[]');
  events.push(eventData);
  localStorage.setItem('freedom_analytics', JSON.stringify(events.slice(-100))); // Keep last 100

  // In production, send to analytics server
  if (import.meta.env.PROD) {
    // TODO: Send to analytics endpoint
    console.log('[Analytics]', eventData);
  }
};

const getQueryParam = (param: string): string | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || undefined;
};

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER STATISTICS
// ─────────────────────────────────────────────────────────────────────────────

interface FooterStats {
  users: number;
  nodes: number;
  messages: number;
  uptime: string;
}

const useFooterStats = (): FooterStats => {
  const [stats, setStats] = useState<FooterStats>({
    users: 284000,
    nodes: 1248,
    messages: 15847293,
    uptime: '99.97%',
  });

  useEffect(() => {
    // Update stats every 30 seconds
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        users: prev.users + Math.floor(Math.random() * 10),
        messages: prev.messages + Math.floor(Math.random() * 100),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return stats;
};

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface FooterProps {
  className?: string;
  showStats?: boolean;
  showTracking?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  className,
  showStats = true,
  showTracking = true,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const stats = useFooterStats();
  const [showTracker, setShowTracker] = useState(showTracking);

  // Track page view
  useEffect(() => {
    if (showTracker) {
      trackAnalytics('page_view', {
        language: i18n.language,
      });
    }
  }, [i18n.language, showTracker]);

  const handleNavClick = (path: string, label: string) => {
    if (showTracker) {
      trackAnalytics('footer_navigation', {
        target: path,
        label,
      });
    }
    navigate(path);
  };

  const handleExternalLink = (url: string, label: string) => {
    if (showTracker) {
      trackAnalytics('external_link', {
        url,
        label,
      });
    }
    window.open(url, '_blank');
  };

  return (
    <footer className={cn('bg-gradient-to-br from-slate-950 via-slate-900 to-black border-t border-white/10', className)}>
      {/* Live Stats Bar */}
      {showStats && (
        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between overflow-x-auto">
              <div className="flex items-center space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white/60">Live</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3 text-blue-400" />
                  <span className="text-white/80 font-mono">{stats.users.toLocaleString()}</span>
                  <span className="text-white/40">пользователей</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Server className="w-3 h-3 text-purple-400" />
                  <span className="text-white/80 font-mono">{stats.nodes.toLocaleString()}</span>
                  <span className="text-white/40">нод</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-3 h-3 text-cyan-400" />
                  <span className="text-white/80 font-mono">{stats.messages.toLocaleString()}</span>
                  <span className="text-white/40">сообщений</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 font-mono">{stats.uptime}</span>
                  <span className="text-white/40">uptime</span>
                </div>
              </div>

              {/* Tracker Toggle */}
              {showTracking && (
                <button
                  onClick={() => setShowTracker(!showTracker)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-xs text-white/60"
                  title="Toggle analytics tracking"
                >
                  <Eye className="w-3 h-3" />
                  <span>Tracker: {showTracker ? 'ON' : 'OFF'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-xl font-bold text-white">Freedom Hub</span>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Децентрализованная платформа для свободного общения, доступа к AI-сервисам и Web3 контенту
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleExternalLink('https://github.com/freedom-hub', 'GitHub')}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
              >
                <Globe className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleExternalLink('https://twitter.com/freedomhub', 'Twitter')}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
              >
                <Star className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleExternalLink('https://discord.gg/freedomhub', 'Discord')}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Платформа</h3>
            <ul className="space-y-2">
              {[
                { path: '/messenger', label: 'Мессенджер', icon: MessageSquare },
                { path: '/video', label: 'Видео', icon: Video },
                { path: '/ai', label: 'AI Hub', icon: Brain },
                { path: '/settings', label: 'Настройки', icon: Settings },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavClick(item.path, item.label)}
                    className="flex items-center space-x-2 text-white/60 hover:text-white transition-all text-sm group"
                  >
                    <item.icon className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                    <span>{item.label}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ресурсы</h3>
            <ul className="space-y-2">
              {[
                { url: 'https://docs.freedom-hub.app', label: 'Документация', icon: ExternalLink },
                { url: 'https://github.com/freedom-hub/federation', label: 'Запустить ноду', icon: Server },
                { url: '/admin', label: 'Админ-панель', icon: Shield },
                { url: 'https://status.freedom-hub.app', label: 'Статус', icon: Activity },
              ].map((item) => (
                <li key={item.url}>
                  <button
                    onClick={() => handleExternalLink(item.url, item.label)}
                    className="flex items-center space-x-2 text-white/60 hover:text-white transition-all text-sm group"
                  >
                    <item.icon className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Информация</h3>
            <ul className="space-y-2">
              {[
                { url: '/privacy', label: t('footer.privacy'), icon: Lock },
                { url: '/terms', label: t('footer.terms'), icon: Shield },
                { url: '/contact', label: t('footer.contact'), icon: MessageSquare },
              ].map((item) => (
                <li key={item.url}>
                  <button
                    onClick={() => handleNavClick(item.url, item.label)}
                    className="flex items-center space-x-2 text-white/60 hover:text-white transition-all text-sm group"
                  >
                    <item.icon className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-xs text-white/40">
              <span>© 2025 Freedom Hub</span>
              <span>•</span>
              <span>{t('footer.rights')}</span>
            </div>

            {/* Traffic Sources Tracker */}
            {showTracking && (
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-white/60">Source:</span>
                  <span className="text-white font-mono">
                    {getQueryParam('utm_source') || 'direct'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg">
                  <MousePointerClick className="w-3 h-3 text-blue-400" />
                  <span className="text-white/60">Medium:</span>
                  <span className="text-white font-mono">
                    {getQueryParam('utm_medium') || 'none'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
