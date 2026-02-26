import React from 'react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  isVerified?: boolean;
  verificationType?: 'creator' | 'admin' | 'partner' | 'premium';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  isVerified = false,
  verificationType = 'premium',
  className,
  size = 'md',
}) => {
  if (!isVerified) return null;

  const config = {
    creator: {
      color: '#FFD700', // Золотой (как у YouTube Gold)
      tooltip: 'Создатель',
    },
    admin: {
      color: '#0088cc', // Голубой (как у Telegram)
      tooltip: 'Администратор',
    },
    partner: {
      color: '#9333EA', // Фиолетовый
      tooltip: 'Партнёр',
    },
    premium: {
      color: '#EC4899', // Розовый (как у Premium)
      tooltip: 'Premium',
    },
  };

  const currentConfig = config[verificationType];

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={cn('inline-flex items-center justify-center', className)}
      title={currentConfig.tooltip}
      style={{ color: currentConfig.color }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn(sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Круг */}
        <circle cx="12" cy="12" r="12" fill="currentColor" />
        {/* Галочка (белая) */}
        <path
          d="M17.5 8.5L10.5 15.5L6.5 11.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
};

// Компонент для отображения в списке/чате
export const VerifiedBadgeInline: React.FC<VerifiedBadgeProps & { showLabel?: boolean }> = ({
  isVerified = false,
  verificationType = 'premium',
  size = 'sm',
  showLabel = false,
}) => {
  if (!isVerified) return null;

  const config = {
    creator: { color: '#FFD700', label: 'Создатель' },
    admin: { color: '#0088cc', label: 'Админ' },
    partner: { color: '#9333EA', label: 'Партнёр' },
    premium: { color: '#EC4899', label: 'Premium' },
  };

  const currentConfig = config[verificationType];
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span className="inline-flex items-center space-x-1">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn(sizeClasses[size])}
        style={{ color: currentConfig.color }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" fill="currentColor" />
        <path
          d="M17.5 8.5L10.5 15.5L6.5 11.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showLabel && (
        <span className="text-xs font-medium" style={{ color: currentConfig.color }}>
          {currentConfig.label}
        </span>
      )}
    </span>
  );
};
