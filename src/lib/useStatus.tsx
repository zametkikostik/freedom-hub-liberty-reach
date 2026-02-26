import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type UserStatus = 'online' | 'offline' | 'busy' | 'away' | 'dnd' | 'invisible';

export interface StatusConfig {
  id: UserStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  autoExpire?: number; // ms до авто-смены на offline
}

export interface UserStatusData {
  userId: string;
  status: UserStatus;
  customMessage?: string;
  expiresAt?: Date;
  lastSeen: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

// SVG Icons as React components
const OnlineIcon = () => (
  <svg viewBox="0 0 8 8" className="w-2 h-2">
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
);

const BusyIcon = () => (
  <svg viewBox="0 0 8 8" className="w-2 h-2">
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
);

const AwayIcon = () => (
  <svg viewBox="0 0 8 8" className="w-2 h-2">
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
);

const DndIcon = () => (
  <svg viewBox="0 0 8 8" className="w-2 h-2">
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
);

const InvisibleIcon = () => (
  <svg viewBox="0 0 8 8" className="w-2 h-2">
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
);

const OfflineIcon = () => (
  <svg viewBox="0 0 8 8" className="w-2 h-2">
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
);

export const STATUS_CONFIGS: Record<UserStatus, Omit<StatusConfig, 'icon'> & { icon: React.FC }> = {
  online: {
    id: 'online',
    label: 'Онлайн',
    icon: OnlineIcon,
    color: 'text-green-400',
    bgColor: 'bg-green-500',
    borderColor: 'border-green-500/30',
  },
  busy: {
    id: 'busy',
    label: 'Занят',
    icon: BusyIcon,
    color: 'text-red-400',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-500/30',
    autoExpire: 7200000, // 2 часа
  },
  away: {
    id: 'away',
    label: 'Отошёл',
    icon: AwayIcon,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-500/30',
    autoExpire: 1800000, // 30 минут
  },
  dnd: {
    id: 'dnd',
    label: 'Не беспокоить',
    icon: DndIcon,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500',
    borderColor: 'border-purple-500/30',
  },
  invisible: {
    id: 'invisible',
    label: 'Невидимка',
    icon: InvisibleIcon,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500',
    borderColor: 'border-gray-500/30',
  },
  offline: {
    id: 'offline',
    label: 'Офлайн',
    icon: OfflineIcon,
    color: 'text-gray-500',
    bgColor: 'bg-gray-600',
    borderColor: 'border-gray-600/30',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

interface StatusContextType {
  myStatus: UserStatusData | null;
  usersStatus: Map<string, UserStatusData>;
  setMyStatus: (status: UserStatus, customMessage?: string, duration?: number) => void;
  getUserStatus: (userId: string) => UserStatusData | undefined;
  isOnline: (userId: string) => boolean;
  getStatusColor: (status: UserStatus) => string;
}

const StatusContext = createContext<StatusContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myStatus, setMyStatusData] = useState<UserStatusData | null>(null);
  const [usersStatus, setUsersStatus] = useState<Map<string, UserStatusData>>(new Map());

  // Инициализация статуса
  useEffect(() => {
    const savedStatus = localStorage.getItem('user_status');
    if (savedStatus) {
      try {
        const parsed = JSON.parse(savedStatus);
        setMyStatusData({
          ...parsed,
          expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : undefined,
          lastSeen: new Date(parsed.lastSeen),
        });
      } catch (e) {
        console.error('Failed to parse saved status:', e);
      }
    } else {
      // Default: online
      setMyStatusData({
        userId: 'me',
        status: 'online',
        lastSeen: new Date(),
      });
    }

    // Mock: загрузка статусов других пользователей
    const mockUsers: UserStatusData[] = [
      { userId: 'u1', status: 'online', lastSeen: new Date() },
      { userId: 'u2', status: 'busy', customMessage: 'В дедлайне', lastSeen: new Date() },
      { userId: 'u3', status: 'away', lastSeen: new Date(Date.now() - 900000) },
      { userId: 'u4', status: 'offline', lastSeen: new Date(Date.now() - 3600000) },
      { userId: 'u5', status: 'dnd', customMessage: 'До 18:00', expiresAt: new Date(Date.now() + 7200000), lastSeen: new Date() },
    ];

    const statusMap = new Map(mockUsers.map(u => [u.userId, u]));
    setUsersStatus(statusMap);

    // Auto-expire статусов
    const interval = setInterval(() => {
      const now = Date.now();
      setUsersStatus(prev => {
        const updated = new Map(prev);
        updated.forEach((data, userId) => {
          if (data.expiresAt && data.expiresAt.getTime() < now) {
            updated.set(userId, { ...data, status: 'offline', expiresAt: undefined });
          }
        });
        return updated;
      });
    }, 60000); // Проверка каждую минуту

    return () => clearInterval(interval);
  }, []);

  // Сохранение статуса
  useEffect(() => {
    if (myStatus) {
      localStorage.setItem('user_status', JSON.stringify(myStatus));
    }
  }, [myStatus]);

  const setMyStatus = useCallback((status: UserStatus, customMessage?: string, duration?: number) => {
    const config = STATUS_CONFIGS[status];
    const expiresAt = duration ? new Date(Date.now() + duration) : config.autoExpire ? new Date(Date.now() + config.autoExpire) : undefined;

    const newStatus: UserStatusData = {
      userId: 'me',
      status,
      customMessage,
      expiresAt,
      lastSeen: new Date(),
    };

    setMyStatusData(newStatus);
  }, []);

  const getUserStatus = useCallback((userId: string) => {
    return usersStatus.get(userId);
  }, [usersStatus]);

  const isOnline = useCallback((userId: string) => {
    const status = usersStatus.get(userId);
    return status?.status === 'online' || status?.status === 'busy' || status?.status === 'dnd';
  }, [usersStatus]);

  const getStatusColor = useCallback((status: UserStatus) => {
    return STATUS_CONFIGS[status].color;
  }, []);

  return (
    <StatusContext.Provider
      value={{
        myStatus,
        usersStatus,
        setMyStatus,
        getUserStatus,
        isOnline,
        getStatusColor,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export const useStatus = () => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error('useStatus must be used within StatusProvider');
  }
  return context;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

interface StatusIndicatorProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const config = STATUS_CONFIGS[status];
  const sizeClasses = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <span className={cn('inline-flex items-center', className)}>
      <span
        className={cn(
          'rounded-full',
          config.bgColor,
          sizeClasses[size],
          status === 'online' && 'animate-pulse'
        )}
        title={config.label}
      />
      {showLabel && (
        <span className={cn('ml-2 text-xs font-medium', config.color)}>
          {config.label}
        </span>
      )}
    </span>
  );
};

interface StatusAvatarProps {
  avatarUrl: string;
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
  className?: string;
}

export const StatusAvatar: React.FC<StatusAvatarProps> = ({
  avatarUrl,
  status,
  size = 'md',
  showBorder = true,
  className,
}) => {
  const config = STATUS_CONFIGS[status];
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  const indicatorSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <img
        src={avatarUrl}
        alt="Avatar"
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          showBorder && 'border-2 border-gray-900'
        )}
      />
      <span
        className={cn(
          'absolute bottom-0 right-0 rounded-full border-2 border-gray-900',
          config.bgColor,
          indicatorSizes[size],
          status === 'online' && 'animate-pulse'
        )}
        title={config.label}
      />
    </div>
  );
};

