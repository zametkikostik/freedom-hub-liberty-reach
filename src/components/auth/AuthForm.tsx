import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Mail, Lock, User } from 'lucide-react';

export type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  onSubmit: (data: { email: string; password: string; username?: string }) => Promise<void>;
  onWalletConnect: () => void;
  isLoading?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  onWalletConnect,
  isLoading,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="w-full">
      <Card className="glass-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Freedom Hub
          </h1>
          <p className="text-gray-400">
            Децентрализованная платформа будущего
          </p>
        </div>

        <div className="flex gap-2 mb-6 p-1 rounded-xl bg-cyber-gray/50">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
                mode === m
                  ? 'bg-cyber-cyan text-cyber-black'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {m === 'login' ? 'Вход' : 'Регистрация'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input
              type="text"
              label="Имя пользователя"
              placeholder="neo"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              leftIcon={<User className="w-5 h-5" />}
              fullWidth
            />
          )}

          <Input
            type="email"
            label="Email"
            placeholder="neo@matrix.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            leftIcon={<Mail className="w-5 h-5" />}
            fullWidth
          />

          <Input
            type="password"
            label="Пароль"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            leftIcon={<Lock className="w-5 h-5" />}
            fullWidth
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            size="lg"
          >
            {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-400">
              или войдите через
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onWalletConnect}
          fullWidth
          size="lg"
        >
          Подключить кошелёк
        </Button>
      </Card>

      <p className="mt-6 text-center text-xs text-gray-500">
        Продолжая, вы соглашаетесь с Условиями использования и Политикой конфиденциальности
      </p>
    </div>
  );
};
