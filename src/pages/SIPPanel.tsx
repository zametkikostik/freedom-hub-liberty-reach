import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Settings,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  Server,
  User,
  Key,
  Globe,
  PhoneIncoming,
  PhoneOutgoing,
  MessageSquare,
  Wifi,
  WifiOff,
  Activity,
  Shield,
  Lock,
  Volume2,
  Mic,
  Headphones,
  Database,
  Cloud,
  PhoneCall,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

interface SIPConfig {
  provider: string;
  server: string;
  port: number;
  username: string;
  password: string;
  displayName: string;
  transport: 'udp' | 'tcp' | 'tls';
  registerExpires: number;
  dtmfMode: 'rfc2833' | 'info' | 'inband';
  codecPriority: string[];
}

interface SIPStatus {
  registered: boolean;
  provider: string;
  expires: number;
  lastRegistered?: Date;
  activeCalls: number;
  messagesReceived: number;
}

const SIP_PROVIDERS = [
  { id: 'twilio', name: 'Twilio', url: 'https://www.twilio.com', icon: '📞', color: 'text-red-400' },
  { id: 'vonage', name: 'Vonage (Nexmo)', url: 'https://vonage.com', icon: '🌐', color: 'text-blue-400' },
  { id: 'plivo', name: 'Plivo', url: 'https://www.plivo.com', icon: '📱', color: 'text-indigo-400' },
  { id: 'bandwidth', name: 'Bandwidth', url: 'https://www.bandwidth.com', icon: '📡', color: 'text-orange-400' },
  { id: 'telnyx', name: 'Telnyx', url: 'https://telnyx.com', icon: '🔷', color: 'text-cyan-400' },
  { id: 'sipnet', name: 'Sipnet (RU)', url: 'https://www.sipnet.ru', icon: '🇷🇺', color: 'text-green-400' },
  { id: 'mnk', name: 'МНК (RU)', url: 'https://mnk.ru', icon: '☎️', color: 'text-purple-400' },
  { id: 'custom', name: 'Другой провайдер', url: '', icon: '⚙️', color: 'text-gray-400' },
];

const DEFAULT_CODECS = ['G.711a', 'G.711u', 'G.729', 'G.722', 'Opus'];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
    <div className="flex items-center justify-between mb-4">
      <div className={cn('p-3 rounded-xl bg-white/10', color)}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-white/60 text-sm">{title}</p>
    {subtitle && <p className="text-white/40 text-xs mt-1">{subtitle}</p>}
  </div>
);

