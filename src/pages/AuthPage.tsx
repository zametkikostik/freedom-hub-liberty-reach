import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { WalletConnectModal } from '@/components/web3/WalletConnectModal';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AuthFormData {
  email: string;
  password: string;
  username?: string;
  confirmPassword?: string;
}

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthSubmit = async (data: AuthFormData) => {
    setIsSubmitting(true);
    
    try {
      if (data.username) {
        await signUp(data.email, data.password, data.username);
        toast.success('Аккаунт создан! Добро пожаловать в Freedom Hub.');
      } else {
        await signIn(data.email, data.password);
        toast.success('С возвращением в Freedom Hub!');
      }
      
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Ошибка аутентификации'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalletConnectSuccess = (address: string) => {
    console.log('Wallet connected:', address);
    toast.success('Кошелёк подключён!');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid-bg relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/5 via-transparent to-cyber-purple/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="relative z-10 w-full max-w-md">
        <AuthForm
          onSubmit={handleAuthSubmit}
          onWalletConnect={() => setIsWalletModalOpen(true)}
          isLoading={isSubmitting}
        />
      </div>

      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectSuccess={handleWalletConnectSuccess}
      />
    </div>
  );
};
