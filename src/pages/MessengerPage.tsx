import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Phone, Video, Users, Palette, Mic,
  MessageSquare, Hash, Volume2, Lock, Flame,
  Plus, Settings, Copy, Reply, Smile,
  Paperclip, Send, Bot, Radio, Zap, Heart, Crown, CheckCheck, Trash2, ToggleLeft,
  Languages, Sparkles, AlertCircle, CheckCircle, Loader2, Globe,
  PenLine, Star, Clock, Gift, Trophy, Zap as ZapIcon, ChevronLeft, ChevronRight, ChevronDown, X, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { AITranslator } from '@/components/messenger/AITranslator';
import { AIConferenceAssistant } from '@/components/messenger/AIConferenceAssistant';
import { useStatus, StatusPicker, StatusAvatar, formatLastSeen, STATUS_CONFIGS } from '@/lib/useStatus';

type ChatType = 'direct' | 'group' | 'channel' | 'secret' | 'zello' | 'bot';
type TabType = 'direct' | 'groups' | 'channels' | 'zello' | 'bots';
type CallType = 'audio' | 'video' | 'conference' | null;

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  maritalStatus?: { marriedTo: string; username: string };
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice' | 'system';
  isTranslated?: boolean;
  translation?: { text: string; language: string; originalText: string };
  originalText?: string;
  isTranslating?: boolean;
  translationError?: boolean;
}

interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatar?: string;
  members?: number;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  isSecret?: boolean;
  theme?: string;
  selfDestructTimer?: number;
  language?: string;
  isTyping?: boolean;
  isPremium?: boolean;
  hasStory?: boolean;
  storyUnseen?: boolean;
}

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  contentType: 'text' | 'image' | 'voice';
  timestamp: Date;
  expiresAt: Date;
  isSeen: boolean;
  isPremium?: boolean;
}

interface ZelloChannel {
  id: string;
  name: string;
  frequency: string;
  members: { id: string; name: string; avatar: string; isTalking: boolean }[];
}

interface BotConfig {
  name: string;
  persona: string;
  flows: string[];
  integrations: string[];
}

interface Subtitle {
  id: string;
  originalText: string;
  translatedText: string;
  language: string;
  timestamp: number;
}

interface TranslationSettings {
  enabled: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  autoDetect: boolean;
  showOriginal: boolean;
}

const CURRENT_USER: User = {
  id: 'me',
  name: 'Alex Freedom',
  avatar: 'https://picsum.photos/seed/me/100/100',
  status: 'online',
  maritalStatus: { marriedTo: 'crypto_queen', username: '@crypto_queen' },
};

const MOCK_CHATS: Chat[] = [
  { id: '1', type: 'direct', name: 'Crypto Queen', avatar: 'https://picsum.photos/seed/q1/100/100', lastMessage: 'I agree with the contract', timestamp: new Date(Date.now() - 60000), unread: 2, isSecret: true, theme: 'rose', selfDestructTimer: 3600, language: 'bg', isPremium: true, hasStory: true, storyUnseen: true },
  { id: '2', type: 'direct', name: 'John Doe', avatar: 'https://picsum.photos/seed/j1/100/100', lastMessage: 'See you tomorrow!', timestamp: new Date(Date.now() - 300000), unread: 0, language: 'en', hasStory: true, storyUnseen: false },
  { id: '3', type: 'group', name: 'DeFi Traders', avatar: 'https://picsum.photos/seed/g1/100/100', members: 247, lastMessage: 'BTC just hit new ATH!', timestamp: new Date(Date.now() - 600000), unread: 15, language: 'en', isPremium: true },
  { id: '4', type: 'channel', name: 'Freedom Hub News', avatar: 'https://picsum.photos/seed/c1/100/100', members: 12500, lastMessage: 'New feature: AI Voice Translate', timestamp: new Date(Date.now() - 3600000), unread: 3, language: 'en', isPremium: true, hasStory: true, storyUnseen: true },
  { id: '5', type: 'secret', name: '🔒 Secret Chat', avatar: 'https://picsum.photos/seed/s1/100/100', lastMessage: 'This message will self-destruct', timestamp: new Date(Date.now() - 7200000), unread: 0, isSecret: true, selfDestructTimer: 300, language: 'en' },
  { id: '6', type: 'bot', name: 'AI Assistant', avatar: 'https://picsum.photos/seed/a1/100/100', lastMessage: 'How can I help you today?', timestamp: new Date(Date.now() - 86400000), unread: 0, language: 'en' },
];

const MOCK_MESSAGES: Message[] = [
  { id: '1', senderId: 'them', content: 'Здравейте, как сте?', timestamp: new Date(Date.now() - 300000), type: 'text', isTranslated: true, translation: { text: 'Hello, how are you?', language: 'English', originalText: 'Здравейте, как сте?' }, originalText: 'Здравейте, как сте?' },
  { id: '2', senderId: 'me', content: 'I agree with the contract', timestamp: new Date(Date.now() - 240000), type: 'text' },
  { id: '3', senderId: 'them', content: 'Perfect! Let\'s proceed with the deal', timestamp: new Date(Date.now() - 180000), type: 'text' },
  { id: '4', senderId: 'me', content: 'When do we start?', timestamp: new Date(Date.now() - 120000), type: 'text' },
  { id: '5', senderId: 'them', content: 'Tomorrow at 10 AM UTC', timestamp: new Date(Date.now() - 60000), type: 'text' },
];

const ZELLO_CHANNELS: ZelloChannel[] = [
  { id: 'z1', name: 'Freedom Hub Main', frequency: '145.500 MHz', members: [
      { id: 'm1', name: 'Alex', avatar: 'https://picsum.photos/seed/z1/50/50', isTalking: false },
      { id: 'm2', name: 'Sarah', avatar: 'https://picsum.photos/seed/z2/50/50', isTalking: true },
      { id: 'm3', name: 'Mike', avatar: 'https://picsum.photos/seed/z3/50/50', isTalking: false },
      { id: 'm4', name: 'Emma', avatar: 'https://picsum.photos/seed/z4/50/50', isTalking: false },
    ]},
  { id: 'z2', name: 'Crypto Traders', frequency: '146.250 MHz', members: [
      { id: 'm5', name: 'Trader1', avatar: 'https://picsum.photos/seed/z5/50/50', isTalking: false },
      { id: 'm6', name: 'Trader2', avatar: 'https://picsum.photos/seed/z6/50/50', isTalking: false },
    ]},
];

