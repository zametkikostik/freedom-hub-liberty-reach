import React, { useState, useCallback } from 'react';
import { Sparkles, Languages, Volume2, Copy, CheckCircle, Loader2, Users, Radio, Lock, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AITranslatorProps {
  text: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  chatType?: 'direct' | 'group' | 'channel' | 'secret';
  onTranslate?: (translated: string) => void;
}

export const AITranslator: React.FC<AITranslatorProps> = ({
  text,
  sourceLanguage = 'auto',
  targetLanguage = 'en',
  chatType = 'direct',
  onTranslate,
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const translateText = useCallback(async () => {
    setIsTranslating(true);
    try {
      // MyMemory API - бесплатно
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translated = data.responseData.translatedText;
        setTranslatedText(translated);
        onTranslate?.(translated);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [text, sourceLanguage, targetLanguage, onTranslate]);

  const speakText = useCallback(() => {
    if (!translatedText || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLanguage;
    utterance.rate = 0.9;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [translatedText, targetLanguage]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(translatedText || text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  }, [translatedText, text]);

  const getChatTypeIcon = () => {
    switch (chatType) {
      case 'group': return <Users className="w-3 h-3" />;
      case 'channel': return <Radio className="w-3 h-3" />;
      case 'secret': return <Lock className="w-3 h-3" />;
      default: return <MessageSquare className="w-3 h-3" />;
    }
  };

  return (
    <div className="mt-2 p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="text-xs text-cyan-300 font-medium">AI Translator</span>
          {chatType !== 'direct' && (
            <span className="flex items-center text-xs text-purple-300">
              {getChatTypeIcon()}
              <span className="ml-1 capitalize">{chatType}</span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={copyToClipboard}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Copy translation"
          >
            {copied ? <CheckCircle className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
          </button>
          {translatedText && (
            <button
              onClick={speakText}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Listen"
              disabled={isSpeaking}
            >
              <Volume2 className={cn('w-3 h-3', isSpeaking ? 'text-cyan-400 animate-pulse' : 'text-gray-400')} />
            </button>
          )}
        </div>
      </div>

      {isTranslating ? (
        <div className="flex items-center space-x-2 text-xs text-cyan-300">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Translating...</span>
        </div>
      ) : translatedText ? (
        <p className="text-sm text-cyan-100">{translatedText}</p>
      ) : (
        <button
          onClick={translateText}
          className="flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Languages className="w-3 h-3" />
          <span>Translate with AI</span>
        </button>
      )}
    </div>
  );
};