const ProviderCard: React.FC<{
  provider: typeof SIP_PROVIDERS[0];
  selected: boolean;
  onSelect: () => void;
}> = ({ provider, selected, onSelect }) => (
  <button
    onClick={onSelect}
    className={cn(
      'p-4 rounded-xl border transition-all text-left',
      selected
        ? 'bg-cyan-500/20 border-cyan-500/50'
        : 'bg-white/5 border-white/10 hover:border-white/20'
    )}
  >
    <div className="flex items-center space-x-3">
      <span className="text-3xl">{provider.icon}</span>
      <div>
        <p className={cn('text-sm font-semibold', selected ? 'text-white' : 'text-white/80')}>
          {provider.name}
        </p>
        {provider.url && (
          <a
            href={provider.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 text-xs hover:text-white/60 flex items-center space-x-1"
          >
            <span>Сайт</span>
            <Globe className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const SIPPanel: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState('twilio');
  const [config, setConfig] = useState<SIPConfig>({
    provider: 'twilio',
    server: 'sip.twilio.com',
    port: 5060,
    username: '',
    password: '',
    displayName: 'Freedom Hub',
    transport: 'udp',
    registerExpires: 3600,
    dtmfMode: 'rfc2833',
    codecPriority: DEFAULT_CODECS,
  });
  const [status, setStatus] = useState<SIPStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    // Имитация теста подключения
    setTimeout(() => {
      setStatus({
        registered: true,
        provider: SIP_PROVIDERS.find(p => p.id === selectedProvider)?.name || '',
        expires: 3600,
        lastRegistered: new Date(),
        activeCalls: 0,
        messagesReceived: 0,
      });
      setTesting(false);
    }, 2000);
  };

  const handleSave = () => {
    // Сохранение конфигурации
    alert('Конфигурация SIP сохранена!');
  };

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
              <PhoneCall className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">SIP VoIP Настройки</h1>
              <p className="text-white/60">Интеграция с облачными операторами связи</p>
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

        {/* Status Banner */}
        {status ? (
          <div className={cn(
            'p-6 rounded-2xl border backdrop-blur-xl',
            status.registered
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  'p-3 rounded-xl',
                  status.registered ? 'bg-green-500/20' : 'bg-red-500/20'
                )}>
                  {status.registered ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div>
                  <p className={cn('font-bold text-lg', status.registered ? 'text-green-400' : 'text-red-400')}>
                    {status.registered ? 'Зарегистрировано' : 'Не зарегистрировано'}
                  </p>
                  <p className="text-white/60 text-sm">
                    {status.provider} • Истекает через {status.expires}с
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <PhoneCall className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <p className="text-white font-bold">{status.activeCalls}</p>
                  <p className="text-white/40 text-xs">Активные звонки</p>
                </div>
                <div className="text-center">
                  <MessageSquare className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <p className="text-white font-bold">{status.messagesReceived}</p>
                  <p className="text-white/40 text-xs">SMS получено</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl backdrop-blur-xl">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 mt-0.5" />
              <div>
                <h3 className="text-white font-bold mb-2">SIP не настроен</h3>
                <p className="text-white/60 text-sm mb-4">
                  Настройте SIP подключение для приёма входящих звонков и SMS от облачных операторов связи
                </p>
                <ul className="text-white/40 text-xs space-y-1">
                  <li>• Поддержка Twilio, Vonage, Plivo, Bandwidth, Telnyx и других</li>
                  <li>• Приём входящих звонков на виртуальные номера</li>
                  <li>• Получение SMS для верификации</li>
                  <li>• Исходящие звонки через SIP</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            title="SIP Провайдер"
            value={status?.provider || 'Не подключен'}
            icon={<Cloud className="w-6 h-6 text-cyan-400" />}
            color="bg-cyan-500/20"
            subtitle={status ? 'Подключен' : 'Отключен'}
          />
          <StatCard
            title="Активные звонки"
            value={status?.activeCalls || 0}
            icon={<PhoneCall className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
          />
          <StatCard
            title="SMS получено"
            value={status?.messagesReceived || 0}
            icon={<MessageSquare className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
          />
          <StatCard
            title="Статус"
            value={status?.registered ? 'OK' : '---'}
            icon={status?.registered ? <Wifi className="w-6 h-6 text-green-400" /> : <WifiOff className="w-6 h-6 text-red-400" />}
            color={status?.registered ? 'bg-green-500/20' : 'bg-red-500/20'}
          />
        </div>

        {/* Provider Selection */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Выберите SIP провайдера</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SIP_PROVIDERS.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                selected={selectedProvider === provider.id}
                onSelect={() => setSelectedProvider(provider.id)}
              />
            ))}
          </div>
        </div>

        {/* SIP Configuration */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Настройки SIP</h2>
            </div>
            <button
              onClick={handleTestConnection}
              disabled={testing || !config.username || !config.password}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all text-cyan-400 border border-cyan-500/30"
            >
              {testing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <PhoneIncoming className="w-4 h-4" />
              )}
              <span>{testing ? 'Тест...' : 'Тест подключения'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Server Settings */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Сервер</span>
              </h3>

              <div>
                <label className="text-white/60 text-sm mb-2 block">SIP Сервер</label>
                <input
                  type="text"
                  value={config.server}
                  onChange={(e) => setConfig(prev => ({ ...prev, server: e.target.value }))}
                  placeholder="sip.provider.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 font-mono"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">Порт</label>
                <input
                  type="number"
                  value={config.port}
                  onChange={(e) => setConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 font-mono"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">Транспорт</label>
                <select
                  value={config.transport}
                  onChange={(e) => setConfig(prev => ({ ...prev, transport: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="udp">UDP</option>
                  <option value="tcp">TCP</option>
                  <option value="tls">TLS (защищено)</option>
                </select>
              </div>
            </div>

            {/* Authentication */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Аутентификация</span>
              </h3>

              <div>
                <label className="text-white/60 text-sm mb-2 block">SIP Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={config.username}
                    onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="username"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">SIP Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={config.password}
                    onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 font-mono"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
                  >
                    {showPassword ? <XCircle className="w-4 h-4 text-white/40" /> : <Eye className="w-4 h-4 text-white/40" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">Display Name</label>
                <input
                  type="text"
                  value={config.displayName}
                  onChange={(e) => setConfig(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Freedom Hub"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Дополнительные настройки</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Register Expires (сек)</label>
                <input
                  type="number"
                  value={config.registerExpires}
                  onChange={(e) => setConfig(prev => ({ ...prev, registerExpires: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">DTMF Mode</label>
                <select
                  value={config.dtmfMode}
                  onChange={(e) => setConfig(prev => ({ ...prev, dtmfMode: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="rfc2833">RFC 2833</option>
                  <option value="info">SIP INFO</option>
                  <option value="inband">In-Band</option>
                </select>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">Codecs</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_CODECS.map((codec) => (
                    <span
                      key={codec}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/10"
                    >
                      {codec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold rounded-xl transition-all"
            >
              <Save className="w-5 h-5" />
              <span>Сохранить конфигурацию</span>
            </button>
          </div>
        </div>

        {/* Info Block */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <Database className="w-6 h-6 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-white font-bold mb-2">Поддерживаемые провайдеры</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/60">
                <div>
                  <p className="font-semibold text-white">Международные:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Twilio</li>
                    <li>• Vonage (Nexmo)</li>
                    <li>• Plivo</li>
                    <li>• Bandwidth</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white">Европа:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Telnyx</li>
                    <li>• Sipgate</li>
                    <li>• VoIPfone</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white">Россия:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Sipnet</li>
                    <li>• МНК</li>
                    <li>• Задрот.тел</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white">Возможности:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Приём звонков</li>
                    <li>• Получение SMS</li>
                    <li>• Исходящие звонки</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon component
const Eye: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default SIPPanel;
