import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map,
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ChevronLeft,
  Eye,
  Download,
  Shield,
  Activity,
  Wifi,
  WifiOff,
  Navigation,
  History,
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink,
  Globe,
  Layers,
  Crosshair,
  UserX,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

interface UserLocation {
  id: string;
  userId: string;
  username: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'moving';
  location: {
    lat: number;
    lng: number;
    accuracy: number;
    address?: string;
  };
  lastSeen: Date;
  device: string;
  ip: string;
  violationHistory?: number;
  isTracked: boolean;
  trackingReason?: string;
}

interface AccessRequest {
  id: string;
  organization: string;
  type: 'law_enforcement' | 'family' | 'emergency';
  userId: string;
  username: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  documents?: string[];
}

const USER_LOCATIONS: UserLocation[] = [
  {
    id: 'ul1',
    userId: 'u123',
    username: '@crypto_trader',
    email: 'trader@crypto.com',
    avatar: 'https://picsum.photos/seed/ul1/100/100',
    status: 'online',
    location: { lat: 55.7558, lng: 37.6173, accuracy: 10, address: 'Москва, Россия' },
    lastSeen: new Date(),
    device: 'iPhone 15 Pro / iOS 17',
    ip: '192.168.1.100',
    violationHistory: 0,
    isTracked: false,
  },
  {
    id: 'ul2',
    userId: 'u456',
    username: '@news_bot',
    email: 'bot@news.io',
    avatar: 'https://picsum.photos/seed/ul2/100/100',
    status: 'moving',
    location: { lat: 59.9343, lng: 30.3351, accuracy: 25, address: 'Санкт-Петербург, Россия' },
    lastSeen: new Date(Date.now() - 60000),
    device: 'Samsung Galaxy S24 / Android 14',
    ip: '10.0.0.50',
    violationHistory: 2,
    isTracked: true,
    trackingReason: 'Нарушение правил сообщества',
  },
  {
    id: 'ul3',
    userId: 'u789',
    username: '@angry_user',
    email: 'angry@mail.com',
    avatar: 'https://picsum.photos/seed/ul3/100/100',
    status: 'offline',
    location: { lat: 55.0084, lng: 82.9357, accuracy: 50, address: 'Новосибирск, Россия' },
    lastSeen: new Date(Date.now() - 3600000),
    device: 'Chrome / Windows 11',
    ip: '172.16.0.25',
    violationHistory: 5,
    isTracked: true,
    trackingReason: 'Множественные нарушения',
  },
  {
    id: 'ul4',
    userId: 'u321',
    username: '@tech_guru',
    email: 'tech@guru.io',
    avatar: 'https://picsum.photos/seed/ul4/100/100',
    status: 'online',
    location: { lat: 56.8389, lng: 60.6057, accuracy: 15, address: 'Екатеринбург, Россия' },
    lastSeen: new Date(Date.now() - 300000),
    device: 'MacBook Pro / macOS',
    ip: '192.168.5.5',
    violationHistory: 0,
    isTracked: false,
  },
  {
    id: 'ul5',
    userId: 'u654',
    username: '@lost_user',
    email: 'lost@example.com',
    avatar: 'https://picsum.photos/seed/ul5/100/100',
    status: 'offline',
    location: { lat: 54.9885, lng: 82.8983, accuracy: 100, address: 'Новосибирская обл.' },
    lastSeen: new Date(Date.now() - 86400000),
    device: 'iPhone 13 / iOS 16',
    ip: '10.10.10.10',
    violationHistory: 0,
    isTracked: false,
  },
];

const ACCESS_REQUESTS: AccessRequest[] = [
  {
    id: 'ar1',
    organization: 'МВД России',
    type: 'law_enforcement',
    userId: 'u789',
    username: '@angry_user',
    reason: 'Запрос в рамках уголовного дела №12345',
    status: 'pending',
    submittedAt: new Date(Date.now() - 7200000),
    documents: ['warrant.pdf', 'request_letter.pdf'],
  },
  {
    id: 'ar2',
    organization: 'Родственники (Иванова М.И.)',
    type: 'family',
    userId: 'u654',
    username: '@lost_user',
    reason: 'Пропал человек, прошу помочь с поиском',
    status: 'pending',
    submittedAt: new Date(Date.now() - 14400000),
    documents: ['missing_person_report.pdf'],
  },
  {
    id: 'ar3',
    organization: 'ФСБ России',
    type: 'law_enforcement',
    userId: 'u456',
    username: '@news_bot',
    reason: 'Запрос в рамках антитеррористического расследования',
    status: 'approved',
    submittedAt: new Date(Date.now() - 172800000),
    documents: ['fsb_warrant.pdf'],
    approvedAt: new Date(Date.now() - 86400000),
    approvedBy: '@super_admin',
  },
];