interface StatusPickerProps {
  value?: UserStatus;
  onChange: (status: UserStatus) => void;
  showCustomMessage?: boolean;
  showDuration?: boolean;
}

export const StatusPicker: React.FC<StatusPickerProps> = ({
  value,
  onChange,
  showCustomMessage = true,
  showDuration = true,
}) => {
  const [customMessage, setCustomMessage] = useState('');
  const [duration, setDuration] = useState<number | undefined>();

  const handleStatusChange = (status: UserStatus) => {
    onChange(status);
  };

  return (
    <div className="space-y-3">
      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(STATUS_CONFIGS) as UserStatus[]).map((status) => {
          const config = STATUS_CONFIGS[status];
          const isSelected = value === status;

          return (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={cn(
                'flex items-center space-x-2 px-3 py-2.5 rounded-xl border transition-all',
                isSelected
                  ? cn(config.bgColor, 'text-white border-transparent')
                  : 'bg-white/5 text-white border-white/10 hover:border-white/20'
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', config.bgColor)} />
              <span className="text-sm font-medium">{config.label}</span>
              {isSelected && <span className="ml-auto">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Custom Message */}
      {showCustomMessage && (
        <div>
          <label className="text-white/60 text-xs mb-2 block">
            Статус сообщение (необязательно)
          </label>
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Например: В дедлайне до 18:00"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-cyan-500/50"
            maxLength={50}
          />
        </div>
      )}

      {/* Duration */}
      {showDuration && value !== 'online' && value !== 'offline' && value !== 'invisible' && (
        <div>
          <label className="text-white/60 text-xs mb-2 block">
            Автоматически сбросить через
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '30 мин', value: 1800000 },
              { label: '1 час', value: 3600000 },
              { label: '2 часа', value: 7200000 },
              { label: '4 часа', value: 14400000 },
              { label: '8 часов', value: 28800000 },
              { label: '∞', value: undefined },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => setDuration(option.value)}
                className={cn(
                  'px-3 py-2 rounded-xl text-sm font-medium transition-all',
                  duration === option.value
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper для форматирования lastSeen
export const formatLastSeen = (lastSeen: Date): string => {
  const diff = Date.now() - lastSeen.getTime();
  const minutes = Math.round(diff / 60000);
  const hours = Math.round(diff / 3600000);
  const days = Math.round(diff / 86400000);

  if (minutes < 1) return 'Только что';
  if (minutes < 60) return `${minutes}м назад`;
  if (hours < 24) return `${hours}ч назад`;
  if (days === 1) return 'Вчера';
  return `${days}д назад`;
};
