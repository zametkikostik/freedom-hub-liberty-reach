import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Mic, Sparkles, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpeechRecognition, SpeechRecognitionEvent } from '@/types/speech';

interface Subtitle {
  id: string;
  originalText: string;
  translatedText: string;
  language: string;
  timestamp: number;
}

interface AIConferenceAssistantProps {
  isActive: boolean;
  targetLanguage?: string;
  onSubtitleAdd?: (subtitle: Subtitle) => void;
  onClose?: () => void;
}

export const AIConferenceAssistant: React.FC<AIConferenceAssistantProps> = ({
  isActive,
  targetLanguage = 'ru',
  onSubtitleAdd,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const recognitionRef = useRef<any>(null);

  const translateText = useCallback(async (text: string, from: string, to: string): Promise<string> => {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.responseData?.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = async (event: any) => {
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

      setRecognizedSpeech(interimTranscript || finalTranscript);

      if (finalTranscript) {
        setIsTranslating(true);
        const translated = await translateText(finalTranscript, 'en', targetLanguage);
        
        const subtitle: Subtitle = {
          id: Date.now().toString(),
          originalText: finalTranscript,
          translatedText: translated,
          language: targetLanguage,
          timestamp: Date.now(),
        };

        setSubtitles(prev => [...prev, subtitle].slice(-5)); // Keep last 5
        onSubtitleAdd?.(subtitle);
        setIsTranslating(false);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        recognitionRef.current?.start();
      }
    };

    recognitionRef.current.start();
    setIsListening(true);
  }, [isListening, targetLanguage, onSubtitleAdd, translateText]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  useEffect(() => {
    if (isActive && !isListening) {
      startListening();
    } else if (!isActive && isListening) {
      stopListening();
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [isActive, isListening, startListening, stopListening]);

  // Auto-remove old subtitles
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setSubtitles(prev => prev.filter(s => now - s.timestamp < 10000)); // Remove after 10s
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isActive) return null;

  return (
    <div className="absolute top-4 left-4 right-4 z-50">
      <div className="max-w-2xl mx-auto">
        {/* Control Panel */}
        <div className="mb-2 p-3 bg-black/60 backdrop-blur-xl rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn('p-2 rounded-full', isListening ? 'bg-green-500/20' : 'bg-gray-500/20')}>
                <Mic className={cn('w-4 h-4', isListening ? 'text-green-400 animate-pulse' : 'text-gray-400')} />
              </div>
              <div>
                <p className="text-xs text-white font-medium">AI Conference Assistant</p>
                <p className="text-xs text-gray-400">
                  {isListening ? 'Listening & translating...' : 'Click to start'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={isListening ? stopListening : startListening}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  isListening
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                )}
              >
                {isListening ? 'Stop' : 'Start'}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtitles Display */}
        {subtitles.length > 0 && (
          <div className="space-y-2">
            {subtitles.map((subtitle, index) => (
              <div
                key={subtitle.id}
                className={cn(
                  'p-3 rounded-lg backdrop-blur-md border transition-all duration-500',
                  index === subtitles.length - 1
                    ? 'bg-cyan-500/20 border-cyan-500/30 scale-100 opacity-100'
                    : 'bg-black/40 border-white/10 scale-95 opacity-60'
                )}
              >
                {subtitle.originalText && (
                  <p className="text-xs text-gray-300 mb-1">{subtitle.originalText}</p>
                )}
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <p className="text-sm text-cyan-100 font-medium">{subtitle.translatedText}</p>
                </div>
              </div>
            ))}
            {isTranslating && (
              <div className="flex items-center space-x-2 text-xs text-cyan-300">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Translating...</span>
              </div>
            )}
          </div>
        )}

        {/* Live Recognition */}
        {recognizedSpeech && !subtitles.find(s => s.originalText === recognizedSpeech) && (
          <div className="mt-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center space-x-2 text-xs text-purple-300">
              <Mic className="w-3 h-3" />
              <span>{recognizedSpeech}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
