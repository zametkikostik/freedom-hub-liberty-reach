import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  Settings,
  LogOut,
  User,
  Shield,
  Key,
  Server,
  Camera,
  Copy,
  Check,
  Fingerprint,
  Lock,
  Globe,
  Smartphone,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'profile', label: 'Профиль', icon: <User className="w-5 h-5" /> },
  { id: 'security', label: 'Безопасность', icon: <Shield className="w-5 h-5" /> },
  { id: 'keys', label: 'Ключи (PGP/Kyber)', icon: <Key className="w-5 h-5" /> },
  { id: 'node', label: 'Управление сервисом', icon: <Server className="w-5 h-5" /> },
];

export const SettingsPage: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [copied, setCopied] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);

  // Моковые данные профиля
  const userProfile = {
    username: profile?.username || 'Neo_Hacker',
    federatedId: '@neo@cyber-rebel.net',
    bio: 'Киберпанк-энтузиаст. Защита приватности — это право, а не привилегия.',
    avatar: null,
  };

  // Моковые данные безопасности
  const securitySettings = {
    twoFactorEnabled: true,
    pqE2EEnabled: true,
    vlessProxyEnabled: true,
  };

  // Моковой ключ шифрования
  const publicKeyFingerprint = 'F8A9 2B3C 4D5E 6F7A 8B9C 0D1E 2F3A 4B5C';
  const publicKeyFull = 'ed25519:8F3A2B1C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(publicKeyFull);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const Toggle: React.FC<{ enabled: boolean; onChange?: () => void }> = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={cn(
        'relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200',
        enabled ? 'bg-cyber-cyan' : 'bg-gray-600'
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyber-purple/20 border border-cyber-purple/30">
              <Settings className="w-6 h-6 text-cyber-purple" />
            </div>
            <h1 className="text-3xl font-bold text-white">Настройки</h1>
          </div>
          <p className="text-gray-400">
            Управление профилем, безопасностью и ключами шифрования.
          </p>
        </div>
        <Button
          variant="danger"
          size="lg"
          onClick={handleSignOut}
          leftIcon={<LogOut className="w-5 h-5" />}
          className="bg-gradient-to-r from-cyber-red to-cyber-red-dark text-white hover:from-cyber-red hover:to-cyber-red"
        >
          Выйти
        </Button>
      </div>

      {/* Основная рабочая область - 2 колонки */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Левая колонка - навигация и сводка */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          {/* Карточка профиля */}
          <Card variant="glass" className="p-6">
            <div className="text-center">
              {/* Аватар */}
              <div
                className="relative inline-block"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyber-cyan via-cyber-purple to-cyber-pink p-1">
                  <div className="w-full h-full rounded-full bg-cyber-gray flex items-center justify-center overflow-hidden">
                    {userProfile.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt={userProfile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <button
                  className={cn(
                    'absolute bottom-0 right-0 p-2 rounded-full bg-cyber-cyan text-cyber-black transition-all duration-200',
                    avatarHover ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  )}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Имя и ID */}
              <h2 className="mt-4 text-xl font-bold text-white">{userProfile.username}</h2>
              <p className="text-sm text-gray-400 font-mono">{userProfile.federatedId}</p>

              {/* Бейдж статуса */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-green/20 border border-cyber-green/30">
                <Shield className="w-4 h-4 text-cyber-green" />
                <span className="text-xs font-medium text-cyber-green">Аккаунт защищен</span>
              </div>
            </div>
          </Card>

          {/* Меню разделов */}
          <Card variant="glass" className="p-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    activeSection === item.id
                      ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Правая колонка - контент настроек */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Блок 1: Основная информация (Профиль) */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyber-cyan/20">
                <User className="w-5 h-5 text-cyber-cyan" />
              </div>
              <h2 className="text-xl font-bold text-white">Основная информация</h2>
            </div>

            <div className="space-y-5">
              {/* Отображаемое имя */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Отображаемое имя
                </label>
                <Input
                  type="text"
                  defaultValue={userProfile.username}
                  className="bg-cyber-gray/50 border-white/10 focus:border-cyber-cyan/50"
                />
              </div>

              {/* Статус (Bio) */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Статус (Bio)
                </label>
                <textarea
                  defaultValue={userProfile.bio}
                  rows={3}
                  className="w-full bg-cyber-gray/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50 resize-none"
                />
              </div>

              {/* Кнопка сохранения */}
              <div className="flex justify-end pt-2">
                <Button variant="primary" className="bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/90">
                  Сохранить изменения
                </Button>
              </div>
            </div>
          </Card>

          {/* Блок 2: Безопасность и Приватность */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyber-green/20">
                <Shield className="w-5 h-5 text-cyber-green" />
              </div>
              <h2 className="text-xl font-bold text-white">Безопасность и Приватность</h2>
            </div>

            <div className="space-y-5">
              {/* 2FA */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-cyber-gray/30 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyber-green/20">
                    <Smartphone className="w-5 h-5 text-cyber-green" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Двухфакторная аутентификация (2FA)</p>
                    <p className="text-xs text-gray-400">Дополнительная защита через TOTP</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-cyber-green font-medium">Включено</span>
                  <Toggle enabled={securitySettings.twoFactorEnabled} />
                </div>
              </div>

              {/* PQ-E2E */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-cyber-gray/30 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyber-purple/20">
                    <Lock className="w-5 h-5 text-cyber-purple" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Пост-квантовое шифрование (PQ-E2E)</p>
                    <p className="text-xs text-gray-400">Kyber-1024 для защиты от квантовых атак</p>
                  </div>
                </div>
                <Toggle enabled={securitySettings.pqE2EEnabled} />
              </div>

              {/* VLESS Proxy */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-cyber-gray/30 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyber-cyan/20">
                    <Globe className="w-5 h-5 text-cyber-cyan" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Скрывать IP-адрес (VLESS Proxy)</p>
                    <p className="text-xs text-gray-400">Маршрутизация через децентрализованные узлы</p>
                  </div>
                </div>
                <Toggle enabled={securitySettings.vlessProxyEnabled} />
              </div>
            </div>
          </Card>

          {/* Блок 3: Ключи шифрования */}
          <Card variant="glass" className="p-6 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                <Key className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Ключи шифрования</h2>
            </div>

            <div className="space-y-5">
              {/* Fingerprint */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Public Key Fingerprint (Ed25519)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-cyber-black/50 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-indigo-300">
                    {publicKeyFingerprint}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyKey}
                    className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Полный ключ */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Полный публичный ключ
                </label>
                <div className="bg-cyber-black/50 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-gray-300 break-all">
                  {publicKeyFull}
                </div>
              </div>

              {/* Визуализация отпечатка */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Визуализация ключа
                </label>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-cyber-black/30 border border-white/5">
                  <Fingerprint className="w-16 h-16 text-indigo-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">
                      Уникальный криптографический отпечаток вашего ключа
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Используется для верификации личности в децентрализованной сети
                    </p>
                  </div>
                </div>
              </div>

              {/* Кнопка экспорта */}
              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-500 hover:to-indigo-600"
                  leftIcon={<Key className="w-5 h-5" />}
                >
                  Экспорт ключей
                </Button>
              </div>
            </div>
          </Card>

          {/* Блок 4: Управление сервисом (нода) */}
          <Card variant="glass" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyber-orange/20">
                <Server className="w-5 h-5 text-cyber-orange" />
              </div>
              <h2 className="text-xl font-bold text-white">Управление сервисом</h2>
            </div>

            <div className="space-y-5">
              {/* Статус ноды */}
              <div className="p-4 rounded-xl bg-cyber-gray/30 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-medium">Статус ноды</p>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-green/20 text-cyber-green text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                    Активна
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 rounded-lg bg-cyber-black/30">
                    <p className="text-xs text-gray-400 mb-1">Uptime</p>
                    <p className="text-lg font-mono text-white">99.97%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-cyber-black/30">
                    <p className="text-xs text-gray-400 mb-1">Регион</p>
                    <p className="text-lg font-mono text-white">EU-West</p>
                  </div>
                </div>
              </div>

              {/* Конечная точка */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  VLESS Endpoint
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-cyber-black/50 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-gray-300">
                    vless://neo@eu-west-1.freedomhub.io:443
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/10 text-gray-400 hover:bg-white/10"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Пропускная способность */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Пропускная способность
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Использовано</span>
                    <span className="text-white font-mono">847 GB / 1000 GB</span>
                  </div>
                  <div className="h-2 rounded-full bg-cyber-gray overflow-hidden">
                    <div className="h-full w-[84.7%] bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full" />
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1">
                  Изменить конфигурацию
                </Button>
                <Button variant="outline" className="flex-1">
                  Статистика
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
