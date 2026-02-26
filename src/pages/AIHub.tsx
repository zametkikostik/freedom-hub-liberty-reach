import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Music, Image as ImageIcon, Video, Send, Sparkles, FileText,
  Brain, ChevronDown, Copy, RefreshCw, Trash2, Settings, Plus, X,
  ToggleLeft, ToggleRight, Globe, BarChart3, Twitter, Mail, Bot,
  Crown, AlertCircle, CheckCircle, Play, Mic, ThumbsUp, ThumbsDown,
  Check, CreditCard, Coins, Key, Shield, TrendingUp, Wallet,
  Palette, Film, Upload, Paperclip,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateOpenRouterResponse, Message, createSystemMessage } from '@/lib/ai';

type Category = 'text-code' | 'music' | 'images' | 'video' | 'agents' | 'settings';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  attachments?: Attachment[];
}

interface Attachment { id: string; name: string; type: 'image' | 'file'; }
interface AIAgent { id: string; name: string; role_prompt: string; description?: string; tools_enabled: string[]; is_active: boolean; avatar_color: string; created_at: Date; execution_count: number; }
interface AgentLimit { current_count: number; max_allowed: number; can_create: boolean; subscription_tier: string; }
interface GeneratedTrack { id: string; title: string; duration: string; waveform: number[]; }
interface GeneratedImage { id: string; url: string; prompt: string; }
interface APIKey { key: string; name: string; createdAt: Date; }
interface TopUpTier { name: string; tokens: number; priceDAI: number; color: string; highlighted?: boolean; }

