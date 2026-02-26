import React from 'react';
import { Card } from '@/components/ui/Card';
import { Brain } from 'lucide-react';

export const AIPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI-сервисы</h1>
        <p className="text-gray-400">Доступ к GPT-5.2, Gemini 3 Pro и другим моделям</p>
      </div>

      <Card variant="glass" className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-cyber-green mx-auto mb-4 opacity-30" />
          <p className="text-gray-400">AI-модуль в разработке</p>
        </div>
      </Card>
    </div>
  );
};
