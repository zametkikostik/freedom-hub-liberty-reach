import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Key,
  Plus,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  Trash2,
  RefreshCw,
  Shield,
  Brain,
  Image,
  Music,
  Video,
  Mic,
  ChevronLeft,
  AlertTriangle,
  ExternalLink,
  Save,
  X,
  Globe,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONFIG
// ─────────────────────────────────────────────────────────────────────────────

type ApiCategory = 'language' | 'image' | 'music' | 'video' | 'voice';

interface ApiKeyConfig {
  id: string;
  name: string;
  category: ApiCategory;
  key: string;
  endpoint?: string;
  isActive: boolean;
  lastUsed?: Date;
  createdAt: Date;
  description: string;
}

const API_CATEGORIES = {
  language: {
    id: 'language' as ApiCategory,
    name: 'Языковые модели',
    icon: Brain,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    description: 'GPT-4, Claude, Gemini, Llama для AI-чатов',
  },
  image: {
    id: 'image' as ApiCategory,
    name: 'Изображения',
    icon: Image,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500/30',
    description: 'DALL-E, Midjourney, Stable Diffusion, FLUX',
  },
  music: {
    id: 'music' as ApiCategory,
    name: 'Музыка',
    icon: Music,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    description: 'Suno, Udio, AIVA для генерации музыки',
  },
  video: {
    id: 'video' as ApiCategory,
    name: 'Видео',
    icon: Video,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    description: 'Runway, Pika, HeyGen для создания видео',
  },
  voice: {
    id: 'voice' as ApiCategory,
    name: 'Голос',
    icon: Mic,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    description: 'ElevenLabs, Whisper, PlayHT для синтеза речи',
  },
};

const AI_PROVIDERS = {
  aggregators: [
    { id: 'openrouter', name: 'OpenRouter', url: 'https://openrouter.ai', icon: '🌐', color: 'text-indigo-400', description: 'Доступ к 100+ моделям через один API' },
    { id: 'together', name: 'Together AI', url: 'https://together.ai', icon: '🤝', color: 'text-orange-400', description: 'Open-source модели Llama, Mistral' },
    { id: 'anyscale', name: 'Anyscale', url: 'https://anyscale.com', icon: '⚡', color: 'text-yellow-400', description: 'Ray + LLM модели' },
    { id: 'deepinfra', name: 'DeepInfra', url: 'https://deepinfra.com', icon: '🏗️', color: 'text-slate-400', description: 'Дешёвые open-source модели' },
    { id: 'groq', name: 'Groq', url: 'https://groq.com', icon: '🚀', color: 'text-green-400', description: 'Самые быстрые инференсы LLM' },
    { id: 'fireworks', name: 'Fireworks AI', url: 'https://fireworks.ai', icon: '🎆', color: 'text-pink-400', description: 'Fine-tuned модели' },
  ],
  direct: [
    { id: 'openai', name: 'OpenAI', url: 'https://platform.openai.com', icon: '🟢', color: 'text-green-400', description: 'GPT-4, GPT-4 Turbo, o1' },
    { id: 'anthropic', name: 'Anthropic', url: 'https://console.anthropic.com', icon: '🟣', color: 'text-purple-400', description: 'Claude 3.5 Sonnet, Opus, Haiku' },
    { id: 'google', name: 'Google AI', url: 'https://makersuite.google.com', icon: '🔵', color: 'text-blue-400', description: 'Gemini 1.5 Pro, Flash' },
    { id: 'meta', name: 'Meta AI', url: 'https://llama.meta.com', icon: '🦙', color: 'text-cyan-400', description: 'Llama 3.1, 3.2' },
    { id: 'mistral', name: 'Mistral AI', url: 'https://console.mistral.ai', icon: '🌪️', color: 'text-orange-400', description: 'Mistral Large, Mixtral' },
    { id: 'cohere', name: 'Cohere', url: 'https://dashboard.cohere.com', icon: '🔷', color: 'text-indigo-400', description: 'Command R+, Embed' },
  ],
};

