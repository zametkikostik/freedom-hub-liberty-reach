import React, { useState, useRef, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface IpfsFile {
  id: string;
  name: string;
  size: string;
  cid: string;
  uploadedAt: string;
}

interface Stream {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  thumbnail: string;
  isLive: boolean;
  category: string;
  boostAmount: number; // DAI boosted (Odysee-style)
  nodeName: string; // PeerTube-style federation node
  publishedAt: string;
  isSubscribed?: boolean; // YouTube-style subscriptions
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  badge?: 'Streamer' | 'Mod' | 'AI Mod';
  isDeleted?: boolean;
  deleteReason?: string;
  isDonation?: boolean;
  donationAmount?: number;
  timestamp: Date;
}

type LiveSubTab = 'home' | 'subscriptions' | 'trending';
type SortOption = 'boosted' | 'seeded' | 'newest';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const mockIpfsFiles: IpfsFile[] = [
  { id: '1', name: 'presentation_2025.pdf', size: '2.4 MB', cid: 'QmX7Kd9fJ3hN2pL8vR4tY6wZ1qM5sA3bC9eF0gH2iJ4kL6m', uploadedAt: '2025-02-24' },
  { id: '2', name: 'vacation_video.mp4', size: '156.8 MB', cid: 'QmY8Le0gK4iO3qM9wS5uZ7xA2rN6tB4cD0fG1hI3jK5lM7n', uploadedAt: '2025-02-23' },
  { id: '3', name: 'crypto_wallet_backup.json', size: '1.2 KB', cid: 'QmZ9Mf1hL5jP4rN0xT6vA8yB3sO7uC5dE1gH2iJ4kL6mN8o', uploadedAt: '2025-02-22' },
  { id: '4', name: 'family_photos.zip', size: '892 MB', cid: 'QmA0Ng2iM6kQ5sO1yU7wB9zC4tP8vD6eF2hI3jK5lM7nO9p', uploadedAt: '2025-02-20' },
  { id: '5', name: 'music_collection.flac', size: '1.2 GB', cid: 'QmB1Oh3jN7lR6tP2zV8xC0aD5uQ9wE7fG3iJ4kL6mN8oP0q', uploadedAt: '2025-02-18' },
];

const mockStreams: Stream[] = [
  { id: '1', title: '🔴 LIVE: Coding DeFi Protocol from Scratch', streamer: 'CryptoDev', viewers: 1247, thumbnail: 'https://picsum.photos/seed/stream1/640/360', isLive: true, category: 'Programming', boostAmount: 2500, nodeName: 'Freedom Node EU', publishedAt: '2025-02-25', isSubscribed: true },
  { id: '2', title: 'Cyberpunk 2077 - Night City Exploration', streamer: 'NeonGamer', viewers: 892, thumbnail: 'https://picsum.photos/seed/stream2/640/360', isLive: true, category: 'Gaming', boostAmount: 1800, nodeName: 'PeerTube Gaming', publishedAt: '2025-02-24', isSubscribed: false },
  { id: '3', title: 'Lo-Fi Beats to Code/Relax To 🎵', streamer: 'ChillVibes', viewers: 3421, thumbnail: 'https://picsum.photos/seed/stream3/640/360', isLive: true, category: 'Music', boostAmount: 5200, nodeName: 'Music Federation', publishedAt: '2025-02-25', isSubscribed: true },
  { id: '4', title: 'VOD: Best Moments from Last Stream', streamer: 'CryptoDev', viewers: 0, thumbnail: 'https://picsum.photos/seed/stream4/640/360', isLive: false, category: 'Programming', boostAmount: 890, nodeName: 'Freedom Node EU', publishedAt: '2025-02-23', isSubscribed: true },
  { id: '5', title: '🔴 LIVE: AMA - Ask Me Anything!', streamer: 'TechGuru', viewers: 567, thumbnail: 'https://picsum.photos/seed/stream5/640/360', isLive: true, category: 'Talk Shows', boostAmount: 3100, nodeName: 'Tech Hub Node', publishedAt: '2025-02-25', isSubscribed: false },
  { id: '6', title: 'VOD: Tutorial - Smart Contract Security', streamer: 'SecurityPro', viewers: 0, thumbnail: 'https://picsum.photos/seed/stream6/640/360', isLive: false, category: 'Education', boostAmount: 1250, nodeName: 'EduChain Network', publishedAt: '2025-02-22', isSubscribed: true },
  { id: '7', title: '🔴 LIVE: Drawing Digital Art', streamer: 'ArtMaster', viewers: 234, thumbnail: 'https://picsum.photos/seed/stream7/640/360', isLive: true, category: 'Art', boostAmount: 670, nodeName: 'Artists United', publishedAt: '2025-02-25', isSubscribed: false },
  { id: '8', title: 'VOD: Chess Tournament Finals', streamer: 'Grandmaster', viewers: 0, thumbnail: 'https://picsum.photos/seed/stream8/640/360', isLive: false, category: 'Sports', boostAmount: 4200, nodeName: 'Sports Chain', publishedAt: '2025-02-21', isSubscribed: false },
  { id: '9', title: 'Web3 Development Masterclass', streamer: 'DAppBuilder', viewers: 156, thumbnail: 'https://picsum.photos/seed/stream9/640/360', isLive: false, category: 'Education', boostAmount: 980, nodeName: 'DevNode Asia', publishedAt: '2025-02-24', isSubscribed: true },
  { id: '10', title: '🔴 LIVE: Crypto Market Analysis', streamer: 'TokenTrader', viewers: 2100, thumbnail: 'https://picsum.photos/seed/stream10/640/360', isLive: true, category: 'Finance', boostAmount: 6700, nodeName: 'Finance Hub', publishedAt: '2025-02-25', isSubscribed: false },
];

const mockChatMessages: ChatMessage[] = [
  { id: '1', user: 'CryptoDev', message: 'Welcome everyone! Starting the stream now 🚀', badge: 'Streamer', timestamp: new Date() },
  { id: '2', user: 'ModAlice', message: 'Remember to follow the rules! Be kind to each other.', badge: 'Mod', timestamp: new Date() },
  { id: '3', user: 'Viewer123', message: 'Great stream! Love the content!', timestamp: new Date() },
  { id: '4', user: 'ToxicUser', message: 'This code is garbage, you have no idea what you\'re doing!', isDeleted: true, deleteReason: 'Токсичность', badge: 'AI Mod', timestamp: new Date() },
  { id: '5', user: 'GenerousFan', message: 'Supporting the channel!', isDonation: true, donationAmount: 50, timestamp: new Date() },
  { id: '6', user: 'AI Moderator', message: 'Автоматическая модерация активна. Спам и оскорбления будут удаляться.', badge: 'AI Mod', timestamp: new Date() },
  { id: '7', user: 'NewbieCoder', message: 'Can you explain that last part again?', timestamp: new Date() },
  { id: '8', user: 'SpamBot', message: 'BUY CHEAP CRYPTO NOW!!! CLICK HERE!!!', isDeleted: true, deleteReason: 'Спам', badge: 'AI Mod', timestamp: new Date() },
  { id: '9', user: 'WhaleWatcher', message: 'Big donation incoming!', isDonation: true, donationAmount: 100, timestamp: new Date() },
  { id: '10', user: 'RegularViewer', message: 'Been watching since the beginning, keep it up!', timestamp: new Date() },
];

const mockYouTubeVideos = [
  { id: '1', title: 'How Bitcoin Works - Complete Explanation', channel: 'Crypto Academy', views: '2.1M', thumbnail: 'https://picsum.photos/seed/yt1/640/360', duration: '24:15' },
  { id: '2', title: 'Building a Full-Stack App in 2025', channel: 'Code Masters', views: '890K', thumbnail: 'https://picsum.photos/seed/yt2/640/360', duration: '1:45:30' },
  { id: '3', title: 'Top 10 Privacy Tools You Need', channel: 'Privacy First', views: '456K', thumbnail: 'https://picsum.photos/seed/yt3/640/360', duration: '18:42' },
  { id: '4', title: 'Decentralization Explained Simply', channel: 'Web3 Education', views: '1.3M', thumbnail: 'https://picsum.photos/seed/yt4/640/360', duration: '12:08' },
  { id: '5', title: 'AI Revolution - What\'s Next?', channel: 'Future Tech', views: '3.7M', thumbnail: 'https://picsum.photos/seed/yt5/640/360', duration: '32:55' },
  { id: '6', title: 'Cybersecurity Basics for Everyone', channel: 'Secure World', views: '678K', thumbnail: 'https://picsum.photos/seed/yt6/640/360', duration: '28:17' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ICONS (SVG Components)
// ─────────────────────────────────────────────────────────────────────────────
const CloudUploadIcon = () => (
  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const RocketIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13.13 22.19l-1.5-3.65A11.11 11.11 0 0015 17h3a1 1 0 001-1V8a1 1 0 00-1-1h-1.47a10.94 10.94 0 00-2.83-5.59.5.5 0 00-.85.36V4a11 11 0 00-11 11v1a1 1 0 001 1h3a11.11 11.11 0 003.37 1.54l-1.5 3.65a1 1 0 001.38 1.27l2-1a1 1 0 00.63-.87zM7 15H5v-1a9 9 0 019-9v2a7 7 0 00-7 7v1z"/>
  </svg>
);

const HomeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const TvIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h.01M5 20a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2H7a2 2 0 00-2 2v8z" />
  </svg>
);

const TrendingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ServerIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L9.19 8.63 2 12l7.19 3.37L12 22l2.81-6.63L22 12l-7.19-3.37L12 2z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const VideoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ipfs' | 'live' | 'youtube'>('ipfs');
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [ipfsFiles, setIpfsFiles] = useState<IpfsFile[]>(mockIpfsFiles);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [chatInput, setChatInput] = useState('');
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [youtubeSearch, setYoutubeSearch] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  // Live & VOD sub-navigation and sorting
  const [liveSubTab, setLiveSubTab] = useState<LiveSubTab>('home');
  const [sortOption, setSortOption] = useState<SortOption>('boosted');
  const [streams, setStreams] = useState<Stream[]>(mockStreams);
  
  // AI Dubbing state
  const [showAiDubbing, setShowAiDubbing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('original');
  const [voiceCloneEnabled, setVoiceCloneEnabled] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Delete file handler
  const deleteFile = (id: string) => {
    setIpfsFiles(prev => prev.filter(f => f.id !== id));
  };

  // Boost video handler
  const handleBoost = (e: React.MouseEvent, streamId: string) => {
    e.stopPropagation();
    setStreams(prev => prev.map(s => 
      s.id === streamId 
        ? { ...s, boostAmount: s.boostAmount + 10 }
        : s
    ));
  };

  // Send chat message
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      message: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');

    // Simulate AI moderation (demo)
    if (chatInput.toLowerCase().includes('spam') || chatInput.toLowerCase().includes('scam')) {
      setTimeout(() => {
        setChatMessages(prev => prev.map(m =>
          m.id === newMessage.id
            ? { ...m, isDeleted: true, deleteReason: 'Спам/Мошенничество', badge: 'AI Mod' }
            : m
        ));
      }, 1000);
    }
  };

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Sorting function
  const getSortedStreams = (): Stream[] => {
    let filtered = [...streams];
    
    // Filter by sub-tab
    if (liveSubTab === 'subscriptions') {
      filtered = filtered.filter(s => s.isSubscribed);
    } else if (liveSubTab === 'trending') {
      filtered = filtered.filter(s => s.viewers > 500 || s.boostAmount > 1000);
    }
    
    // Sort
    switch (sortOption) {
      case 'boosted':
        return filtered.sort((a, b) => b.boostAmount - a.boostAmount);
      case 'seeded':
        return filtered.sort((a, b) => b.viewers - a.viewers);
      case 'newest':
        return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      default:
        return filtered;
    }
  };

  // Generate peer count from stream ID
  const getPeerCount = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash * 137) % 3000 + 100;
  };

  // ───────────────────────────────────────────────────────────────────────────
  // TAB 1: IPFS CLOUD
  // ───────────────────────────────────────────────────────────────────────────
  const renderIpfsCloud = () => (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 backdrop-blur-sm
          ${dragActive
            ? 'border-cyan-400 bg-cyan-500/20 scale-[1.02]'
            : 'border-white/20 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="text-cyan-400 animate-pulse">
            <CloudUploadIcon />
          </div>
          <div>
            <p className="text-xl font-semibold text-white mb-2">
              Перетащите файлы сюда
            </p>
            <p className="text-white/60 text-sm">
              или кликните для выбора файлов
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all shadow-lg shadow-cyan-500/25">
            Выбрать файлы
          </button>
        </div>
      </div>

      {/* Files Table */}
      <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Загруженные файлы</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Название</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Размер</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">CID (IPFS Hash)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {ipfsFiles.map((file) => (
                <tr key={file.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{file.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white/70 text-sm">{file.size}</span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded">
                      {file.cid.slice(0, 20)}...{file.cid.slice(-8)}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white/60 text-sm">{file.uploadedAt}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => copyToClipboard(`ipfs://${file.cid}`)}
                        className="p-2 text-white/60 hover:text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-all"
                        title="Скопировать ссылку"
                      >
                        <CopyIcon />
                      </button>
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Удалить"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TAB 2: LIVE & VOD - STREAM VIEW
  // ───────────────────────────────────────────────────────────────────────────
  const renderStreamView = () => {
    if (!activeStream) return null;

    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveStream(null)}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <CloseIcon />
            <span>Закрыть стрим</span>
          </button>
          <span className="text-white/60 text-sm">{activeStream.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Player & Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player Placeholder */}
            <div className="relative aspect-video rounded-2xl overflow-hidden backdrop-blur-md bg-black/50 border border-white/10 group">
              <img
                src={activeStream.thumbnail}
                alt={activeStream.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center cursor-pointer transform group-hover:scale-110 transition-all shadow-lg shadow-cyan-500/50">
                  <PlayIcon />
                </div>
              </div>
              {activeStream.isLive && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 rounded-full flex items-center space-x-2 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white text-xs font-bold">LIVE</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 rounded-lg flex items-center space-x-2">
                <UsersIcon />
                <span className="text-white text-sm">{activeStream.viewers.toLocaleString()} зрителей</span>
              </div>
              
              {/* Player Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-between">
                  {/* Left Controls */}
                  <div className="flex items-center space-x-3">
                    {/* Play/Pause */}
                    <button className="p-2 text-white/80 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                    {/* Volume */}
                    <button className="p-2 text-white/80 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Center - Progress Bar */}
                  <div className="flex-1 mx-4">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Right Controls */}
                  <div className="flex items-center space-x-2">
                    {/* AI Dubbing Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowAiDubbing(!showAiDubbing)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                          showAiDubbing || selectedLanguage !== 'original'
                            ? 'bg-purple-500/30 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                            : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                        }`}
                        title="AI Neural Dubbing"
                      >
                        <SparklesIcon />
                        <span className="text-xs font-medium hidden sm:inline">AI Dubbing</span>
                      </button>
                      
                      {/* AI Dubbing Dropdown */}
                      {showAiDubbing && (
                        <div className="absolute bottom-full right-0 mb-2 w-72 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden z-50">
                          <div className="p-4 border-b border-white/10">
                            <div className="flex items-center space-x-2">
                              <SparklesIcon />
                              <h4 className="text-white font-semibold text-sm">Neural AI Dubbing</h4>
                            </div>
                            <p className="text-white/50 text-xs mt-1">Выберите язык для нейро-перевода</p>
                          </div>
                          
                          <div className="p-3 space-y-1">
                            {/* Language Options */}
                            <button
                              onClick={() => setSelectedLanguage('original')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                selectedLanguage === 'original'
                                  ? 'bg-purple-500/30 text-purple-300'
                                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span>🎙️ Original Audio</span>
                              {selectedLanguage === 'original' && (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => setSelectedLanguage('en')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                selectedLanguage === 'en'
                                  ? 'bg-purple-500/30 text-purple-300'
                                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span>🇺🇸 English (AI Voice)</span>
                              {selectedLanguage === 'en' && (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => setSelectedLanguage('ru')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                selectedLanguage === 'ru'
                                  ? 'bg-purple-500/30 text-purple-300'
                                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span>🇷🇺 Русский (AI Voice)</span>
                              {selectedLanguage === 'ru' && (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => setSelectedLanguage('bg')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                selectedLanguage === 'bg'
                                  ? 'bg-purple-500/30 text-purple-300'
                                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span>🇧🇬 Български (AI Voice)</span>
                              {selectedLanguage === 'bg' && (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                              )}
                            </button>
                          </div>
                          
                          {/* Voice Clone Toggle */}
                          <div className="p-3 border-t border-white/10 bg-purple-500/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <GlobeIcon />
                                <span className="text-white/80 text-xs">Original Voice Clone</span>
                              </div>
                              <button
                                onClick={() => setVoiceCloneEnabled(!voiceCloneEnabled)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${
                                  voiceCloneEnabled ? 'bg-purple-500' : 'bg-white/20'
                                }`}
                              >
                                <span
                                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                    voiceCloneEnabled ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                            <p className="text-white/40 text-xs mt-2">
                              {voiceCloneEnabled 
                                ? '✨ Клонирование оригинального голоса включено' 
                                : '🔇 Стандартный AI голос'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Settings */}
                    <button className="p-2 text-white/80 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                      </svg>
                    </button>
                    
                    {/* Fullscreen */}
                    <button className="p-2 text-white/80 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream Info */}
            <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">{activeStream.title}</h2>
                  <p className="text-white/60">Стример: <span className="text-cyan-400">{activeStream.streamer}</span></p>
                  <div className="flex items-center space-x-2 text-xs text-white/40">
                    <ServerIcon />
                    <span>Hosted on: {activeStream.nodeName}</span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold text-white hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/25 flex items-center space-x-2">
                  <HeartIcon />
                  <span>Donate DAI</span>
                </button>
              </div>
              {/* P2P Network Indicator */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-emerald-400 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></span>
                    <span>{getPeerCount(activeStream.id).toLocaleString()} Peers (Seeding)</span>
                  </span>
                  <span className="text-white/30 text-xs">|</span>
                  <span className="font-mono text-xs text-cyan-400">IPFS + WebTorrent</span>
                  <span className="text-white/30 text-xs">|</span>
                  <span className="font-mono text-xs text-amber-400 flex items-center space-x-1">
                    <RocketIcon />
                    <span>{activeStream.boostAmount.toLocaleString()} DAI Boosted</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Streamer Panel + Chat */}
          <div className="space-y-4">
            {/* Streamer Panel - OBS Settings */}
            <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                <div className="flex items-center space-x-2">
                  <SettingsIcon />
                  <h3 className="text-white font-semibold">Панель стримера</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {/* Server URL */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider">Server URL</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value="rtmp://live.freedom-hub.io/live"
                      readOnly
                      className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white/80 text-sm font-mono focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => copyToClipboard('rtmp://live.freedom-hub.io/live')}
                      className="p-2 text-white/60 hover:text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-all"
                      title="Копировать"
                    >
                      <CopyIcon />
                    </button>
                  </div>
                </div>
                {/* Stream Key */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider">Stream Key</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showStreamKey ? 'text' : 'password'}
                      value="sk_live_abc123xyz789freedom"
                      readOnly
                      className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white/80 text-sm font-mono focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => setShowStreamKey(!showStreamKey)}
                      className="p-2 text-white/60 hover:text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-all"
                      title={showStreamKey ? 'Скрыть' : 'Показать'}
                    >
                      {showStreamKey ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                    <button
                      onClick={() => copyToClipboard('sk_live_abc123xyz789freedom')}
                      className="p-2 text-white/60 hover:text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-all"
                      title="Копировать"
                    >
                      <CopyIcon />
                    </button>
                  </div>
                </div>
                {/* Info box */}
                <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <p className="text-cyan-300 text-xs">
                    💡 Используйте эти данные в OBS Studio: <br/>
                    <span className="text-white/60">Настройки → Вещание → Сервис: Custom</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 flex flex-col h-[500px]">
              <div className="px-4 py-3 border-b border-white/10">
                <h3 className="text-white font-semibold">Чат трансляции</h3>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  {msg.isDeleted ? (
                    <div className="px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">
                        <span className="font-bold">[AI-Модератор]</span> Сообщение от {msg.user} удалено: {msg.deleteReason}
                      </p>
                    </div>
                  ) : msg.isDonation ? (
                    <div className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 text-sm font-bold">
                        🎉 {msg.user} sent {msg.donationAmount} DAI!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white/80 font-medium text-sm">{msg.user}</span>
                        {msg.badge && (
                          <span className={`px-2 py-0.5 rounded text-xs font-bold
                            ${msg.badge === 'Streamer' ? 'bg-purple-500/30 text-purple-300' : ''}
                            ${msg.badge === 'Mod' ? 'bg-blue-500/30 text-blue-300' : ''}
                            ${msg.badge === 'AI Mod' ? 'bg-red-500/30 text-red-300' : ''}
                          `}>
                            [{msg.badge}]
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 text-sm pl-2">{msg.message}</p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Отправить сообщение..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={sendChatMessage}
                  className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white hover:from-cyan-400 hover:to-purple-400 transition-all"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  // ───────────────────────────────────────────────────────────────────────────
  // TAB 2: LIVE & VOD - GRID VIEW (ENHANCED)
  // ───────────────────────────────────────────────────────────────────────────
  const renderLiveGrid = () => {
    const sortedStreams = getSortedStreams();

    return (
      <div className="space-y-6">
        {/* Sub-navigation & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Sub-tabs (Pills) */}
          <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setLiveSubTab('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${liveSubTab === 'home'
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
            >
              <HomeIcon />
              <span>Home</span>
            </button>
            <button
              onClick={() => setLiveSubTab('subscriptions')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${liveSubTab === 'subscriptions'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
            >
              <TvIcon />
              <span>Subscriptions</span>
            </button>
            <button
              onClick={() => setLiveSubTab('trending')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${liveSubTab === 'trending'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
            >
              <TrendingIcon />
              <span>Trending</span>
            </button>
          </div>

          {/* Sorting Dropdown */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="appearance-none px-4 py-2 pr-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-cyan-400 cursor-pointer hover:bg-white/10 transition-all"
            >
              <option value="boosted" className="bg-gray-900">🚀 Top Boosted</option>
              <option value="seeded" className="bg-gray-900">🌐 Most Seeded</option>
              <option value="newest" className="bg-gray-900">🕒 Newest</option>
            </select>
            <ChevronDownIcon />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedStreams.map((stream) => {
            const peerCount = getPeerCount(stream.id);
            return (
              <div
                key={stream.id}
                onClick={() => stream.isLive && setActiveStream(stream)}
                className={`group backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02]
                  ${!stream.isLive ? 'opacity-70' : ''}`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                  {stream.isLive && (
                    <>
                      <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 rounded-full flex items-center space-x-1 animate-pulse">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        <span className="text-white text-xs font-bold">LIVE</span>
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded flex items-center space-x-1">
                        <UsersIcon />
                        <span className="text-white text-xs">{stream.viewers.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  {!stream.isLive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <PlayIcon />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <h3 className="text-white font-semibold line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {stream.title}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-white/80 text-sm font-medium">{stream.streamer}</p>
                    <div className="flex items-center space-x-1 text-xs text-white/40">
                      <ServerIcon />
                      <span>{stream.nodeName}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="font-mono text-xs text-emerald-400 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                      <span>{peerCount.toLocaleString()} Peers</span>
                    </span>
                  </div>
                  {/* Boost Button */}
                  <button
                    onClick={(e) => handleBoost(e, stream.id)}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-sm font-medium hover:from-amber-500/30 hover:to-orange-500/30 transition-all group/btn"
                  >
                    <RocketIcon />
                    <span>{stream.boostAmount.toLocaleString()} DAI</span>
                    <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity text-xs">+ Boost</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {sortedStreams.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">No videos found in this category</p>
          </div>
        )}
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────────────────────
  // TAB 3: YOUTUBE
  // ───────────────────────────────────────────────────────────────────────────
  const renderYoutube = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={youtubeSearch}
          onChange={(e) => setYoutubeSearch(e.target.value)}
          placeholder="Найти видео на YouTube..."
          className="w-full pl-12 pr-4 py-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition-all"
        />
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockYouTubeVideos.map((video) => (
          <div
            key={video.id}
            className="group backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 overflow-hidden cursor-pointer transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02]"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-medium">
                {video.duration}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <h3 className="text-white font-semibold line-clamp-2 group-hover:text-purple-400 transition-colors">
                {video.title}
              </h3>
              <p className="text-white/60 text-sm">{video.channel}</p>
              <p className="text-white/40 text-xs">{video.views} просмотров</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ───────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
            🎬 Video Hub
          </h1>
          <p className="text-white/60">Децентрализованная видеоплатформа будущего</p>
        </div>

        {/* Main Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => { setActiveTab('ipfs'); setActiveStream(null); }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-md
              ${activeTab === 'ipfs'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
          >
            ☁️ IPFS Cloud
          </button>
          <button
            onClick={() => { setActiveTab('live'); setActiveStream(null); setLiveSubTab('home'); }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-md
              ${activeTab === 'live'
                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
          >
            🔴 Live & VOD
          </button>
          <button
            onClick={() => { setActiveTab('youtube'); setActiveStream(null); }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all backdrop-blur-md
              ${activeTab === 'youtube'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
          >
            ▶️ YouTube
          </button>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'ipfs' && renderIpfsCloud()}
          {activeTab === 'live' && (activeStream ? renderStreamView() : renderLiveGrid())}
          {activeTab === 'youtube' && renderYoutube()}
        </div>
      </div>
    </div>
  );
};

export const VideoPageComponent = VideoPage;
export default VideoPage;