const THEMES = {
  default: { bg: 'from-gray-900 via-purple-900 to-gray-900', bubble: 'bg-white/5' },
  rose: { bg: 'from-pink-900 via-rose-900 to-pink-900', bubble: 'bg-pink-500/20' },
  ocean: { bg: 'from-blue-900 via-cyan-900 to-blue-900', bubble: 'bg-cyan-500/20' },
  cyber: { bg: 'from-purple-900 via-cyan-900 to-purple-900', bubble: 'bg-purple-500/20' },
};

const LANGUAGES = [
  { code: 'auto', name: 'Авто', flag: '🌐' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI TRANSLATION SERVICE - FREE APIs ONLY
// ─────────────────────────────────────────────────────────────────────────────
class AITranslationService {
  // MyMemory API - бесплатно, 50K слов/день, не требует ключа
  private static readonly MYMEMORY_API = 'https://api.mymemory.translated.net/get';
  
  // Google Translate unofficial API - бесплатно, без лимитов
  private static readonly GOOGLE_API = 'https://translate.googleapis.com/translate_a/single';

  // Перевод текста
  static async translateText(text: string, from: string, to: string): Promise<string> {
    if (!text.trim()) return text;
    if (from === to) return text;
    
    const sourceLang = from === 'auto' ? await this.detectLanguage(text) : from;
    
    try {
      // Приоритет: MyMemory API
      const url = `${this.MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${to}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
      
      // Fallback: Google Translate
      const googleUrl = `${this.GOOGLE_API}?client=gtx&sl=${sourceLang}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
      const googleResponse = await fetch(googleUrl);
      const googleData = await googleResponse.json();
      
      if (googleData?.[0]) {
        return googleData[0].map((item: string[]) => item[0]).join('');
      }
      
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  // Автоопределение языка
  static async detectLanguage(text: string): Promise<string> {
    try {
      const url = `${this.MYMEMORY_API}?q=${encodeURIComponent(text.substring(0, 100))}&langpair=|`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.responseData?.matchedTranslation) {
        return data.responseData.matchedTranslation;
      }
      
      // Эвристическое определение
      if (/[\u0400-\u04FF]/.test(text)) return 'ru';
      if (/[\u0600-\u06FF]/.test(text)) return 'ar';
      if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
      if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
      if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
      if (/[\u0100-\u017F]/.test(text)) return 'de';
      
      return 'en';
    } catch {
      return 'en';
    }
  }

  // Озвучивание текста (Web Speech API - бесплатно)
  static async speakText(text: string, lang: string): Promise<void> {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  // Распознавание речи (Web Speech API - бесплатно)
  static createSpeechRecognition(lang: string, onResult: (text: string, isFinal: boolean) => void, onEnd: () => void) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (finalTranscript) onResult(finalTranscript, true);
      if (interimTranscript) onResult(interimTranscript, false);
    };
    
    recognition.onerror = () => onEnd();
    recognition.onend = () => onEnd();
    
    return recognition;
  }
}

const Messenger: React.FC = () => {
  // Основные состояния
  const [activeTab, setActiveTab] = useState<TabType>('direct');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(MOCK_CHATS[0]);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);

  // Live Typing Translation состояния
  const [inputText, setInputText] = useState('');
  const [liveTranslation, setLiveTranslation] = useState('');
  const [isAITranslating, setIsAITranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('bg');

  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [activeCall, setActiveCall] = useState<CallType>(null);
  const [isPTTActive, setIsPTTActive] = useState(false);
  const [selectedZelloChannel, setSelectedZelloChannel] = useState<ZelloChannel>(ZELLO_CHANNELS[0]);
  const [showBotBuilder, setShowBotBuilder] = useState(false);
  const [botConfig, setBotConfig] = useState<BotConfig>({ name: '', persona: '', flows: [], integrations: [] });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageId: string } | null>(null);

  // Stories состояния
  const [stories, setStories] = useState<Story[]>([
    { id: 's1', userId: '1', userName: 'Crypto Queen', userAvatar: 'https://picsum.photos/seed/q1/100/100', content: 'Just closed a major deal! 🎉', contentType: 'text', timestamp: new Date(Date.now() - 3600000), expiresAt: new Date(Date.now() + 82800000), isSeen: false, isPremium: true },
    { id: 's2', userId: '4', userName: 'Freedom Hub News', userAvatar: 'https://picsum.photos/seed/c1/100/100', content: 'New AI features released!', contentType: 'image', timestamp: new Date(Date.now() - 7200000), expiresAt: new Date(Date.now() + 79200000), isSeen: false, isPremium: true },
  ]);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Premium состояния
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Настройки перевода
  const [translationSettings, setTranslationSettings] = useState<TranslationSettings>({
    enabled: true,
    sourceLanguage: 'auto',
    targetLanguage: 'bg',
    autoDetect: true,
    showOriginal: true,
  });
  const [showTranslationSettings, setShowTranslationSettings] = useState(false);
  const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({});
  
  // Состояния звонка
  const [callSubtitles, setCallSubtitles] = useState<Subtitle[]>([]);
  const [isAsyncTranslateOn, setIsAsyncTranslateOn] = useState(true);
  const [isSubtitlesOn, setIsSubtitlesOn] = useState(true);
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // Typing indicator states
  const [isTyping, setIsTyping] = useState(false);
  const [chatChannel, setChatChannel] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const liveTranslateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ───────────────────────────────────────────────────────────────────────────
  // TYPING INDICATOR - Real-time WebSocket через Supabase Realtime
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedChat) {
      if (chatChannel) {
        chatChannel.unsubscribe();
        setChatChannel(null);
      }
      return;
    }

    // Подписка на канал чата через Supabase Realtime
    const channel = supabase.channel(`chat:${selectedChat.id}`);
    
    channel.on('broadcast', { event: 'typing' }, (payload: any) => {
      // Если собеседник печатает
      if (payload.payload.userId !== 'me') {
        setIsTyping(true);
        
        // Сброс индикатора через 2 секунды
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });

    channel.subscribe();
    setChatChannel(channel);

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [selectedChat?.id]);

  // Отправка события "печатает" при вводе текста
  useEffect(() => {
    if (!inputText.trim() || !chatChannel) {
      return;
    }

    // Отправляем событие "печатает"
    chatChannel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        chatId: selectedChat?.id,
        userId: 'me',
        isTyping: true,
      },
    });
  }, [inputText, chatChannel, selectedChat?.id]);

  // ───────────────────────────────────────────────────────────────────────────
  // DEMO: Эмуляция входящего "печатает..." для демонстрации
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Эмуляция: через 5 секунд после открытия чата собеседник начинает "печатать"
    const demoTimeout = setTimeout(() => {
      if (selectedChat && !isTyping) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    }, 5000);
    
    return () => clearTimeout(demoTimeout);
  }, [selectedChat?.id]);

  // ───────────────────────────────────────────────────────────────────────────
  // LIVE TYPING TRANSLATION - Real-time AI Translation
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!inputText.trim()) {
      setLiveTranslation('');
      setIsAITranslating(false);
      return;
    }
    
    setIsAITranslating(true);
    
    // Debounce: ждём 500мс после последнего изменения
    if (liveTranslateTimeoutRef.current) {
      clearTimeout(liveTranslateTimeoutRef.current);
    }
    
    liveTranslateTimeoutRef.current = setTimeout(async () => {
      try {
        const translated = await AITranslationService.translateText(
          inputText,
          'auto',
          targetLanguage
        );
        setLiveTranslation(translated);
      } catch (error) {
        console.error('Live translation error:', error);
        setLiveTranslation('');
      } finally {
        setIsAITranslating(false);
      }
    }, 500); // 500ms debounce для имитации ИИ
    
    return () => {
      if (liveTranslateTimeoutRef.current) {
        clearTimeout(liveTranslateTimeoutRef.current);
      }
    };
  }, [inputText, targetLanguage]);

  // Автоперевод входящих сообщений
  useEffect(() => {
    const translateIncomingMessages = async () => {
      if (!translationSettings.enabled) return;
      
      for (const message of messages) {
        if (message.senderId === 'them' && !message.isTranslated && !message.isTranslating) {
          await handleTranslateMessage(message.id, message.content);
        }
      }
    };
    
    translateIncomingMessages();
  }, [messages, translationSettings.enabled]);

  // Загрузка голосов
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const ruVoice = voices.find(v => v.lang.includes('ru'));
      if (ruVoice) setSelectedVoice(ruVoice);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Перевод сообщения
  const handleTranslateMessage = useCallback(async (messageId: string, text: string) => {
    setIsTranslating(prev => ({ ...prev, [messageId]: true }));
    
    try {
      const translated = await AITranslationService.translateText(
        text,
        translationSettings.sourceLanguage,
        translationSettings.targetLanguage
      );
      
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const targetLang = LANGUAGES.find(l => l.code === translationSettings.targetLanguage);
          return {
            ...msg,
            isTranslated: true,
            translation: {
              text: translated,
              language: targetLang?.name || 'Unknown',
              originalText: msg.content,
            },
            originalText: msg.content,
            isTranslating: false,
          };
        }
        return msg;
      }));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isTranslating: false, translationError: true } : msg
      ));
    } finally {
      setIsTranslating(prev => ({ ...prev, [messageId]: false }));
    }
  }, [translationSettings.sourceLanguage, translationSettings.targetLanguage]);

  // Отправка сообщения
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    let content = inputText.trim();
    let translation = null;
    
    // Перевод для получателя
    if (translationSettings.enabled && selectedChat?.language) {
      try {
        const translated = await AITranslationService.translateText(
          content,
          'auto',
          selectedChat.language
        );
        
        if (translated !== content) {
          translation = {
            text: translated,
            language: LANGUAGES.find(l => l.code === selectedChat.language)?.name || 'Unknown',
            originalText: content,
          };
          content = translated;
        }
      } catch (error) {
        console.error('Outgoing translation error:', error);
      }
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content,
      timestamp: new Date(),
      type: 'text',
      ...(translation && { translation, isTranslated: true, originalText: inputText.trim() }),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setLiveTranslation('');
  };

  // Озвучивание
  const handleSpeakTranslation = async (text: string, lang: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    setIsSpeaking(true);
    await AITranslationService.speakText(text, lang);
    setIsSpeaking(false);
  };

  // Распознавание речи для звонков
  const startCallSpeechRecognition = useCallback(() => {
    if (!isAsyncTranslateOn || !isSubtitlesOn) return;
    
    recognitionRef.current = AITranslationService.createSpeechRecognition(
      'en-US',
      async (text: string, isFinal: boolean) => {
        if (isFinal) {
          setRecognizedSpeech(text);
          
          if (isAsyncTranslateOn) {
            const translated = await AITranslationService.translateText(
              text,
              'en',
              targetLanguage
            );
            
            setCallSubtitles(prev => [...prev, {
              id: Date.now().toString(),
              originalText: text,
              translatedText: translated,
              language: targetLanguage,
              timestamp: Date.now(),
            }].slice(-5));
          }
        }
      },
      () => {
        if (activeCall && isAsyncTranslateOn) {
          setTimeout(startCallSpeechRecognition, 1000);
        }
      }
    );
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  }, [activeCall, isAsyncTranslateOn, isSubtitlesOn, targetLanguage]);

  const handlePTT = (pressed: boolean) => setIsPTTActive(pressed);

  const handleStartCall = (type: CallType) => {
    setActiveCall(type);
    if (isAsyncTranslateOn && isSubtitlesOn) {
      setTimeout(startCallSpeechRecognition, 2000);
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setCallSubtitles([]);
    setRecognizedSpeech('');
  };
  
  const handleCreateBot = () => { setShowBotBuilder(true); setShowCreateMenu(false); };

  const renderCreateMenu = () => (
    <div className="absolute top-full right-0 mt-2 w-64 backdrop-blur-xl bg-gray-900/95 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
      <div className="p-2">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-xl transition-all">
          <Users className="w-5 h-5 text-cyan-400" /><span>Создать группу</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-xl transition-all">
          <Hash className="w-5 h-5 text-purple-400" /><span>Создать канал</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-xl transition-all">
          <Lock className="w-5 h-5 text-green-400" /><span>Секретный чат</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-xl transition-all">
          <Video className="w-5 h-5 text-pink-400" /><span>Новая конференция</span>
        </button>
        <button onClick={handleCreateBot} className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-xl transition-all">
          <Bot className="w-5 h-5 text-amber-400" /><span>Создать ИИ-бота</span>
        </button>
      </div>
    </div>
  );

  // Status Selector Component
  const StatusSelector = () => {
    const { myStatus, setMyStatus } = useStatus();
    const [showPicker, setShowPicker] = useState(false);

    if (!myStatus) return null;

    const config = STATUS_CONFIGS[myStatus.status];

    return (
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all',
            config.bgColor,
            config.borderColor
          )}
        >
          <StatusAvatar
            avatarUrl={CURRENT_USER.avatar}
            status={myStatus.status}
            size="sm"
            showBorder={false}
          />
          <div className="text-left">
            <p className="text-white font-semibold text-sm">{CURRENT_USER.name}</p>
            <div className="flex items-center space-x-1">
              <span className={cn('text-xs font-medium', config.color)}>{config.label}</span>
              {myStatus.customMessage && (
                <span className="text-white/60 text-xs">• {myStatus.customMessage}</span>
              )}
            </div>
          </div>
          <ChevronDown className={cn('w-4 h-4 text-white/60', showPicker && 'rotate-180 transition-transform')} />
        </button>

        {showPicker && (
          <div className="absolute top-full left-0 mt-2 w-72 p-4 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Изменить статус</h3>
              <button onClick={() => setShowPicker(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            <StatusPicker
              value={myStatus.status}
              onChange={(status) => {
                setMyStatus(status, myStatus.customMessage);
                setShowPicker(false);
              }}
              showCustomMessage
              showDuration
            />
          </div>
        )}
      </div>
    );
  };

  const renderSidebar = () => (
    <div className="w-80 backdrop-blur-xl bg-gray-900/50 border-r border-white/10 flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{CURRENT_USER.name}</p>
            </div>
          </div>
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <button onClick={() => setShowCreateMenu(!showCreateMenu)} className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 font-medium hover:from-cyan-500/30 hover:to-purple-500/30 transition-all">
            <Plus className="w-5 h-5" /><span>New</span>
          </button>
          {showCreateMenu && renderCreateMenu()}
        </div>
      </div>

      {/* Stories Bar */}
      <div className="px-4 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide pb-2">
          {/* Add Story Button */}
          <button
            onClick={() => setShowPremiumModal(true)}
            className="flex flex-col items-center space-y-1 min-w-[64px] p-2 rounded-xl hover:bg-white/5 transition-all"
          >
            <div className="relative w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-white/5 hover:border-cyan-400/50 transition-colors">
              <Plus className="w-5 h-5 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Add Story</span>
          </button>

          {/* Story Items */}
          {stories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => { setCurrentStoryIndex(index); setShowStoryViewer(true); }}
              className="flex flex-col items-center space-y-1 min-w-[64px] p-2 rounded-xl hover:bg-white/5 transition-all"
            >
              <div className={cn(
                'relative w-14 h-14 rounded-full p-0.5',
                story.isSeen
                  ? 'bg-gradient-to-br from-gray-500 to-gray-600'
                  : story.isPremium
                  ? 'bg-gradient-to-br from-amber-400 via-pink-500 to-cyan-500 animate-gradient-xy'
                  : 'bg-gradient-to-br from-cyan-400 to-purple-500'
              )}>
                <img
                  src={story.userAvatar}
                  alt={story.userName}
                  className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                />
                {story.isPremium && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                    <Star className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                )}
              </div>
              <span className="text-white/60 text-xs truncate w-full text-center">{story.userName.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex border-b border-white/10">
        {(['direct', 'groups', 'channels', 'zello', 'bots'] as TabType[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={cn('flex-1 px-3 py-3 text-xs font-medium transition-all', activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10' : 'text-white/60 hover:text-white hover:bg-white/5')}>
            {tab === 'direct' && 'Direct'}
            {tab === 'groups' && 'Groups'}
            {tab === 'channels' && 'Channels'}
            {tab === 'zello' && <Radio className="w-4 h-4 mx-auto" />}
            {tab === 'bots' && <Bot className="w-4 h-4 mx-auto" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {MOCK_CHATS.filter(chat => {
          if (activeTab === 'direct') return chat.type === 'direct' || chat.type === 'secret';
          if (activeTab === 'groups') return chat.type === 'group';
          if (activeTab === 'channels') return chat.type === 'channel';
          if (activeTab === 'zello') return false;
          if (activeTab === 'bots') return chat.type === 'bot';
          return true;
        }).map((chat) => {
          // Получаем статус пользователя (для direct чатов)
          const userStatus = chat.type === 'direct' || chat.type === 'secret' 
            ? { status: 'online' as const, lastSeen: new Date() } // Mock - в реальности из useStatus
            : null;

          return (
          <button key={chat.id} onClick={() => { setSelectedChat(chat); setShowCreateMenu(false); }} className={cn('w-full flex items-center space-x-3 p-3 rounded-xl transition-all', selectedChat?.id === chat.id ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5')}>
            <div className="relative">
              {/* Story Ring */}
              {chat.hasStory && (
                <div className={cn(
                  'absolute -inset-1 rounded-full bg-gradient-to-br from-amber-400 via-pink-500 to-cyan-500 blur-sm',
                  chat.storyUnseen ? 'opacity-100' : 'opacity-0'
                )} />
              )}
              {/* Avatar with status */}
              {userStatus ? (
                <StatusAvatar
                  avatarUrl={chat.avatar}
                  status={userStatus.status}
                  size="md"
                />
              ) : (
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
              )}
              {chat.isSecret && <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center z-20"><Lock className="w-2.5 h-2.5 text-white" /></div>}
              {/* Premium Badge */}
              {chat.isPremium && (
                <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center z-20 shadow-lg">
                  <Star className="w-2.5 h-2.5 text-white fill-white" />
                </div>
              )}
              {/* AI Translator Badge */}
              {chat.type !== 'direct' && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center z-20" title="AI Translator Available">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <p className="text-white font-medium text-sm truncate">{chat.name}</p>
                <span className="text-white/40 text-xs">{chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-xs truncate">{chat.lastMessage}</p>
                {chat.unread > 0 && <span className="px-2 py-0.5 bg-cyan-500 rounded-full text-white text-xs font-bold">{chat.unread}</span>}
              </div>
              {/* Status text for direct chats */}
              {userStatus && chat.type === 'direct' && (
                <p className={cn('text-xs mt-1', STATUS_CONFIGS[userStatus.status].color)}>
                  {userStatus.status === 'online' ? 'Онлайн' : formatLastSeen(userStatus.lastSeen)}
                </p>
              )}
            </div>
          </button>
        );})}

        {activeTab === 'zello' && (
          <div className="space-y-2">
            {ZELLO_CHANNELS.map((channel) => (
              <button key={channel.id} onClick={() => { setSelectedZelloChannel(channel); setSelectedChat(null); }} className={cn('w-full flex items-center space-x-3 p-3 rounded-xl transition-all', selectedZelloChannel?.id === channel.id ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5')}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center"><Radio className="w-6 h-6 text-white" /></div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-white font-medium text-sm truncate">{channel.name}</p>
                  <p className="text-white/40 text-xs">{channel.frequency} • {channel.members.length} online</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderChatHeader = () => {
    if (!selectedChat) return null;
    return (
      <div className="p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-xl bg-gray-900/50">
        <div className="flex items-center space-x-3">
          {selectedChat.avatar && <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />}
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-white font-semibold">{selectedChat.name}</p>
              {selectedChat.isSecret && (
                <div className="flex items-center space-x-1 px-2 py-0.5 bg-green-500/20 rounded-full">
                  <Lock className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-xs">PQ-E2E Secured</span>
                </div>
              )}
              {/* Premium Badge */}
              {selectedChat.isPremium && (
                <div className="flex items-center space-x-1 px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-full border border-amber-500/30">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 text-xs font-semibold">Premium</span>
                </div>
              )}
              {/* AI Translator Badge для групп, каналов и секретных чатов */}
              {selectedChat.type !== 'direct' && (
                <div className="flex items-center space-x-1 px-2 py-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30">
                  <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 text-xs font-medium">AI Translator</span>
                </div>
              )}
            </div>
            {selectedChat.selfDestructTimer && (
              <div className="flex items-center space-x-1 text-orange-400 text-xs">
                <Flame className="w-3 h-3" />
                <span>Self-destruct: {selectedChat.selfDestructTimer}s</span>
              </div>
            )}
            {selectedChat.language && (
              <div className="flex items-center space-x-1 text-cyan-400 text-xs mt-1">
                <Globe className="w-3 h-3" />
                <span>{LANGUAGES.find(l => l.code === selectedChat.language)?.name || 'Unknown'}</span>
              </div>
            )}
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-1 text-cyan-400 text-xs mt-1 animate-pulse">
                <PenLine className="w-3 h-3" />
                <span className="italic">печатает...</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Селектор языка - Auto: Bulgarian */}
          <button
            onClick={() => setShowTranslationSettings(!showTranslationSettings)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all"
          >
            <Languages className="w-4 h-4" />
            <span className="text-sm font-medium">Auto: Bulgarian</span>
          </button>
          <button onClick={() => handleStartCall('audio')} className="p-2.5 text-white/60 hover:text-green-400 hover:bg-green-500/20 rounded-xl transition-all"><Phone className="w-5 h-5" /></button>
          <button onClick={() => handleStartCall('video')} className="p-2.5 text-white/60 hover:text-cyan-400 hover:bg-cyan-500/20 rounded-xl transition-all"><Video className="w-5 h-5" /></button>
          <button onClick={() => handleStartCall('conference')} className="p-2.5 text-white/60 hover:text-purple-400 hover:bg-purple-500/20 rounded-xl transition-all"><Users className="w-5 h-5" /></button>
          <button className="p-2.5 text-white/60 hover:text-pink-400 hover:bg-pink-500/20 rounded-xl transition-all"><Palette className="w-5 h-5" /></button>
        </div>
      </div>
    );
  };

  const renderMessage = (msg: Message) => {
    const theme = THEMES.default;
    const isTranslatingThis = isTranslating[msg.id];

    return (
      <div key={msg.id} className={cn('flex', msg.senderId === 'me' ? 'justify-end' : 'justify-start')}>
        <div className={cn('max-w-[70%] rounded-2xl p-4 backdrop-blur-md', msg.senderId === 'me' ? cn(theme.bubble, 'border border-white/20') : 'bg-white/10 border border-white/20')}>
          <p className="text-white/90 text-sm">{msg.content}</p>

          {msg.isTranslated && msg.translation && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-purple-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Translated to {msg.translation.language}</span>
                </div>
                <button
                  onClick={() => handleSpeakTranslation(msg.translation!.text, 'ru')}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                >
                  <Volume2 className={cn('w-3.5 h-3.5', isSpeaking ? 'text-cyan-400' : 'text-white/60')} />
                </button>
              </div>
              <p className="text-white/60 text-xs mt-1">{msg.translation.text}</p>
              {translationSettings.showOriginal && msg.originalText && (
                <p className="text-white/40 text-xs mt-1">Original: {msg.originalText}</p>
              )}
            </div>
          )}

          {isTranslatingThis && (
            <div className="mt-2 flex items-center space-x-2 text-xs text-cyan-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Translating...</span>
            </div>
          )}

          {msg.translationError && (
            <div className="mt-2 flex items-center space-x-2 text-xs text-red-400">
              <AlertCircle className="w-3 h-3" />
              <span>Translation failed</span>
            </div>
          )}

          {/* AI Translator для групп, каналов и секретных чатов */}
          {selectedChat && selectedChat.type !== 'direct' && msg.senderId !== 'me' && !msg.isTranslated && (
            <AITranslator
              text={msg.content}
              sourceLanguage="auto"
              targetLanguage={translationSettings.targetLanguage}
              chatType={selectedChat.type as 'group' | 'channel' | 'secret'}
            />
          )}

          <div className="flex items-center justify-end space-x-2 mt-2">
            <span className="text-white/40 text-xs">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {msg.senderId === 'me' && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
          </div>
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    if (!selectedChat) return null;
    const theme = THEMES.default;
    return (
      <div className={cn('flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br', theme.bg)}>
        {messages.map((msg) => renderMessage(msg))}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────────────────
  // LIVE TYPING TRANSLATION PANEL - Glassmorphism с неоновым свечением
  // ───────────────────────────────────────────────────────────────────────────
  const renderLiveTranslationPanel = () => {
    if (!inputText.trim() && !liveTranslation) return null;
    
    const targetLangName = LANGUAGES.find(l => l.code === targetLanguage)?.name || 'Unknown';
    
    return (
      <div className="absolute -top-20 left-0 right-0 mx-4">
        <div className="backdrop-blur-xl bg-black/30 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-slide-up">
          <div className="flex items-start space-x-3">
            {/* Пульсирующая иконка Sparkles */}
            <div className={cn('p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20', isAITranslating && 'animate-pulse')}>
              <Sparkles className={cn('w-5 h-5', isAITranslating ? 'text-cyan-400 animate-spin' : 'text-cyan-400')} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                  ✨ AI Real-time ({targetLangName})
                </span>
                {isAITranslating && (
                  <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
                )}
              </div>
              
              {/* Перевод текста */}
              <p className="text-white text-sm leading-relaxed">
                {liveTranslation || (
                  <span className="text-white/40 italic">Translating...</span>
                )}
              </p>
              
              {/* Оригинал (мелким шрифтом) */}
              {translationSettings.showOriginal && inputText.trim() && (
                <p className="text-white/40 text-xs mt-2 truncate">
                  Original: {inputText.trim()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChatInput = () => {
    if (!selectedChat) return null;
    return (
      <div className="p-4 border-t border-white/10 backdrop-blur-xl bg-gray-900/50 relative">
        {/* Live Translation Panel */}
        {renderLiveTranslationPanel()}
        
        <div className="flex items-end space-x-3">
          <button className="p-3 text-white/60 hover:text-cyan-400 hover:bg-cyan-500/20 rounded-xl transition-all"><Paperclip className="w-5 h-5" /></button>
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              placeholder="Message..."
              rows={1}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 resize-none"
            />
            {translationSettings.enabled && inputText.trim() && (
              <div className="absolute -top-8 left-0 flex items-center space-x-2 px-2 py-1 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-cyan-400">
                  Auto → {LANGUAGES.find(l => l.code === targetLanguage)?.name}
                </span>
              </div>
            )}
          </div>
          <button className="p-3 text-white/60 hover:text-purple-400 hover:bg-purple-500/20 rounded-xl transition-all"><Smile className="w-5 h-5" /></button>
          <button onClick={handleSendMessage} disabled={!inputText.trim()} className={cn('p-3 rounded-xl transition-all', inputText.trim() ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-white/10 text-white/40')}>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderZelloMode = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-900/50 via-red-900/50 to-orange-900/50">
      <div className="text-center mb-8">
        <Radio className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">{selectedZelloChannel.name}</h2>
        <p className="text-white/60">{selectedZelloChannel.frequency}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {selectedZelloChannel.members.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            <div className={cn('relative w-16 h-16 rounded-full overflow-hidden border-2', member.isTalking ? 'border-green-400 animate-pulse' : 'border-white/20')}>
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              {member.isTalking && <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center"><Volume2 className="w-6 h-6 text-white" /></div>}
            </div>
            <p className="text-white/80 text-sm mt-2">{member.name}</p>
          </div>
        ))}
      </div>
      <button onMouseDown={() => handlePTT(true)} onMouseUp={() => handlePTT(false)} onMouseLeave={() => handlePTT(false)} onTouchStart={() => handlePTT(true)} onTouchEnd={() => handlePTT(false)} className={cn('relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-200', isPTTActive ? 'bg-gradient-to-r from-orange-500 to-red-500 scale-110 shadow-2xl shadow-orange-500/50' : 'bg-gradient-to-r from-orange-500/50 to-red-500/50 hover:from-orange-500 hover:to-red-500')}>
        {isPTTActive && (<><div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping" /><div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-pulse" style={{ animationDelay: '100ms' }} /><div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-pulse" style={{ animationDelay: '200ms' }} /></>)}
        <div className="text-center">
          <Mic className={cn('w-12 h-12 mx-auto mb-2', isPTTActive ? 'text-white' : 'text-white/80')} />
          <p className="text-white font-bold text-lg">{isPTTActive ? 'TRANSMITTING' : 'PUSH TO TALK'}</p>
        </div>
      </button>
      {isPTTActive && <p className="text-orange-400 text-sm mt-4">Release to send</p>}
    </div>
  );

  const renderBotBuilder = () => (
    <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-amber-900/30 via-purple-900/30 to-amber-900/30">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
              <Bot className="w-8 h-8 text-amber-400" /><span>AI Bot Builder</span>
            </h2>
            <p className="text-white/60 mt-1">Create your custom AI assistant</p>
          </div>
          <button onClick={() => setShowBotBuilder(false)} className="p-2 text-white/60 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="backdrop-blur-xl bg-gray-900/50 rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Bot Name</label>
            <input type="text" value={botConfig.name} onChange={(e) => setBotConfig({ ...botConfig, name: e.target.value })} placeholder="e.g., Crypto Trading Assistant" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400" />
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">AI Persona Prompt</label>
            <textarea value={botConfig.persona} onChange={(e) => setBotConfig({ ...botConfig, persona: e.target.value })} placeholder="Describe your bot's personality..." rows={6} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-400 resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium flex items-center space-x-2"><Zap className="w-4 h-4 text-cyan-400" /><span>Scenarios (Flows)</span></label>
              <div className="space-y-2">
                {['Welcome Message', 'FAQ Handler', 'Price Alert'].map((flow, i) => (<div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl"><span className="text-white/80 text-sm">{flow}</span><Settings className="w-4 h-4 text-white/40" /></div>))}
                <button className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/40 hover:border-amber-400/50 hover:text-amber-400 transition-all">+ Add Flow</button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium flex items-center space-x-2"><Crown className="w-4 h-4 text-purple-400" /><span>Integrations</span></label>
              <div className="space-y-2">
                {['Telegram', 'Discord', 'Twitter API', 'CoinGecko API'].map((integration, i) => (<div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl"><span className="text-white/80 text-sm">{integration}</span><ToggleLeft className="w-6 h-6 text-white/40" /></div>))}
              </div>
            </div>
          </div>
          <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-purple-500 rounded-xl text-white font-semibold hover:from-amber-400 hover:to-purple-400 transition-all">🚀 Deploy Bot</button>
        </div>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────────────────────
  // CALL OVERLAY с AI Subtitles
  // ───────────────────────────────────────────────────────────────────────────
  const renderCallOverlay = () => {
    if (!activeCall) return null;

    const targetLangName = LANGUAGES.find(l => l.code === targetLanguage)?.name || 'Bulgarian';
    const sourceLangName = 'English';

    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center">
        <div className="w-full max-w-4xl p-6 relative">
          {/* AI Conference Assistant */}
          {activeCall === 'conference' && (
            <AIConferenceAssistant
              isActive={isAsyncTranslateOn && isSubtitlesOn}
              targetLanguage={targetLanguage}
              onSubtitleAdd={(subtitle) => {
                setCallSubtitles(prev => [...prev, subtitle].slice(-5));
              }}
              onClose={() => setIsAsyncTranslateOn(false)}
            />
          )}

          {/* Video Preview */}
          {(activeCall === 'video' || activeCall === 'conference') && (
            <div className="aspect-video bg-gradient-to-br from-cyan-900/50 to-purple-900/50 rounded-2xl border border-white/10 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">{selectedChat?.name}</p>
                  <p className="text-white/40 text-sm">{activeCall === 'conference' ? 'Conference Call' : 'Video Call'}</p>
                </div>
              </div>
              
              {/* AI Subtitles Overlay */}
              {isSubtitlesOn && callSubtitles.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  {callSubtitles.map((subtitle) => (
                    <div key={subtitle.id} className="backdrop-blur-md bg-black/70 rounded-lg p-3 border border-white/10 animate-slide-up">
                      <p className="text-white/70 text-xs mb-1">{subtitle.originalText}</p>
                      {isAsyncTranslateOn && (
                        <p className="text-cyan-400 text-sm font-semibold">{subtitle.translatedText}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Call Info */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 mx-auto mb-4 flex items-center justify-center">
              {activeCall === 'audio' ? <Phone className="w-12 h-12 text-white" /> : <Video className="w-12 h-12 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-white">{selectedChat?.name}</h2>
            <p className="text-white/60">{activeCall === 'audio' ? 'Audio Call' : activeCall === 'video' ? 'Video Call' : 'Conference'}</p>
            
            {/* AI Neural Translation Active Badge */}
            {isAsyncTranslateOn && (
              <div className="flex items-center justify-center space-x-2 mt-3">
                <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 text-sm font-semibold">
                    AI Neural Translation Active (Real-time {sourceLangName} → {targetLangName})
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* AI Subtitles Block - Центральный блок для аудио звонков */}
          {isSubtitlesOn && isAsyncTranslateOn && (
            <div className="mb-8">
              <div className="backdrop-blur-xl bg-black/30 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 font-semibold">AI Real-time Translation</span>
                </div>
                
                {/* Распознанная речь */}
                {recognizedSpeech ? (
                  <>
                    <div className="mb-4">
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Original ({sourceLangName})</p>
                      <p className="text-white/80 text-sm">{recognizedSpeech}</p>
                    </div>
                    
                    {/* AI Перевод */}
                    {callSubtitles.length > 0 && (
                      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                        <p className="text-cyan-400 text-xs uppercase tracking-wider mb-1">AI Translated ({targetLangName})</p>
                        <p className="text-cyan-300 text-lg font-semibold leading-relaxed">
                          {callSubtitles[callSubtitles.length - 1]?.translatedText || 'Translating...'}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-3 text-white/40">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <p className="text-sm">Listening for speech...</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-4">
            {/* Voice Translate Toggle */}
            <button
              onClick={() => setIsAsyncTranslateOn(!isAsyncTranslateOn)}
              className={cn(
                'p-4 rounded-full transition-all backdrop-blur-md',
                isAsyncTranslateOn
                  ? 'bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-2 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-white/10 border-2 border-white/10 text-white/60 hover:text-white'
              )}
              title="Toggle Voice Translate"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* Subtitles Toggle */}
            <button
              onClick={() => setIsSubtitlesOn(!isSubtitlesOn)}
              className={cn(
                'p-4 rounded-full transition-all backdrop-blur-md',
                isSubtitlesOn
                  ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500/50 text-purple-400 shadow-[0_0_20px_rgba(191,0,255,0.4)]'
                  : 'bg-white/10 border-2 border-white/10 text-white/60 hover:text-white'
              )}
              title="Toggle Subtitles"
            >
              <MessageSquare className="w-6 h-6" />
            </button>

            {/* Speaker Toggle */}
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={cn(
                'p-4 rounded-full transition-all backdrop-blur-md',
                isSpeaking
                  ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-2 border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(57,255,20,0.4)]'
                  : 'bg-white/10 border-2 border-white/10 text-white/60 hover:text-white'
              )}
              title="Toggle Speaker"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white transition-all shadow-[0_0_20px_rgba(255,0,0,0.4)]"
            >
              <Phone className="w-6 h-6 rotate-[135deg]" />
            </button>
          </div>
          
          {/* Live Speech Recognition Status */}
          {recognizedSpeech && (
            <div className="mt-6 p-4 backdrop-blur-md bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-semibold">Recognized Speech</span>
              </div>
              <p className="text-white/80">{recognizedSpeech}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTranslationSettings = () => {
    if (!showTranslationSettings) return null;
    return (
      <div className="absolute top-16 right-4 w-80 backdrop-blur-xl bg-gray-900/95 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Languages className="w-5 h-5 text-cyan-400" />
              <h3 className="text-white font-semibold">AI Translation</h3>
            </div>
            <button onClick={() => setShowTranslationSettings(false)} className="p-1 text-white/60 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Enable Translation</span>
            <button
              onClick={() => setTranslationSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={cn('relative w-12 h-6 rounded-full transition-all', translationSettings.enabled ? 'bg-cyan-500' : 'bg-white/20')}
            >
              <div className={cn('absolute top-1 w-4 h-4 bg-white rounded-full transition-all', translationSettings.enabled ? 'left-7' : 'left-1')} />
            </button>
          </div>
          
          <div>
            <label className="text-white/60 text-xs mb-2 block">Source Language</label>
            <select
              value={translationSettings.sourceLanguage}
              onChange={(e) => setTranslationSettings(prev => ({ ...prev, sourceLanguage: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-white/60 text-xs mb-2 block">Target Language (Live Typing)</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              {LANGUAGES.filter(l => l.code !== 'auto').map(lang => (
                <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">Show Original Text</span>
            <button
              onClick={() => setTranslationSettings(prev => ({ ...prev, showOriginal: !prev.showOriginal }))}
              className={cn('relative w-12 h-6 rounded-full transition-all', translationSettings.showOriginal ? 'bg-cyan-500' : 'bg-white/20')}
            >
              <div className={cn('absolute top-1 w-4 h-4 bg-white rounded-full transition-all', translationSettings.showOriginal ? 'left-7' : 'left-1')} />
            </button>
          </div>
          
          <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5" />
              <p className="text-cyan-400 text-xs">
                Free AI translation via MyMemory API (50K words/day). Supports 50+ languages with auto-detection.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Story Viewer Component
  const renderStoryViewer = () => {
    if (!showStoryViewer || stories.length === 0) return null;

    const story = stories[currentStoryIndex];
    const progress = ((currentStoryIndex + 1) / stories.length) * 100;

    return (
      <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex space-x-1">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  idx <= currentStoryIndex ? 'bg-amber-400' : 'bg-white/20',
                  idx === currentStoryIndex && 'animate-pulse'
                )}
                style={{ width: idx < currentStoryIndex ? '100%' : `${progress}%` }}
              />
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowStoryViewer(false)}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Story Content */}
        <div className="max-w-md w-full mx-4">
          <div className={cn(
            'relative rounded-2xl overflow-hidden aspect-[9/16] max-h-[70vh]',
            story.contentType === 'image' ? 'bg-gradient-to-br from-cyan-900/50 to-purple-900/50' : 'bg-gradient-to-br from-amber-500/20 to-pink-500/20'
          )}>
            {/* User Info */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center space-x-3 bg-gradient-to-b from-black/60 to-transparent">
              <img src={story.userAvatar} alt={story.userName} className="w-10 h-10 rounded-full border-2 border-amber-400" />
              <div>
                <p className="text-white font-semibold">{story.userName}</p>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-white/60" />
                  <span className="text-white/60 text-xs">
                    {Math.round((story.expiresAt.getTime() - Date.now()) / 3600000)}h left
                  </span>
                </div>
              </div>
              {story.isPremium && (
                <div className="ml-auto flex items-center space-x-1 px-2 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 text-xs font-semibold">Premium</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              {story.contentType === 'image' ? (
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Users className="w-16 h-16 text-white/60" />
                  </div>
                  <p className="text-white/80 text-sm">Image Story</p>
                </div>
              ) : (
                <p className="text-white text-xl font-medium text-center">{story.content}</p>
              )}
            </div>

            {/* Navigation */}
            <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
              <button
                onClick={() => setCurrentStoryIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStoryIndex === 0}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setCurrentStoryIndex(prev => Math.min(stories.length - 1, prev + 1))}
                disabled={currentStoryIndex === stories.length - 1}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Premium Modal
  const renderPremiumModal = () => {
    if (!showPremiumModal) return null;

    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.2)]">
          {/* Header */}
          <div className="relative p-8 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/30 rounded-full blur-3xl" />
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 via-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Freedom Premium</h2>
              <p className="text-white/60">Разблокируй все возможности мессенджера</p>
            </div>
          </div>

          {/* Features */}
          <div className="px-8 pb-8 space-y-3">
            {[
              { icon: Star, text: 'Stories на 24 часа', color: 'text-amber-400' },
              { icon: Sparkles, text: 'AI перевод без лимитов', color: 'text-cyan-400' },
              { icon: Shield, text: 'Премиум значок в профилях', color: 'text-purple-400' },
              { icon: ZapIcon, text: 'Приоритетная поддержка', color: 'text-green-400' },
              { icon: Gift, text: 'Эксклюзивные темы', color: 'text-pink-400' },
              { icon: Trophy, text: 'Ранний доступ к функциям', color: 'text-yellow-400' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <feature.icon className={cn('w-5 h-5', feature.color)} />
                <span className="text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="px-8 pb-8">
            <div className="p-4 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-2xl border border-amber-500/30 text-center mb-4">
              <p className="text-4xl font-bold text-amber-400 mb-1">$4.99<span className="text-lg text-white/60">/мес</span></p>
              <p className="text-white/60 text-sm">или $49.99/год (скидка 17%)</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => { setIsPremiumUser(true); setShowPremiumModal(false); }}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/30"
              >
                Оформить Premium
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
              >
                Позже
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] glass-panel overflow-hidden">
      {renderSidebar()}
      <div className="flex-1 flex flex-col relative">
        {renderChatHeader()}
        {showTranslationSettings && renderTranslationSettings()}
        {renderMessages()}
        {renderChatInput()}
      </div>
      {activeCall && renderCallOverlay()}
      {showStoryViewer && renderStoryViewer()}
      {showPremiumModal && renderPremiumModal()}
    </div>
  );
};

export const MessengerPage = Messenger;
export default Messenger;