const DEFAULT_KEYS: ApiKeyConfig[] = [
  {
    id: 'k1',
    name: 'OpenAI GPT-4',
    category: 'language',
    key: 'sk-••••••••••••••••••••••••••••abcd',
    endpoint: 'https://api.openai.com/v1',
    isActive: true,
    lastUsed: new Date(Date.now() - 3600000),
    createdAt: new Date(Date.now() - 86400000 * 30),
    description: 'Основной ключ для AI-чатов',
  },
  {
    id: 'k2',
    name: 'Anthropic Claude',
    category: 'language',
    key: 'sk-ant-••••••••••••••••••••••••wxyz',
    endpoint: 'https://api.anthropic.com',
    isActive: true,
    lastUsed: new Date(Date.now() - 7200000),
    createdAt: new Date(Date.now() - 86400000 * 25),
    description: 'Альтернативная модель для сложных задач',
  },
  {
    id: 'k3',
    name: 'DALL-E 3',
    category: 'image',
    key: 'sk-••••••••••••••••••••••••••••efgh',
    endpoint: 'https://api.openai.com/v1/images',
    isActive: true,
    lastUsed: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 86400000 * 20),
    description: 'Генерация изображений',
  },
  {
    id: 'k4',
    name: 'ElevenLabs',
    category: 'voice',
    key: 'el-••••••••••••••••••••••••ijkl',
    endpoint: 'https://api.elevenlabs.io',
    isActive: false,
    createdAt: new Date(Date.now() - 86400000 * 15),
    description: 'Синтез речи для голосовых сообщений',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  title: string;
  value: number | string;
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

const CategoryCard: React.FC<{
  category: typeof API_CATEGORIES['language'];
  keys: ApiKeyConfig[];
  onClick: () => void;
}> = ({ category, keys, onClick }) => {
  const Icon = category.icon;
  const activeKeys = keys.filter(k => k.isActive).length;

  return (
    <button
      onClick={onClick}
      className={cn(
        'p-6 rounded-2xl border backdrop-blur-xl transition-all hover:scale-105 text-left',
        category.bgColor,
        category.borderColor
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-xl bg-white/10', category.color)}>
          <Icon className="w-6 h-6" />
        </div>
        {activeKeys > 0 && (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
            {activeKeys} активн{activeKeys === 1 ? 'ый' : activeKeys < 5 ? 'ых' : 'ых'}
          </span>
        )}
      </div>

      <h3 className="text-white font-bold text-lg mb-1">{category.name}</h3>
      <p className="text-white/60 text-sm mb-4">{category.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-white/40 text-xs">
          {keys.length} ключ{keys.length === 1 ? '' : keys.length < 5 ? 'а' : 'ей'}
        </span>
        <ChevronLeft className="w-4 h-4 text-white/40 rotate-180" />
      </div>
    </button>
  );
};

const ApiKeyRow: React.FC<{
  keyConfig: ApiKeyConfig;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRegenerate: (id: string) => void;
}> = ({ keyConfig, onToggle, onDelete, onRegenerate }) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(keyConfig.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const category = API_CATEGORIES[keyConfig.category];

  return (
    <div className={cn(
      'bg-white/5 border rounded-2xl p-6 backdrop-blur-xl transition-all',
      keyConfig.isActive ? 'border-white/10' : 'border-white/5 opacity-60'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={cn('p-3 rounded-xl', category.bgColor)}>
            <category.icon className={cn('w-5 h-5', category.color)} />
          </div>
          <div>
            <h3 className="text-white font-bold">{keyConfig.name}</h3>
            <p className="text-white/60 text-sm">{keyConfig.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggle(keyConfig.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              keyConfig.isActive
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            )}
          >
            {keyConfig.isActive ? 'Активен' : 'Отключен'}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <div className="flex-1 px-4 py-3 bg-black/30 rounded-xl border border-white/10 font-mono text-sm text-white/80">
          {showKey ? keyConfig.key : '••••••••••••••••••••' + keyConfig.key.slice(-4)}
        </div>
        <button
          onClick={() => setShowKey(!showKey)}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
        >
          {showKey ? <EyeOff className="w-4 h-4 text-white/60" /> : <Eye className="w-4 h-4 text-white/60" />}
        </button>
        <button
          onClick={handleCopy}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
        >
          {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/60" />}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-white/40 mb-4">
        <div className="flex items-center space-x-4">
          <span>Endpoint: {keyConfig.endpoint || 'Не указан'}</span>
          {keyConfig.lastUsed && (
            <span>Использован: {keyConfig.lastUsed.toLocaleDateString()}</span>
          )}
        </div>
        <span>Создан: {keyConfig.createdAt.toLocaleDateString()}</span>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => onRegenerate(keyConfig.id)}
          className="flex-1 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Пересоздать</span>
        </button>
        <button
          onClick={() => onDelete(keyConfig.id)}
          className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-semibold transition-all flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Удалить</span>
        </button>
      </div>
    </div>
  );
};

const AddKeyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (key: Omit<ApiKeyConfig, 'id' | 'createdAt' | 'lastUsed'>) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ApiCategory>('language');
  const [key, setKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onAdd({ name, category, key, endpoint, description, isActive: true });
    setName('');
    setCategory('language');
    setKey('');
    setEndpoint('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  const selectedCategory = API_CATEGORIES[category];
  const CategoryIcon = selectedCategory.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Новый API ключ</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Category */}
          <div>
            <label className="text-white/60 text-sm mb-3 block">Категория</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.values(API_CATEGORIES) as any[]).map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2.5 rounded-xl border transition-all',
                      category === cat.id
                        ? cn(cat.bgColor, cat.borderColor)
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', category === cat.id ? cat.color : 'text-white/60')} />
                    <span className={cn('text-sm font-medium', category === cat.id ? 'text-white' : 'text-white/80')}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Название</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: OpenAI GPT-4"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* API Key */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">API ключ</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
          </div>

          {/* Endpoint */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Endpoint (необязательно)</label>
            <input
              type="url"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://api.example.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Для чего используется этот ключ..."
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!name || !key}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Сохранить ключ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const ApiPanel: React.FC = () => {
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>(DEFAULT_KEYS);
  const [selectedCategory, setSelectedCategory] = useState<ApiCategory | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggle = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, isActive: !k.isActive } : k));
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены? Это действие нельзя отменить.')) {
      setApiKeys(prev => prev.filter(k => k.id !== id));
    }
  };

  const handleRegenerate = (id: string) => {
    if (confirm('Новый ключ заменит старый. Продолжить?')) {
      const newKey = 'sk-' + Math.random().toString(36).slice(2) + '••••••••••••' + Math.random().toString(36).slice(-4);
      setApiKeys(prev => prev.map(k => k.id === id ? { ...k, key: newKey, createdAt: new Date() } : k));
    }
  };

  const handleAdd = (newKey: Omit<ApiKeyConfig, 'id' | 'createdAt' | 'lastUsed'>) => {
    const key: ApiKeyConfig = {
      ...newKey,
      id: `k${Date.now()}`,
      createdAt: new Date(),
    };
    setApiKeys(prev => [...prev, key]);
  };

  const filteredKeys = selectedCategory === 'all'
    ? apiKeys
    : apiKeys.filter(k => k.category === selectedCategory);

  const stats = {
    total: apiKeys.length,
    active: apiKeys.filter(k => k.isActive).length,
    categories: new Set(apiKeys.map(k => k.category)).size,
    used24h: apiKeys.filter(k => k.lastUsed && Date.now() - k.lastUsed.getTime() < 86400000).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <Key className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">API Ключи</h1>
              <p className="text-white/60">Настройка ключей для внешних сервисов</p>
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            title="Всего ключей"
            value={stats.total}
            icon={<Key className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
          />
          <StatCard
            title="Активные"
            value={stats.active}
            icon={<CheckCircle className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
          />
          <StatCard
            title="Категории"
            value={stats.categories}
            icon={<Shield className="w-6 h-6 text-cyan-400" />}
            color="bg-cyan-500/20"
          />
          <StatCard
            title="Использовано за 24ч"
            value={stats.used24h}
            icon={<RefreshCw className="w-6 h-6 text-amber-400" />}
            color="bg-amber-500/20"
          />
        </div>

        {/* AI Providers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>AI Провайдеры и Агрегаторы</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Aggregators */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-6 h-6 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Агрегаторы моделей</h3>
              </div>
              <div className="space-y-3">
                {AI_PROVIDERS.aggregators.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{provider.name}</p>
                        <p className="text-white/40 text-xs">{provider.description}</p>
                      </div>
                    </div>
                    <a
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-white/60" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Providers */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Прямые провайдеры</h3>
              </div>
              <div className="space-y-3">
                {AI_PROVIDERS.direct.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{provider.name}</p>
                        <p className="text-white/40 text-xs">{provider.description}</p>
                      </div>
                    </div>
                    <a
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-white/60" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Категории</h2>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-white/60 hover:text-white text-sm flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Сбросить фильтр</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(Object.values(API_CATEGORIES) as any[]).map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                keys={apiKeys.filter(k => k.category === cat.id)}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
              />
            ))}
          </div>
        </div>

        {/* API Keys List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Key className="w-5 h-5 text-purple-400" />
              <span>API ключи {selectedCategory !== 'all' && `• ${API_CATEGORIES[selectedCategory].name}`}</span>
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить ключ</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredKeys.map((keyConfig) => (
              <ApiKeyRow
                key={keyConfig.id}
                keyConfig={keyConfig}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onRegenerate={handleRegenerate}
              />
            ))}
          </div>

          {filteredKeys.length === 0 && (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <Key className="w-10 h-10 text-white/20" />
              </div>
              <p className="text-white/60 mb-4">Ключи не найдены</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all"
              >
                Добавить первый ключ
              </button>
            </div>
          )}
        </div>

        {/* Info Block */}
        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-purple-400 mt-0.5" />
            <div>
              <h3 className="text-white font-bold mb-2">Безопасность API ключей</h3>
              <ul className="text-white/60 text-sm space-y-1">
                <li>• Ключи хранятся локально и не передаются на сервер</li>
                <li>• Используйте разные ключи для разных сервисов</li>
                <li>• Регулярно обновляйте ключи для безопасности</li>
                <li>• Не показывайте ключи посторонним</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add Key Modal */}
      <AddKeyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default ApiPanel;
