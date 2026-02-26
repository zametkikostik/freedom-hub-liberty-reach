import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Wallet } from 'lucide-react';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess: (address: string) => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onConnectSuccess,
}) => {
  const handleConnect = () => {
    // Demo connection
    onConnectSuccess('0x1234...5678');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Подключить кошелёк"
      description="Выберите кошелёк для входа"
      size="md"
    >
      <div className="space-y-3">
        <button
          onClick={handleConnect}
          className="w-full p-4 rounded-2xl border border-white/10 hover:border-cyber-cyan/50 
                   hover:bg-cyber-cyan/10 transition-all flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-white">MetaMask</p>
            <p className="text-sm text-gray-400">Ethereum, Polygon, BSC</p>
          </div>
        </button>

        <div className="p-3 rounded-xl bg-cyber-gray/50 border border-white/5">
          <p className="text-xs text-gray-400 text-center">
            🔒 Ваше соединение защищено
          </p>
        </div>
      </div>
    </Modal>
  );
};