const MAP_PROVIDERS = [
  { id: 'google', name: 'Google Maps', icon: '🗺️', color: 'text-blue-400', free: false },
  { id: 'yandex', name: 'Яндекс Карты', icon: '🇷🇺', color: 'text-yellow-400', free: false },
  { id: '2gis', name: '2ГИС', icon: '2️⃣', color: 'text-green-400', free: false },
  { id: 'osm', name: 'OpenStreetMap', icon: '🌍', color: 'text-emerald-400', free: true },
  { id: 'leaflet', name: 'Leaflet', icon: '🍃', color: 'text-cyan-400', free: true },
  { id: 'mapbox', name: 'Mapbox', icon: '📍', color: 'text-purple-400', free: false },
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

const MapPlaceholder: React.FC<{
  provider: string;
  locations: UserLocation[];
  selectedUser: string | null;
}> = ({ provider, locations, selectedUser }) => {
  const providerConfig = MAP_PROVIDERS.find(p => p.id === provider);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{providerConfig?.icon}</span>
            <span className="text-white font-semibold">{providerConfig?.name}</span>
            <span className={cn('text-xs px-2 py-1 rounded-full', providerConfig?.free ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400')}>
              {providerConfig?.free ? 'Бесплатно' : 'Платно'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Layers className="w-4 h-4 text-white" />
            </button>
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Crosshair className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mock Map Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Map className="w-24 h-24 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-lg mb-2">Карта {providerConfig?.name}</p>
          <p className="text-white/30 text-sm">
            {locations.length} пользователей отслеживается
          </p>
          <a
            href={
              provider === 'google' ? 'https://www.google.com/maps' :
              provider === 'yandex' ? 'https://yandex.ru/maps' :
              provider === '2gis' ? 'https://2gis.ru' :
              provider === 'osm' ? 'https://www.openstreetmap.org' :
              provider === 'leaflet' ? 'https://leafletjs.com' :
              'https://www.mapbox.com'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 text-sm"
          >
            <span>Открыть в новом окне</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* User Markers */}
      <div className="absolute inset-0">
        {locations.map((user, index) => {
          const isSelected = selectedUser === user.userId;
          const positions = [
            { top: '20%', left: '30%' },
            { top: '40%', left: '60%' },
            { top: '60%', left: '25%' },
            { top: '35%', left: '75%' },
            { top: '70%', left: '50%' },
          ];
          const pos = positions[index % positions.length];

          return (
            <div
              key={user.id}
              className={cn(
                'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer',
                isSelected ? 'scale-125 z-20' : 'scale-100 z-10 hover:scale-110'
              )}
              style={{ top: pos.top, left: pos.left }}
            >
              <div className={cn(
                'relative p-2 rounded-full border-2 transition-all',
                user.status === 'online' && 'bg-green-500 border-green-300',
                user.status === 'offline' && 'bg-gray-500 border-gray-300',
                user.status === 'moving' && 'bg-blue-500 border-blue-300 animate-pulse',
                isSelected && 'ring-4 ring-white/50'
              )}>
                <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                {user.isTracked && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Shield className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-black/80 rounded text-xs text-white whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                {user.username}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10">
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-white/80">Онлайн</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-white/80">Движется</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <span className="text-white/80">Офлайн</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-white/80">Под наблюдением</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserList: React.FC<{
  locations: UserLocation[];
  selectedUser: string | null;
  onSelectUser: (userId: string) => void;
  onTrackUser: (userId: string) => void;
}> = ({ locations, selectedUser, onSelectUser, onTrackUser }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Пользователи</h3>
          <p className="text-white/60 text-sm">Местоположение в реальном времени</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 text-sm">
          <Download className="w-4 h-4" />
          <span>Экспорт</span>
        </button>
      </div>
    </div>

    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
      {locations.map((user) => (
        <div
          key={user.id}
          className={cn(
            'p-4 hover:bg-white/5 transition-all cursor-pointer',
            selectedUser === user.userId && 'bg-white/10'
          )}
          onClick={() => onSelectUser(user.userId)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                <div className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900',
                  user.status === 'online' && 'bg-green-500',
                  user.status === 'offline' && 'bg-gray-500',
                  user.status === 'moving' && 'bg-blue-500 animate-pulse'
                )} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{user.username}</p>
                <p className="text-white/40 text-xs">{user.location.address || 'Адрес не определён'}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={cn(
                'px-2 py-1 rounded-full text-xs font-semibold mb-1',
                user.status === 'online' && 'bg-green-500/20 text-green-400',
                user.status === 'offline' && 'bg-gray-500/20 text-gray-400',
                user.status === 'moving' && 'bg-blue-500/20 text-blue-400'
              )}>
                {user.status === 'online' && 'Онлайн'}
                {user.status === 'offline' && 'Офлайн'}
                {user.status === 'moving' && 'Движется'}
              </div>
              <p className="text-white/40 text-xs">
                {user.lastSeen.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-white/40">
              <span className="flex items-center space-x-1">
                <Navigation className="w-3 h-3" />
                <span>{user.location.lat.toFixed(4)}, {user.location.lng.toFixed(4)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Wifi className="w-3 h-3" />
                <span>±{user.location.accuracy}м</span>
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onTrackUser(user.userId); }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1',
                user.isTracked
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              )}
            >
              {user.isTracked ? (
                <>
                  <Shield className="w-3 h-3" />
                  <span>Следят</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  <span>Следить</span>
                </>
              )}
            </button>
          </div>

          {user.isTracked && user.trackingReason && (
            <div className="mt-3 p-2 bg-red-500/10 rounded-lg border border-red-500/30">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5" />
                <p className="text-red-200 text-xs">{user.trackingReason}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const AccessRequestsTable: React.FC<{
  requests: AccessRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ requests, onApprove, onReject }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Запросы на доступ</h3>
          <p className="text-white/60 text-sm">От правоохранительных органов и родственников</p>
        </div>
        <FileText className="w-5 h-5 text-amber-400" />
      </div>
    </div>

    <div className="divide-y divide-white/5">
      {requests.map((request) => (
        <div key={request.id} className="p-6 hover:bg-white/5 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={cn(
                'p-3 rounded-xl',
                request.type === 'law_enforcement' && 'bg-red-500/20',
                request.type === 'family' && 'bg-blue-500/20',
                request.type === 'emergency' && 'bg-orange-500/20'
              )}>
                {request.type === 'law_enforcement' && <Shield className="w-5 h-5 text-red-400" />}
                {request.type === 'family' && <Users className="w-5 h-5 text-blue-400" />}
                {request.type === 'emergency' && <AlertTriangle className="w-5 h-5 text-orange-400" />}
              </div>
              <div>
                <p className="text-white font-bold">{request.organization}</p>
                <p className="text-white/60 text-sm">Пользователь: {request.username}</p>
                <p className="text-white/40 text-xs mt-1">{request.reason}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-semibold mb-2 block',
                request.status === 'pending' && 'bg-blue-500/20 text-blue-400',
                request.status === 'approved' && 'bg-green-500/20 text-green-400',
                request.status === 'rejected' && 'bg-red-500/20 text-red-400'
              )}>
                {request.status === 'pending' && 'На рассмотрении'}
                {request.status === 'approved' && 'Одобрено'}
                {request.status === 'rejected' && 'Отклонено'}
              </span>
              <p className="text-white/40 text-xs">
                {request.submittedAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          {request.documents && request.documents.length > 0 && (
            <div className="mb-4 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-white/40" />
              <div className="flex space-x-2">
                {request.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="text-white/60 hover:text-white text-xs flex items-center space-x-1"
                  >
                    <span>{doc}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {request.status === 'pending' && (
            <div className="flex space-x-3">
              <button
                onClick={() => onApprove(request.id)}
                className="flex-1 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Одобрить</span>
              </button>
              <button
                onClick={() => onReject(request.id)}
                className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Отклонить</span>
              </button>
            </div>
          )}

          {request.status !== 'pending' && request.approvedBy && (
            <div className="text-white/40 text-xs">
              Рассмотрено: {request.approvedBy} • {request.approvedAt?.toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const UsersMapPanel: React.FC = () => {
  const navigate = useNavigate();
  const [mapProvider, setMapProvider] = useState('osm');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'tracked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [locations, setLocations] = useState<UserLocation[]>(USER_LOCATIONS);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(ACCESS_REQUESTS);

  const handleTrackUser = (userId: string) => {
    setLocations(prev => prev.map(u => {
      if (u.userId === userId) {
        return {
          ...u,
          isTracked: !u.isTracked,
          trackingReason: !u.isTracked ? 'Ручное отслеживание администратором' : undefined,
        };
      }
      return u;
    }));
  };

  const handleApproveRequest = (id: string) => {
    setAccessRequests(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'approved' as const,
      approvedAt: new Date(),
      approvedBy: '@super_admin',
    } : r));
  };

  const handleRejectRequest = (id: string) => {
    setAccessRequests(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'rejected' as const,
    } : r));
  };

  const filteredLocations = locations.filter(user => {
    if (filter === 'online' && user.status !== 'online') return false;
    if (filter === 'offline' && user.status !== 'offline') return false;
    if (filter === 'tracked' && !user.isTracked) return false;
    if (searchQuery && !user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: locations.length,
    online: locations.filter(u => u.status === 'online').length,
    tracked: locations.filter(u => u.isTracked).length,
    requests: accessRequests.filter(r => r.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-2xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <Map className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Карта пользователей</h1>
              <p className="text-white/60 text-sm">Мониторинг местоположения в реальном времени</p>
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

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <Shield className="w-6 h-6 text-red-400 mt-0.5" />
            <div>
              <h3 className="text-white font-bold mb-2">Конфиденциальность данных</h3>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Карта видна только супер-администратору</li>
                <li>• Ноды федерации не имеют доступа к геолокации</li>
                <li>• Данные передаются по зашифрованному соединению</li>
                <li>• Запросы от правоохранительных органов требуют официальных документов</li>
                <li>• История перемещений хранится 30 дней</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            title="Всего пользователей"
            value={stats.total}
            icon={<Users className="w-6 h-6 text-blue-400" />}
            color="bg-blue-500/20"
          />
          <StatCard
            title="Онлайн"
            value={stats.online}
            icon={<Wifi className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
          />
          <StatCard
            title="Под наблюдением"
            value={stats.tracked}
            icon={<Shield className="w-6 h-6 text-red-400" />}
            color="bg-red-500/20"
          />
          <StatCard
            title="Запросов на доступ"
            value={stats.requests}
            icon={<FileText className="w-6 h-6 text-amber-400" />}
            color="bg-amber-500/20"
            trend={stats.requests > 0 ? 'Требуют внимания' : undefined}
            trendPositive={false}
          />
        </div>

        {/* Map Provider Selection */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Провайдер карт</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {MAP_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setMapProvider(provider.id)}
                className={cn(
                  'p-4 rounded-xl border transition-all text-center',
                  mapProvider === provider.id
                    ? cn(provider.color === 'text-blue-400' ? 'bg-blue-500/20 border-blue-500/50' :
                       provider.color === 'text-yellow-400' ? 'bg-yellow-500/20 border-yellow-500/50' :
                       provider.color === 'text-green-400' ? 'bg-green-500/20 border-green-500/50' :
                       provider.color === 'text-emerald-400' ? 'bg-emerald-500/20 border-emerald-500/50' :
                       provider.color === 'text-cyan-400' ? 'bg-cyan-500/20 border-cyan-500/50' :
                       'bg-purple-500/20 border-purple-500/50')
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                )}
              >
                <span className="text-3xl mb-2 block">{provider.icon}</span>
                <p className={cn('text-sm font-semibold', mapProvider === provider.id ? 'text-white' : 'text-white/80')}>
                  {provider.name}
                </p>
                <p className={cn('text-xs mt-1', provider.free ? 'text-green-400' : 'text-amber-400')}>
                  {provider.free ? 'Бесплатно' : 'Платно'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Map & User List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapPlaceholder
              provider={mapProvider}
              locations={filteredLocations}
              selectedUser={selectedUser}
            />
          </div>
          <div>
            <UserList
              locations={filteredLocations}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              onTrackUser={handleTrackUser}
            />
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
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/40" />
              {(['all', 'online', 'offline', 'tracked'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    filter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  {status === 'all' && 'Все'}
                  {status === 'online' && 'Онлайн'}
                  {status === 'offline' && 'Офлайн'}
                  {status === 'tracked' && 'Следят'}
                </button>
              ))}
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80">
              <History className="w-4 h-4" />
              <span>История</span>
            </button>
          </div>
        </div>

        {/* Access Requests */}
        <AccessRequestsTable
          requests={accessRequests}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      </div>
    </div>
  );
};

export default UsersMapPanel;