const LLM_GROUPS = [
  { name: 'OpenAI', icon: '🟢', color: 'green', models: [
      { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'Most capable' },
      { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Fast & powerful' },
      { id: 'openai/o1-preview', name: 'o1-preview', description: 'Advanced reasoning' },
      { id: 'openai/o1-mini', name: 'o1-mini', description: 'Fast reasoning' },
    ]},
  { name: 'Anthropic', icon: '🟣', color: 'purple', models: [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Best overall' },
      { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', description: 'Most intelligent' },
      { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', description: 'Fast & efficient' },
    ]},
  { name: 'Google', icon: '🔵', color: 'blue', models: [
      { id: 'google/gemini-pro-1.5', name: 'Gemini 1.5 Pro', description: 'Multimodal giant' },
      { id: 'google/gemini-flash-1.5', name: 'Gemini 1.5 Flash', description: 'Lightning fast' },
    ]},
  { name: 'xAI', icon: '🟠', color: 'orange', models: [
      { id: 'x-ai/grok-2', name: 'Grok-2', description: 'No censorship' },
      { id: 'x-ai/grok-2-mini', name: 'Grok-2 mini', description: 'Fast version' },
    ]},
  { name: 'Open-Source Giants', icon: '🟡', color: 'yellow', models: [
      { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B', description: 'Largest open' },
      { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', description: 'Best open' },
      { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', description: 'Alibaba flagship' },
      { id: 'qwen/qwen-2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder', description: 'Best for code' },
      { id: 'deepseek/deepseek-v3', name: 'DeepSeek V3', description: 'Chinese giant' },
      { id: 'mistralai/mistral-large-2411', name: 'Mistral Large 2', description: 'European champion' },
    ]},
  { name: 'Uncensored', icon: '🔴', color: 'red', models: [
      { id: 'nousresearch/hermes-3-llama-3.1-405b', name: 'Nous Hermes 3', description: 'Uncensored 405B' },
      { id: 'cognitivecomputations/dolphin-mixtral-8x7b', name: 'Dolphin 2.9 Mixtral', description: 'No restrictions' },
      { id: 'open-orca/wizardlm-2-8x22b', name: 'WizardLM-2', description: 'Uncensored giant' },
    ]},
];

const MUSIC_MODELS = [
  { id: 'udio-v1.5', name: 'Udio v1.5', provider: 'Udio' },
  { id: 'suno-v3.5', name: 'Suno v3.5', provider: 'Suno' },
  { id: 'stable-audio-2.0', name: 'Stable Audio 2.0', provider: 'Stability AI' },
  { id: 'musicgen', name: 'MusicGen', provider: 'Meta' },
  { id: 'elevenlabs', name: 'ElevenLabs', provider: 'ElevenLabs' },
  { id: 'rvc-v2', name: 'RVC v2', provider: 'RVC' },
  { id: 'suno-bark', name: 'Suno Bark', provider: 'Suno' },
];

const IMAGE_MODELS = [
  { id: 'midjourney-v6', name: 'Midjourney v6', provider: 'Midjourney' },
  { id: 'flux.1-pro', name: 'Flux.1 Pro', provider: 'Black Forest' },
  { id: 'flux.1-schnell', name: 'Flux.1 Schnell', provider: 'Black Forest' },
  { id: 'stable-diffusion-3-large', name: 'SD3 Large', provider: 'Stability AI' },
  { id: 'dalle-3', name: 'DALL-E 3', provider: 'OpenAI' },
  { id: 'leonardo-ai', name: 'Leonardo AI', provider: 'Leonardo' },
  { id: 'ideogram-v2', name: 'Ideogram v2', provider: 'Ideogram' },
  { id: 'krea-ai', name: 'Krea AI', provider: 'Krea' },
];

const VIDEO_MODELS = [
  { id: 'runway-gen3', name: 'Runway Gen-3', provider: 'Runway' },
  { id: 'luma-dream', name: 'Luma Dream', provider: 'Luma AI' },
  { id: 'kling-ai', name: 'Kling AI', provider: 'Kuaishou' },
  { id: 'sora', name: 'Sora', provider: 'OpenAI' },
  { id: 'pika-v1', name: 'Pika v1.0', provider: 'Pika' },
  { id: 'haiper', name: 'Haiper', provider: 'Haiper' },
  { id: 'minimax', name: 'Minimax', provider: 'Minimax' },
];

const ASPECT_RATIOS = [{ id: '16:9', name: '16:9' }, { id: '1:1', name: '1:1' }, { id: '9:16', name: '9:16' }];
const IMAGE_STYLES = [{ id: 'photorealism', name: 'Photorealism' }, { id: 'anime', name: 'Anime' }, { id: '3d', name: '3D' }, { id: 'cyberpunk', name: 'Cyberpunk' }];

const MOCK_AGENTS: AIAgent[] = [
  { id: '1', name: 'Crypto Tracker', role_prompt: '...', description: 'Crypto alerts', tools_enabled: ['crypto_prices'], is_active: true, avatar_color: 'orange', created_at: new Date(), execution_count: 147 },
  { id: '2', name: 'News Summarizer', role_prompt: '...', description: 'News every 4h', tools_enabled: ['web_search'], is_active: true, avatar_color: 'cyan', created_at: new Date(), execution_count: 89 },
  { id: '3', name: 'Web3 Researcher', role_prompt: '...', description: 'Analyze protocols', tools_enabled: ['web_search', 'twitter_api'], is_active: false, avatar_color: 'purple', created_at: new Date(), execution_count: 34 },
];

const MOCK_LIMIT: AgentLimit = { current_count: 3, max_allowed: 5, can_create: true, subscription_tier: 'free' };

const AVAILABLE_TOOLS = [
  { id: 'web_search', name: 'Web Search', icon: Globe, description: 'Search', color: 'blue' },
  { id: 'crypto_prices', name: 'Crypto', icon: BarChart3, description: 'Prices', color: 'orange' },
  { id: 'twitter_api', name: 'Twitter', icon: Twitter, description: 'Post', color: 'sky' },
  { id: 'email_sender', name: 'Email', icon: Mail, description: 'Send', color: 'red' },
];

const AGENT_COLORS = ['cyan', 'purple', 'pink', 'orange', 'green', 'blue'];

const TOP_UP_TIERS: TopUpTier[] = [
  { name: 'Starter', tokens: 1000000, priceDAI: 5, color: 'cyan' },
  { name: 'Pro', tokens: 5000000, priceDAI: 20, color: 'purple', highlighted: true },
  { name: 'Whale', tokens: 20000000, priceDAI: 50, color: 'amber' },
];

const AIHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('text-code');
  const [balance, setBalance] = useState(12450);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showTopUpModal, setShowTopUpModal] = useState<{ open: boolean; tier?: TopUpTier }>({ open: false });
  const [paymentStatus, setPaymentStatus] = useState<{ step: 'idle' | 'connecting' | 'waiting_tx' | 'verifying' | 'success' | 'error'; message: string; txHash?: string }>({ step: 'idle', message: '' });
  
  const [selectedLLM, setSelectedLLM] = useState('anthropic/claude-3.5-sonnet');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLLMDropdown, setShowLLMDropdown] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  
  const [selectedMusicModel, setSelectedMusicModel] = useState('udio-v1.5');
  const [lyrics, setLyrics] = useState('');
  const [musicStyle, setMusicStyle] = useState('');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);
  
  const [selectedImageModel, setSelectedImageModel] = useState('midjourney-v6');
  const [imagePrompt, setImagePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageStyle, setImageStyle] = useState('photorealism');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  const [selectedVideoModel, setSelectedVideoModel] = useState('runway-gen3');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(false);
  
  const [agents, setAgents] = useState<AIAgent[]>(MOCK_AGENTS);
  const [agentLimit, setAgentLimit] = useState<AgentLimit>(MOCK_LIMIT);
  const [showCreateAgentModal, setShowCreateAgentModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPrompt, setNewAgentPrompt] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState('cyan');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowLLMDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && attachments.length === 0) || isLoading) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setAttachments([]);
    setIsLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    try {
      const systemMessage = createSystemMessage();
      const apiMessages: Message[] = [
        systemMessage,
        ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { role: 'user' as const, content: userMessage.content },
      ];
      const response = await generateOpenRouterResponse(apiMessages, selectedLLM);
      if (response.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.content,
          timestamp: new Date(),
          model: selectedLLM,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      setTimeout(() => {
        const mockMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Demo: ' + userMessage.content,
          timestamp: new Date(),
          model: selectedLLM,
        };
        setMessages(prev => [...prev, mockMessage]);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };
  const handleCopyMessage = (content: string) => navigator.clipboard.writeText(content);
  
  const handleRegenerate = async (messageIndex: number) => {
    setIsLoading(true);
    setTimeout(() => {
      const regeneratedMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Regenerated response',
        timestamp: new Date(),
        model: selectedLLM,
      };
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[messageIndex] = regeneratedMessage;
        return newMessages;
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleGenerateMusic = () => {
    if (!lyrics.trim() && !musicStyle.trim()) return;
    setIsGeneratingMusic(true);
    setTimeout(() => {
      setGeneratedTrack({
        id: Date.now().toString(),
        title: musicStyle || 'Track',
        duration: '3:24',
        waveform: Array.from({ length: 50 }, () => Math.random() * 100),
      });
      setIsGeneratingMusic(false);
    }, 3000);
  };

  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setTimeout(() => {
      setGeneratedImages([
        { id: '1', url: 'https://picsum.photos/seed/ai1/512/512', prompt: imagePrompt },
        { id: '2', url: 'https://picsum.photos/seed/ai2/512/512', prompt: imagePrompt },
        { id: '3', url: 'https://picsum.photos/seed/ai3/512/512', prompt: imagePrompt },
        { id: '4', url: 'https://picsum.photos/seed/ai4/512/512', prompt: imagePrompt },
      ]);
      setIsGeneratingImage(false);
    }, 3000);
  };

  const handleGenerateVideo = () => {
    if (!videoPrompt.trim()) return;
    setIsGeneratingVideo(true);
    setTimeout(() => {
      setGeneratedVideo(true);
      setIsGeneratingVideo(false);
    }, 4000);
  };

  const toggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId ? { ...agent, is_active: !agent.is_active } : agent
    ));
  };

  const deleteAgent = (agentId: string) => {
    setAgents(prev => prev.filter(a => a.id !== agentId));
    setAgentLimit(prev => ({ ...prev, current_count: prev.current_count - 1 }));
  };

  const handleCreateAgent = () => {
    if (!newAgentName.trim() || !newAgentPrompt.trim()) return;
    const newAgent: AIAgent = {
      id: Date.now().toString(),
      name: newAgentName,
      role_prompt: newAgentPrompt,
      description: 'Custom',
      tools_enabled: selectedTools,
      is_active: true,
      avatar_color: selectedColor,
      created_at: new Date(),
      execution_count: 0,
    };
    setAgents(prev => [...prev, newAgent]);
    setAgentLimit(prev => ({ ...prev, current_count: prev.current_count + 1 }));
    setNewAgentName('');
    setNewAgentPrompt('');
    setSelectedTools([]);
    setSelectedColor('cyan');
    setShowCreateAgentModal(false);
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev =>
      prev.includes(toolId) ? prev.filter(t => t !== toolId) : [...prev, toolId]
    );
  };

  const getLLMName = (id: string) => {
    const group = LLM_GROUPS.find(g => g.models.some(m => m.id === id));
    const model = group?.models.find(m => m.id === id);
    return model?.name || id;
  };

  const handleClearChat = () => setMessages([]);
  const handleVoiceInput = () => setIsRecording(!isRecording);

  // BILLING FUNCTIONS
  const handleTopUp = async (tier: TopUpTier) => {
    if (!(window as any).ethereum) {
      setPaymentStatus({ step: 'error', message: 'MetaMask not found.' });
      return;
    }
    try {
      setPaymentStatus({ step: 'connecting', message: 'Connecting to MetaMask...' });
      const ethers = await import('ethers');
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      
      if (network.chainId !== 137n) {
        try {
          await (window as any).ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }],
          });
        } catch (e: any) {
          if (e.code === 4902) {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com'],
              }],
            });
          } else {
            throw new Error('Please switch to Polygon');
          }
        }
      }
      
      setPaymentStatus({ step: 'waiting_tx', message: 'Confirm in MetaMask...' });
      const DAI_CONTRACT_ADDRESS = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063';
      const MERCHANT_WALLET = '0xYOUR_MERCHANT_WALLET_ADDRESS_HERE';
      
      const daiContract = new ethers.Contract(
        DAI_CONTRACT_ADDRESS,
        ['function transfer(address to, uint256 amount) external returns (bool)', 'function decimals() external view returns (uint8)'],
        signer
      );
      const decimals = await daiContract.decimals();
      const amountWei = ethers.parseUnits(tier.priceDAI.toString(), decimals);
      const tx = await daiContract.transfer(MERCHANT_WALLET, amountWei);
      
      setPaymentStatus({ step: 'verifying', message: 'Waiting for confirmations...', txHash: tx.hash });
      await tx.wait();
      
      setPaymentStatus({ step: 'verifying', message: 'Verifying on Polygon...', txHash: tx.hash });
      
      // In production, call verify-payment Edge Function here
      // const verifyResponse = await fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/verify-payment', {...})
      
      // Simulate success for demo
      setTimeout(() => {
        setBalance(prev => prev + tier.tokens);
        setPaymentStatus({ step: 'success', message: `Added ${tier.tokens.toLocaleString()} tokens!`, txHash: tx.hash });
        setTimeout(() => {
          setShowTopUpModal({ open: false });
          setPaymentStatus({ step: 'idle', message: '' });
        }, 3000);
      }, 2000);
    } catch (error: any) {
      console.error('Top-up error:', error);
      let errorMessage = 'Payment failed.';
      if (error.code === 'ACTION_REJECTED') errorMessage = 'Transaction rejected.';
      else if (error.message) errorMessage = error.message;
      setPaymentStatus({ step: 'error', message: errorMessage });
    }
  };

  const generateAPIKey = () => {
    const newKey: APIKey = {
      key: 'fh-sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      name: 'API Key ' + (apiKeys.length + 1),
      createdAt: new Date(),
    };
    setApiKeys(prev => [...prev, newKey]);
  };

  const copyAPIKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert('Copied!');
  };

  const categories = [
    { id: 'text-code' as Category, icon: FileText, label: 'Text & Code', color: 'cyan' },
    { id: 'music' as Category, icon: Music, label: 'Music & Audio', color: 'purple' },
    { id: 'images' as Category, icon: ImageIcon, label: 'Images', color: 'pink' },
    { id: 'video' as Category, icon: Video, label: 'Video', color: 'orange' },
    { id: 'agents' as Category, icon: Bot, label: 'Autonomous Agents', color: 'green' },
    { id: 'settings' as Category, icon: Settings, label: 'AI Settings', color: 'amber' },
  ];

  // RENDER: AI SETTINGS
  const renderAISettings = () => (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Balance Card */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl border border-white/20 p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">AI Tokens</h2>
              <p className="text-white/60 text-sm">1 Token = 1 Word</p>
            </div>
          </div>
        </div>
        <div className="flex items-end space-x-4 mb-6">
          <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            {balance.toLocaleString()}
          </span>
          <span className="text-2xl text-white/60 mb-2">Tokens</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="backdrop-blur-md bg-white/5 rounded-xl border p-4">
            <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
            <p className="text-white/80 text-sm">Messages</p>
            <p className="text-2xl font-bold text-white">{Math.floor(balance / 50)}</p>
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-xl border p-4">
            <ImageIcon className="w-5 h-5 text-pink-400 mb-2" />
            <p className="text-white/80 text-sm">Images</p>
            <p className="text-2xl font-bold text-white">{Math.floor(balance / 200)}</p>
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-xl border p-4">
            <Film className="w-5 h-5 text-orange-400 mb-2" />
            <p className="text-white/80 text-sm">Videos</p>
            <p className="text-2xl font-bold text-white">{Math.floor(balance / 1000)}</p>
          </div>
        </div>
      </div>

      {/* Top-Up Plans */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-purple-400" />
          <span>Top-Up Plans</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOP_UP_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "backdrop-blur-xl rounded-2xl border p-6 hover:scale-105 transition-all",
                tier.highlighted
                  ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/40 shadow-xl"
                  : "bg-white/5 border-white/10"
              )}
            >
              {tier.highlighted && (
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white mb-4 inline-block">
                  POPULAR
                </span>
              )}
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-white">{tier.name}</h4>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-4">
                  {tier.tokens.toLocaleString()}
                </p>
                <p className="text-white/60">Tokens</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {tier.priceDAI} <span className="text-amber-400">DAI</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowTopUpModal({ open: true, tier });
                  setPaymentStatus({ step: 'idle', message: '' });
                }}
                className={cn(
                  "w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-2",
                  tier.highlighted
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                <Wallet className="w-5 h-5" />
                <span>Pay {tier.priceDAI} DAI</span>
              </button>
              <p className="text-center text-white/40 text-xs mt-3 flex items-center justify-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Polygon Network</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <Key className="w-6 h-6 text-cyan-400" />
          <span>API Keys</span>
        </h3>
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-semibold">Generate Keys</p>
              <p className="text-white/60 text-sm">Use in your applications</p>
            </div>
            <button
              onClick={generateAPIKey}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-semibold flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </div>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <Key className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No keys yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((k, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-black/30 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-cyan-400" />
                    <p className="text-white font-mono text-sm">{k.key}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyAPIKey(k.key)}
                      className="p-2 text-white/60 hover:text-cyan-400"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setApiKeys(p => p.filter((_, j) => j !== i))}
                      className="p-2 text-white/60 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showTopUpModal.open && showTopUpModal.tier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md backdrop-blur-xl bg-gray-900/95 border border-white/20 rounded-3xl p-6">
            {paymentStatus.step === 'idle' || paymentStatus.step === 'error' ? (
              <>
                <div className="text-center mb-6">
                  <Wallet className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">Confirm Payment</h3>
                  <p className="text-white/60 mt-2">
                    {showTopUpModal.tier.tokens.toLocaleString()} tokens for {showTopUpModal.tier.priceDAI} DAI
                  </p>
                  {paymentStatus.step === 'error' && (
                    <div className="mt-4 p-3 bg-red-500/20 rounded-xl text-red-400 text-sm">
                      {paymentStatus.message}
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowTopUpModal({ open: false });
                      setPaymentStatus({ step: 'idle', message: '' });
                    }}
                    className="flex-1 py-3 bg-white/10 rounded-xl text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleTopUp(showTopUpModal.tier!)}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-semibold"
                  >
                    Pay with MetaMask
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                {paymentStatus.step === 'connecting' && (
                  <Wallet className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-spin" />
                )}
                {paymentStatus.step === 'waiting_tx' && (
                  <CreditCard className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                )}
                {paymentStatus.step === 'verifying' && (
                  <RefreshCw className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
                )}
                {paymentStatus.step === 'success' && (
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                )}
                <h3 className="text-xl font-bold text-white">{paymentStatus.message}</h3>
                {paymentStatus.txHash && (
                  <a
                    href={`https://polygonscan.com/tx/${paymentStatus.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 text-sm mt-2 block"
                  >
                    View on PolygonScan
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // RENDER: TEXT & CODE CHAT
  const renderTextCodeChat = () => {
    const canSend = (inputValue.trim() || attachments.length > 0) && balance > 0;

    return (
      <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full">
        {/* Low Balance Warning */}
        {balance <= 0 && (
          <div className="bg-red-500/20 border-b border-red-500/30 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">Insufficient tokens. Top up in AI Settings</span>
            </div>
            <button
              onClick={() => setActiveCategory('settings')}
              className="px-3 py-1 bg-red-500/30 rounded-lg text-red-300 text-sm"
            >
              Top Up
            </button>
          </div>
        )}

        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-white font-semibold flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>Chat</span>
            </h2>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowLLMDropdown(!showLLMDropdown)}
                className="flex items-center space-x-2 px-4 py-2 backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-white text-sm"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="truncate">{getLLMName(selectedLLM)}</span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', showLLMDropdown ? 'rotate-180' : '')} />
              </button>
              {showLLMDropdown && (
                <div className="absolute top-full left-0 mt-2 w-[420px] backdrop-blur-xl bg-gray-900/98 border border-white/20 rounded-2xl max-h-[600px] overflow-y-auto z-50">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-bold">Select Model</h3>
                  </div>
                  <div className="p-2">
                    {LLM_GROUPS.map((group, gi) => (
                      <div key={group.name} className={cn(gi > 0 && 'mt-2')}>
                        <div className="px-3 py-2 text-xs font-semibold text-white/60">
                          {group.icon} {group.name}
                        </div>
                        <div className="space-y-1">
                          {group.models.map((model) => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedLLM(model.id);
                                setShowLLMDropdown(false);
                              }}
                              className={cn(
                                'w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm',
                                selectedLLM === model.id
                                  ? `bg-${group.color}-500/20 text-white border border-${group.color}-500/40`
                                  : 'text-white/70 hover:bg-white/5'
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={cn('w-2 h-2 rounded-full', selectedLLM === model.id ? `bg-${group.color}-400` : 'bg-white/20')} />
                                <div className="text-left">
                                  <p className="font-medium">{model.name}</p>
                                  <p className="text-xs text-white/40">{model.description}</p>
                                </div>
                              </div>
                              {selectedLLM === model.id && <Check className="w-4 h-4 text-green-400" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleClearChat} className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl">AI Chat</h3>
                <p className="text-white/60 text-sm mt-2">Select a model and start chatting</p>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[85%] rounded-2xl p-5 backdrop-blur-md', msg.role === 'user' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-white/5 border border-white/10')}>
                  <div className="text-white/90 text-sm whitespace-pre-wrap">{msg.content}</div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <span className="text-white/30 text-xs">{msg.timestamp.toLocaleTimeString()}</span>
                    {msg.role === 'assistant' && (
                      <div className="flex space-x-1">
                        <button onClick={() => handleCopyMessage(msg.content)} className="p-1.5 text-white/40 hover:text-white">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleRegenerate(i)} className="p-1.5 text-white/40 hover:text-cyan-400">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-white/40 hover:text-green-400">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-white/40 hover:text-red-400">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl p-5 backdrop-blur-md bg-white/5">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-white/60 text-sm">AI thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-2">
            <div className="flex items-end space-x-2">
              <div className="flex items-center space-x-1 pb-2">
                <input ref={fileInputRef} type="file" multiple onChange={handleAttachment} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-white/60 hover:text-cyan-400 hover:bg-cyan-500/20 rounded-xl">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button onClick={() => setWebSearchEnabled(!webSearchEnabled)} className={cn('p-2.5 rounded-xl', webSearchEnabled ? 'text-cyan-400 bg-cyan-500/20' : 'text-white/60 hover:text-cyan-400')}>
                  <Globe className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Message AI..."
                  rows={1}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>
              <div className="flex items-center space-x-1 pb-2">
                <button onClick={handleVoiceInput} className={cn('p-2.5 rounded-xl', isRecording ? 'text-red-400 bg-red-500/20 animate-pulse' : 'text-white/60 hover:text-purple-400')}>
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !canSend}
                  className={cn('p-3 rounded-xl', isLoading || !canSend ? 'bg-white/10 text-white/40' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105')}
                >
                  {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // RENDER: MUSIC STUDIO
  const renderMusicStudio = () => {
    const canGen = (lyrics.trim() || musicStyle.trim()) && balance > 0;
    return (
      <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Music className="w-6 h-6 text-purple-400" />
            <span>Music Studio</span>
          </h2>
          <p className="text-white/60 text-sm mt-1">500 tokens per track</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">AI Model</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MUSIC_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMusicModel(m.id)}
                  className={cn('p-4 rounded-xl border text-left', selectedMusicModel === m.id ? 'bg-purple-500/30 border-purple-500/30 text-white' : 'bg-white/5 border-white/10 text-white/70')}
                >
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-white/40 mt-1">{m.provider}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Style</label>
            <input type="text" value={musicStyle} onChange={(e) => setMusicStyle(e.target.value)} placeholder="Cyberpunk Synthwave..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Lyrics</label>
            <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} placeholder="Your lyrics..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none h-32" />
          </div>
          <button
            onClick={handleGenerateMusic}
            disabled={isGeneratingMusic || !canGen}
            className={cn('w-full py-4 rounded-xl font-semibold', isGeneratingMusic || !canGen ? 'bg-white/10 text-white/40' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white')}
          >
            {isGeneratingMusic ? (
              <span className="flex items-center justify-center space-x-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <Music className="w-5 h-5" />
                <span>🎵 Generate (500 tokens)</span>
              </span>
            )}
          </button>
          {!canGen && balance <= 0 && (
            <p className="text-red-400 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Insufficient tokens</span>
            </p>
          )}
          {generatedTrack && (
            <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">{generatedTrack.title}</h3>
                  <p className="text-white/60 text-sm">{generatedTrack.duration}</p>
                </div>
                <button className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white ml-1" />
                </button>
              </div>
              <div className="flex items-center space-x-1 h-16">
                {generatedTrack.waveform.map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full" style={{ height: Math.max(20, h) + '%' }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // RENDER: IMAGE STUDIO
  const renderImageStudio = () => {
    const canGen = imagePrompt.trim() && balance > 0;
    return (
      <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Palette className="w-6 h-6 text-pink-400" />
            <span>Image Studio</span>
          </h2>
          <p className="text-white/60 text-sm mt-1">200 tokens per image</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">AI Model</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {IMAGE_MODELS.map((m) => (
                <button key={m.id} onClick={() => setSelectedImageModel(m.id)} className={cn('p-4 rounded-xl border text-left', selectedImageModel === m.id ? 'bg-pink-500/30 border-pink-500/30 text-white' : 'bg-white/5 border-white/10 text-white/70')}>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-white/40 mt-1">{m.provider}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">Aspect Ratio</label>
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                {ASPECT_RATIOS.map((r) => (<option key={r.id} value={r.id} className="bg-gray-900">{r.name}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">Style</label>
              <select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                {IMAGE_STYLES.map((s) => (<option key={s.id} value={s.id} className="bg-gray-900">{s.name}</option>))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Prompt</label>
            <textarea value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} placeholder="A cyberpunk city..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none h-24" />
          </div>
          <button onClick={handleGenerateImage} disabled={isGeneratingImage || !canGen} className={cn('w-full py-4 rounded-xl font-semibold', isGeneratingImage || !canGen ? 'bg-white/10 text-white/40' : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white')}>
            {isGeneratingImage ? (<span className="flex items-center justify-center space-x-2"><RefreshCw className="w-5 h-5 animate-spin" /><span>Generating...</span></span>) : (<span className="flex items-center justify-center space-x-2"><Palette className="w-5 h-5" /><span>🎨 Generate (200 tokens)</span></span>)}
          </button>
          {!canGen && balance <= 0 && (<p className="text-red-400 text-sm flex items-center space-x-2"><AlertCircle className="w-4 h-4" /><span>Insufficient tokens</span></p>)}
          {generatedImages.length > 0 && (<div className="grid grid-cols-2 gap-4">{generatedImages.map((img) => (<div key={img.id} className="aspect-square rounded-xl overflow-hidden border border-white/10"><img src={img.url} alt={img.prompt} className="w-full h-full object-cover" /></div>))}</div>)}
        </div>
      </div>
    );
  };

  // RENDER: VIDEO STUDIO
  const renderVideoStudio = () => {
    const canGen = videoPrompt.trim() && balance > 0;
    return (
      <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Film className="w-6 h-6 text-orange-400" />
            <span>Video Studio</span>
          </h2>
          <p className="text-white/60 text-sm mt-1">1000 tokens per video</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">AI Model</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VIDEO_MODELS.map((m) => (
                <button key={m.id} onClick={() => setSelectedVideoModel(m.id)} className={cn('p-4 rounded-xl border text-left', selectedVideoModel === m.id ? 'bg-orange-500/30 border-orange-500/30 text-white' : 'bg-white/5 border-white/10 text-white/70')}>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-white/40 mt-1">{m.provider}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Prompt</label>
            <textarea value={videoPrompt} onChange={(e) => setVideoPrompt(e.target.value)} placeholder="A cinematic drone shot..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none h-24" />
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Reference Image</label>
            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-cyan-400/50 cursor-pointer">
              <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Click to upload</p>
            </div>
          </div>
          <button onClick={handleGenerateVideo} disabled={isGeneratingVideo || !canGen} className={cn('w-full py-4 rounded-xl font-semibold', isGeneratingVideo || !canGen ? 'bg-white/10 text-white/40' : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white')}>
            {isGeneratingVideo ? (<span className="flex items-center justify-center space-x-2"><RefreshCw className="w-5 h-5 animate-spin" /><span>Generating...</span></span>) : (<span className="flex items-center justify-center space-x-2"><Film className="w-5 h-5" /><span>🎬 Generate (1000 tokens)</span></span>)}
          </button>
          {!canGen && balance <= 0 && (<p className="text-red-400 text-sm flex items-center space-x-2"><AlertCircle className="w-4 h-4" /><span>Insufficient tokens</span></p>)}
          {generatedVideo && (
            <div className="aspect-video rounded-2xl overflow-hidden border bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center mb-4">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-white/60 text-sm">Demo Preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // RENDER: AGENTS DASHBOARD
  const renderAgentsDashboard = () => {
    const limitPct = (agentLimit.current_count / agentLimit.max_allowed) * 100;
    return (
      <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">🤖 Agents</h2>
              <p className="text-white/60 text-sm">Create AI workers</p>
            </div>
            {agentLimit.subscription_tier === 'free' && (
              <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white font-semibold text-sm flex items-center space-x-2">
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
            )}
          </div>
          <div className="backdrop-blur-md bg-white/5 rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm">{agentLimit.current_count}/{agentLimit.max_allowed} Agents</span>
              <span className={cn("text-sm font-bold", limitPct >= 80 ? "text-red-400" : "text-green-400")}>{Math.round(limitPct)}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className={cn("h-full transition-all", limitPct >= 80 ? "bg-red-500" : limitPct >= 50 ? "bg-yellow-500" : "bg-green-500")} style={{ width: limitPct + '%' }} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <button
            onClick={() => agentLimit.can_create && setShowCreateAgentModal(true)}
            disabled={!agentLimit.can_create}
            className={cn("aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center", agentLimit.can_create ? "border-white/20 hover:border-cyan-400 hover:bg-cyan-500/10" : "border-white/10 opacity-50")}
          >
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", agentLimit.can_create ? "bg-cyan-500/20" : "bg-white/10")}>
              <Plus className={cn("w-8 h-8", agentLimit.can_create ? "text-cyan-400" : "text-white/40")} />
            </div>
            <span className={cn("font-semibold mt-4", agentLimit.can_create ? "text-white" : "text-white/40")}>Create Agent</span>
          </button>
          {agents.map((agent) => (
            <div key={agent.id} className={cn("aspect-[4/3] backdrop-blur-md rounded-2xl border p-5", agent.is_active ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/10")}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", "bg-" + agent.avatar_color + "-500/20")}>
                    <Bot className={cn("w-6 h-6", "text-" + agent.avatar_color + "-400")} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{agent.name}</h3>
                    <p className="text-xs text-white/40">{agent.execution_count} runs</p>
                  </div>
                </div>
                <button onClick={() => toggleAgent(agent.id)} className={cn(agent.is_active ? "text-cyan-400" : "text-white/40")}>
                  {agent.is_active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
              <p className="text-white/60 text-sm flex-1 line-clamp-2">{agent.description || agent.role_prompt.slice(0, 100)}...</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <button className="text-white/60 text-sm flex items-center space-x-1">
                  <Settings className="w-4 h-4" />
                  <span>Config</span>
                </button>
                <button onClick={() => deleteAgent(agent.id)} className="p-2 text-white/40 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // RENDER: CREATE AGENT MODAL
  const renderCreateAgentModal = () => {
    if (!showCreateAgentModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="w-full max-w-2xl backdrop-blur-xl bg-gray-900/95 border border-white/20 rounded-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/95">
            <div>
              <h2 className="text-2xl font-bold text-white">Create Agent</h2>
              <p className="text-white/60 text-sm">Configure your AI worker</p>
            </div>
            <button onClick={() => setShowCreateAgentModal(false)} className="p-2 text-white/60 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">Name</label>
              <input type="text" value={newAgentName} onChange={(e) => setNewAgentName(e.target.value)} placeholder="e.g., Researcher" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white" maxLength={50} />
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">System Prompt</label>
              <textarea value={newAgentPrompt} onChange={(e) => setNewAgentPrompt(e.target.value)} placeholder="You are an analyst..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none h-32" maxLength={10000} />
              <p className="text-right text-xs text-white/40">{newAgentPrompt.length}/10000</p>
            </div>
            <div className="space-y-3">
              <label className="text-white/80 text-sm font-medium">Tools</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_TOOLS.map((tool) => (
                  <button key={tool.id} onClick={() => toggleTool(tool.id)} className={cn("p-4 rounded-xl border text-left flex items-center space-x-3", selectedTools.includes(tool.id) ? "bg-" + tool.color + "-500/20 border-" + tool.color + "-500/30" : "bg-white/5 border-white/10")}>
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", selectedTools.includes(tool.id) ? "bg-" + tool.color + "-500/30" : "bg-white/10")}>
                      <tool.icon className={cn("w-5 h-5", selectedTools.includes(tool.id) ? "text-" + tool.color + "-400" : "text-white/60")} />
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-sm font-medium", selectedTools.includes(tool.id) ? "text-white" : "text-white/80")}>{tool.name}</p>
                      <p className="text-xs text-white/40">{tool.description}</p>
                    </div>
                    {selectedTools.includes(tool.id) && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-white/80 text-sm font-medium">Color</label>
              <div className="flex space-x-3">
                {AGENT_COLORS.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)} className={cn("w-10 h-10 rounded-full border-2", "bg-" + c + "-500/50", selectedColor === c ? "border-" + c + "-400 scale-110" : "border-white/10")} />
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-white/10 sticky bottom-0 bg-gray-900/95">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">
                <span className={cn("font-bold", agentLimit.can_create ? "text-green-400" : "text-red-400")}>{agentLimit.current_count}/{agentLimit.max_allowed}</span> agents used
              </p>
              <div className="flex space-x-3">
                <button onClick={() => setShowCreateAgentModal(false)} className="px-6 py-3 bg-white/10 text-white rounded-xl">Cancel</button>
                <button onClick={handleCreateAgent} disabled={!newAgentName.trim() || !newAgentPrompt.trim() || !agentLimit.can_create} className={cn("px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold", (!newAgentName.trim() || !newAgentPrompt.trim() || !agentLimit.can_create) ? "opacity-50" : "hover:from-cyan-400 hover:to-purple-400")}>
                  🚀 Deploy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // MAIN RENDER
  const renderMainContent = () => {
    switch (activeCategory) {
      case 'text-code': return renderTextCodeChat();
      case 'music': return renderMusicStudio();
      case 'images': return renderImageStudio();
      case 'video': return renderVideoStudio();
      case 'agents': return renderAgentsDashboard();
      case 'settings': return renderAISettings();
      default: return renderTextCodeChat();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
            🤖 AI Hub
          </h1>
          <p className="text-white/60">Premium AI with Polygon billing</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
          <div className="lg:col-span-1 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-white font-semibold flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>Categories</span>
              </h2>
            </div>
            <div className="p-3 space-y-2 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn('w-full flex items-center space-x-3 px-4 py-3 rounded-xl', activeCategory === cat.id ? 'bg-gradient-to-r from-' + cat.color + '-500/30 to-' + cat.color + '-600/30 border border-' + cat.color + '-500/30 text-white' : 'text-white/60 hover:text-white hover:bg-white/5')}
                >
                  <cat.icon className={cn('w-5 h-5', activeCategory === cat.id ? 'text-' + cat.color + '-400' : '')} />
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-between px-2 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  <span className="text-white/80 text-xs">Balance</span>
                </div>
                <span className="text-cyan-400 font-bold text-sm">{balance.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            {renderMainContent()}
          </div>
        </div>
      </div>
      {renderCreateAgentModal()}
    </div>
  );
};

export const AIHubComponent = AIHub;
export default AIHub;
