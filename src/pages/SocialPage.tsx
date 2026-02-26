import React, { useState, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, DollarSign, Crown, Clock, Verified,
  Video, Zap, Lock, Unlock, Image, FileText, Music2, Users,
  ShoppingCart, Calendar, CheckCircle, X, ExternalLink, MapPin, File,
  Sparkles, TrendingUp, Clock3, Activity
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';

type Category = 'all' | 'microblog' | 'media' | 'clips' | 'marketplace' | 'events' | 'exclusive';
type Algorithm = 'foryou' | 'trending' | 'latest';

interface Post {
  id: string;
  type: 'text' | 'image' | 'video' | 'clip' | 'poll' | 'marketplace' | 'event' | 'longread' | 'gift';
  author: { username: string; avatar: string | null; wallet: string; isVerified: boolean };
  content: string;
  media: string | null;
  isPremium: boolean;
  price: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  tips?: number;
  timestamp: Date;
  isLiked: boolean;
  tags?: string[];
  poll?: { question: string; options: { id: string; text: string; votes: number; percentage: number }[]; totalVotes: number };
  marketplace?: { productName: string; price: number; currency: string; inStock: boolean };
  event?: { title: string; date: string; time: string; location: string; isOnline: boolean; going: number; interested: number };
  longread?: { title: string; readTime: number; preview: string };
  gift?: { from: string; to: string; giftName: string; giftImage: string; nftId: string };
}

const calculateTrendingScore = (post: Post): number => {
  const hoursOld = (Date.now() - new Date(post.timestamp).getTime()) / (1000 * 60 * 60);
  const engagement = (post.likes * 1) + (post.comments * 2) + (post.shares * 3) + ((post.tips || 0) * 5);
  const timeDecay = Math.log(hoursOld + 1);
  return engagement / (timeDecay || 1);
};

const calculateForYouScore = (post: Post): number => {
  const baseScore = Math.random() * 100;
  const engagementBoost = (post.likes + post.comments) / 100;
  const recencyBoost = (Date.now() - new Date(post.timestamp).getTime()) < 86400000 ? 30 : 0;
  return baseScore + engagementBoost + recencyBoost;
};

const sortPosts = (posts: Post[], algorithm: Algorithm): Post[] => {
  const postsCopy = [...posts];
  switch (algorithm) {
    case 'latest':
      return postsCopy.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    case 'trending':
      return postsCopy.sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));
    case 'foryou':
      return postsCopy.sort((a, b) => calculateForYouScore(b) - calculateForYouScore(a));
    default:
      return postsCopy;
  }
};

const MOCK_POSTS: Post[] = [
  { id: 'clip1', type: 'clip', author: { username: 'cypher', avatar: null, wallet: '0xclip...0001', isVerified: true }, content: 'Мой первый клип! 🔥', media: 'https://picsum.photos/seed/clip1/400/700', isPremium: false, price: 0, likes: 2345, comments: 234, shares: 123, views: 45678, tips: 50, timestamp: new Date(Date.now() - 3600000), isLiked: false, tags: ['clips'] },
  { id: 'clip2', type: 'clip', author: { username: 'oracle', avatar: null, wallet: '0xclip...0002', isVerified: false }, content: 'Учу смарт-контракты 💻', media: 'https://picsum.photos/seed/clip2/400/700', isPremium: false, price: 0, likes: 1567, comments: 189, shares: 89, views: 34567, tips: 30, timestamp: new Date(Date.now() - 7200000), isLiked: true, tags: ['coding'] },
  { id: 'clip3', type: 'clip', author: { username: 'alex', avatar: null, wallet: '0xclip...0003', isVerified: true }, content: 'Трейдинг сетап 📊', media: 'https://picsum.photos/seed/clip3/400/700', isPremium: false, price: 0, likes: 3456, comments: 345, shares: 167, views: 67890, tips: 100, timestamp: new Date(Date.now() - 14400000), isLiked: false, tags: ['trading'] },
  { id: 'poll1', type: 'poll', author: { username: 'crypto_poll', avatar: null, wallet: '0xpoll...0001', isVerified: true }, content: 'Какую криптовалюту выбрать?', media: null, isPremium: false, price: 0, likes: 567, comments: 189, shares: 45, views: 12345, tips: 20, timestamp: new Date(Date.now() - 10800000), isLiked: false, tags: ['poll'], poll: { question: 'Какую криптовалюту выбрать?', options: [{ id: '1', text: 'Bitcoin', votes: 1234, percentage: 45 }, { id: '2', text: 'Ethereum', votes: 890, percentage: 32 }, { id: '3', text: 'Solana', votes: 456, percentage: 16 }, { id: '4', text: 'Другое', votes: 195, percentage: 7 }], totalVotes: 2775 } },
  { id: 'market1', type: 'marketplace', author: { username: 'crypto_shop', avatar: null, wallet: '0xshop...0001', isVerified: true }, content: 'NFT-мерч!', media: 'https://picsum.photos/seed/market1/800/600', isPremium: false, price: 0, likes: 890, comments: 123, shares: 67, views: 23456, tips: 150, timestamp: new Date(Date.now() - 14400000), isLiked: false, tags: ['marketplace'], marketplace: { productName: 'Freedom Hub Hoodie', price: 500, currency: 'DAI', inStock: true } },
  { id: 'event1', type: 'event', author: { username: 'freedomhub', avatar: null, wallet: '0xeve...0001', isVerified: true }, content: 'Web3 конференция!', media: 'https://picsum.photos/seed/event1/800/450', isPremium: false, price: 0, likes: 2345, comments: 456, shares: 234, views: 56789, tips: 500, timestamp: new Date(Date.now() - 86400000), isLiked: true, tags: ['event'], event: { title: 'Freedom Hub 2025', date: '15 марта 2025', time: '10:00 UTC', location: 'Metaverse', isOnline: true, going: 1234, interested: 3456 } },
  { id: 'gift1', type: 'gift', author: { username: 'alex', avatar: null, wallet: '0xgift...0001', isVerified: false }, content: '', media: null, isPremium: false, price: 0, likes: 567, comments: 89, shares: 23, views: 8901, tips: 75, timestamp: new Date(Date.now() - 10800000), isLiked: false, tags: ['gift'], gift: { from: 'alex', to: 'maria', giftName: 'Cyber Rose', giftImage: '🌹', nftId: '#1234' } },
  { id: '1', type: 'text', author: { username: 'neo', avatar: null, wallet: '0x1234...5678', isVerified: true }, content: 'Добро пожаловать! 🚀', media: null, isPremium: false, price: 0, likes: 342, comments: 45, shares: 23, views: 5678, tips: 50, timestamp: new Date(Date.now() - 1800000), isLiked: false, tags: ['welcome'] },
  { id: '3', type: 'image', author: { username: 'morpheus', avatar: null, wallet: '0x9999...1111', isVerified: true }, content: 'Фото с Summit! 📸', media: 'https://picsum.photos/seed/cyber1/800/600', isPremium: false, price: 0, likes: 1256, comments: 134, shares: 67, views: 23456, tips: 80, timestamp: new Date(Date.now() - 7200000), isLiked: true, tags: ['photo'] },
  { id: 'prem1', type: 'text', author: { username: 'expert', avatar: null, wallet: '0xbbbb...cccc', isVerified: true }, content: '🔒 PREMIUM: Методика заработка.', media: null, isPremium: true, price: 25, likes: 1234, comments: 234, shares: 123, views: 34567, tips: 500, timestamp: new Date(Date.now() - 259200000), isLiked: false, tags: ['premium'] },
];

const CategoryTab = ({ category, activeCategory, onClick, count }: { category: Category; activeCategory: Category; onClick: (c: Category) => void; count: number }) => {
  const isActive = activeCategory === category;
  const getIcon = () => {
    switch (category) {
      case 'microblog': return <FileText className="w-4 h-4" />;
      case 'media': return <Image className="w-4 h-4" />;
      case 'clips': return <Video className="w-4 h-4" />;
      case 'marketplace': return <ShoppingCart className="w-4 h-4" />;
      case 'events': return <Calendar className="w-4 h-4" />;
      case 'exclusive': return <Crown className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };
  const getLabel = () => {
    switch (category) {
      case 'all': return 'Все посты';
      case 'microblog': return 'Микроблог';
      case 'media': return 'Медиа';
      case 'clips': return 'Clips';
      case 'marketplace': return 'Marketplace';
      case 'events': return 'Events';
      case 'exclusive': return 'Эксклюзив';
    }
  };
  return (
    <motion.button onClick={() => onClick(category)} className={cn('relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap', isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      {isActive && (<motion.div layoutId="activeTab" className="absolute inset-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-xl" initial={false} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />)}
      <span className="relative z-10 flex items-center gap-2">
        {getIcon()}
        {getLabel()}
        <span className={cn('px-1.5 py-0.5 rounded-full text-xs', isActive ? 'bg-white/20' : 'bg-cyber-gray/50')}>{count}</span>
      </span>
    </motion.button>
  );
};

const AlgorithmTab = ({ algorithm, activeAlgorithm, onClick }: { algorithm: Algorithm; activeAlgorithm: Algorithm; onClick: (a: Algorithm) => void }) => {
  const isActive = algorithm === activeAlgorithm;
  const getIcon = () => {
    switch (algorithm) {
      case 'foryou': return <Sparkles className="w-3.5 h-3.5" />;
      case 'trending': return <TrendingUp className="w-3.5 h-3.5" />;
      case 'latest': return <Clock3 className="w-3.5 h-3.5" />;
    }
  };
  const getLabel = () => {
    switch (algorithm) {
      case 'foryou': return 'Для вас';
      case 'trending': return 'Популярное';
      case 'latest': return 'Свежее';
    }
  };
  return (
    <motion.button onClick={() => onClick(algorithm)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5', isActive ? 'bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 text-cyber-cyan border border-cyber-cyan/30' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      {getIcon()}
      {getLabel()}
    </motion.button>
  );
};

const ClipCard = ({ clip, onLike }: { clip: Post; onLike: (id: string) => void }) => (
  <div className="h-full w-full relative snap-start bg-cyber-dark overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/30 via-cyber-dark to-cyber-cyan/20">
      {clip.media && (<img src={clip.media} alt={clip.content} className="w-full h-full object-cover opacity-60" />)}
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
    <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-20">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple border-2 border-cyber-cyan overflow-hidden">
        {clip.author.avatar ? (<img src={clip.author.avatar} alt={clip.author.username} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center"><span className="text-lg font-bold text-white">{clip.author.username[0].toUpperCase()}</span></div>)}
      </div>
      <button onClick={() => onLike(clip.id)} className={cn('flex flex-col items-center gap-1 transition-all hover:scale-110', clip.isLiked && 'text-cyber-pink')}>
        <div className={cn('w-12 h-12 rounded-full glass-card flex items-center justify-center', clip.isLiked && 'neon-cyan')}>
          <Heart className={cn('w-6 h-6', clip.isLiked && 'fill-current animate-pulse')} />
        </div>
        <span className="text-xs font-mono text-white">{clip.likes >= 1000 ? `${(clip.likes / 1000).toFixed(1)}K` : clip.likes}</span>
      </button>
      <button className="flex flex-col items-center gap-1 transition-all hover:scale-110">
        <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center"><MessageCircle className="w-6 h-6 text-white" /></div>
        <span className="text-xs font-mono text-white">{clip.comments >= 1000 ? `${(clip.comments / 1000).toFixed(1)}K` : clip.comments}</span>
      </button>
      <button className="flex flex-col items-center gap-1 transition-all hover:scale-110">
        <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center"><Share2 className="w-6 h-6 text-white" /></div>
        <span className="text-xs font-mono text-white">Share</span>
      </button>
      <button className="flex flex-col items-center gap-1 transition-all hover:scale-110">
        <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center border border-cyber-green/30"><DollarSign className="w-6 h-6 text-cyber-green" /></div>
        <span className="text-xs font-mono text-cyber-green">Donate</span>
      </button>
    </div>
    <div className="absolute left-4 right-20 bottom-6 z-20">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-white">@{clip.author.username}</span>
        {clip.author.isVerified && <Verified className="w-4 h-4 text-cyber-cyan" />}
      </div>
      <p className="text-sm text-gray-200 mb-3 line-clamp-2">{clip.content}</p>
      <div className="flex items-center gap-2">
        <Music2 className="w-4 h-4 text-cyber-cyan animate-spin" style={{ animationDuration: '3s' }} />
        <div className="overflow-hidden flex-1"><p className="text-xs text-gray-400 whitespace-nowrap">Original Sound - {clip.author.username}</p></div>
      </div>
    </div>
  </div>
);

const ClipsFeed = ({ clips, onLike }: { clips: Post[]; onLike: (id: string) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="h-[80vh] overflow-y-scroll snap-y snap-mandatory rounded-2xl overflow-hidden" style={{ scrollSnapType: 'y mandatory' }}>
      {clips.map((clip) => (<div key={clip.id} className="h-full w-full snap-start"><ClipCard clip={clip} onLike={() => onLike(clip.id)} /></div>))}
    </div>
  );
};

const PollCard = ({ poll }: { poll: NonNullable<Post['poll']> }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  return (
    <div className="p-4 rounded-xl bg-cyber-dark/50 border border-white/5">
      <h3 className="text-lg font-semibold text-white mb-4">{poll.question}</h3>
      <div className="space-y-3">
        {poll.options.map((option) => (
          <div key={option.id} className="relative">
            <button onClick={() => !poll.userVoted && setSelectedOption(option.id)} className={cn('w-full p-3 rounded-lg border transition-all text-left', poll.userVoted ? 'border-cyber-cyan/30 bg-cyber-cyan/10' : selectedOption === option.id ? 'border-cyber-cyan bg-cyber-cyan/20' : 'border-white/10 hover:border-white/20')}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">{option.text}</span>
                {poll.userVoted && (<span className="text-sm font-mono text-cyber-cyan">{option.percentage}%</span>)}
              </div>
              {poll.userVoted && (<div className="absolute inset-0 rounded-lg overflow-hidden"><div className="h-full bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20" style={{ width: `${option.percentage}%` }} /></div>)}
            </button>
          </div>
        ))}
      </div>
      {!poll.userVoted ? (<Button variant="primary" onClick={() => {}} disabled={!selectedOption} className="w-full mt-4" leftIcon={<CheckCircle className="w-4 h-4" />}>Проголосовать</Button>) : (<p className="text-sm text-gray-400 mt-4 text-center">Всего голосов: {poll.totalVotes.toLocaleString()}</p>)}
    </div>
  );
};

const MarketplaceCard = ({ marketplace, media }: { marketplace: NonNullable<Post['marketplace']>; media: string | null }) => (
  <div className="p-4 rounded-xl bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 border border-cyber-cyan/20">
    {media && (<img src={media} alt={marketplace.productName} className="w-full rounded-xl mb-4 object-cover max-h-[400px]" />)}
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="text-lg font-bold text-white">{marketplace.productName}</h3>
        <p className="text-sm text-gray-400">{marketplace.inStock ? (<span className="text-cyber-green">✓ В наличии</span>) : (<span className="text-cyber-red">✗ Нет в наличии</span>)}</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-cyber-cyan">{marketplace.price}</p>
        <p className="text-sm text-gray-400">{marketplace.currency}</p>
      </div>
    </div>
    <button
      disabled={!marketplace.inStock}
      className="w-full py-3 px-4 rounded-xl bg-black/50 border border-cyan-500 text-cyan-400 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
    >
      <ShoppingCart className="w-4 h-4" />
      Купить за {marketplace.price} {marketplace.currency}
    </button>
  </div>
);

const EventCard = ({ event, media }: { event: NonNullable<Post['event']>; media: string | null }) => (
  <div className="p-4 rounded-xl bg-gradient-to-br from-cyber-purple/10 to-cyber-pink/10 border border-cyber-purple/20">
    {media && (<img src={media} alt={event.title} className="w-full rounded-xl mb-4 object-cover max-h-[300px]" />)}
    <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 text-gray-300"><Calendar className="w-4 h-4 text-cyber-cyan" /><span className="text-sm">{event.date}</span></div>
      <div className="flex items-center gap-2 text-gray-300"><Clock3 className="w-4 h-4 text-cyber-cyan" /><span className="text-sm">{event.time}</span></div>
      <div className="flex items-center gap-2 text-gray-300"><MapPin className="w-4 h-4 text-cyber-cyan" /><span className="text-sm">{event.location}</span>{event.isOnline && (<span className="px-2 py-0.5 text-xs rounded-full bg-cyber-cyan/20 text-cyber-cyan">Online</span>)}</div>
    </div>
    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
      <span className="flex items-center gap-1"><Users className="w-4 h-4" />{event.going} пойдут</span>
      <span className="flex items-center gap-1"><Heart className="w-4 h-4" />{event.interested} заинтересованы</span>
    </div>
    <div className="flex gap-2">
      <Button variant="primary" className="flex-1 bg-gradient-to-r from-cyber-green to-cyber-cyan" leftIcon={<CheckCircle className="w-4 h-4" />}>Пойду</Button>
      <Button variant="outline" className="flex-1 border-cyber-pink text-cyber-pink" leftIcon={<Heart className="w-4 h-4" />}>Интересно</Button>
    </div>
  </div>
);

const LongreadCard = ({ longread, media, content }: { longread: NonNullable<Post['longread']>; media: string | null; content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="p-4 rounded-xl bg-cyber-dark/30 border border-white/5">
      {media && (<img src={media} alt={longread.title} className="w-full rounded-xl mb-4 object-cover max-h-[400px]" />)}
      <div className="flex items-center gap-2 mb-2"><File className="w-4 h-4 text-cyber-cyan" /><span className="text-xs text-cyber-cyan">{longread.readTime} мин чтения</span></div>
      <h3 className="text-xl font-bold text-white mb-3">{longread.title}</h3>
      <p className={cn('text-gray-300', !isExpanded && 'line-clamp-3')}>{isExpanded ? content : longread.preview}</p>
      <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="mt-3 text-cyber-cyan" rightIcon={isExpanded ? <X className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}>{isExpanded ? 'Свернуть' : 'Читать полностью...'}</Button>
    </div>
  );
};

const GiftCard = ({ gift }: { gift: NonNullable<Post['gift']> }) => (
  <div className="p-6 rounded-xl bg-gradient-to-br from-cyber-pink/20 to-cyber-purple/20 border border-cyber-pink/30">
    <div className="flex flex-col items-center text-center">
      <div className="text-6xl mb-4 animate-bounce">{gift.giftImage}</div>
      <h3 className="text-lg font-bold text-white mb-2">NFT Подарок</h3>
      <p className="text-gray-300 mb-4"><span className="text-cyber-cyan font-semibold">{gift.from}</span> подарил <span className="text-cyber-pink font-semibold">{gift.to}</span></p>
      <div className="px-4 py-2 rounded-full bg-cyber-dark/50 border border-white/10">
        <p className="text-sm text-cyber-cyan font-mono">{gift.giftName}</p>
        <p className="text-xs text-gray-400 font-mono">NFT #{gift.nftId}</p>
      </div>
    </div>
  </div>
);

const PostCard = ({ post, isUnlocked, onUnlock, onLike }: { post: Post; isUnlocked: boolean; onUnlock: (id: string, price: number) => void; onLike: (id: string) => void }) => {
  const isPremiumLocked = post.isPremium && !isUnlocked;
  return (
    <Card className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple overflow-hidden">
              {post.author.avatar ? (<img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center"><span className="text-lg font-bold text-white">{post.author.username[0].toUpperCase()}</span></div>)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{post.author.username}</span>
                {post.author.isVerified && <Verified className="w-4 h-4 text-cyber-cyan" />}
                {post.isPremium && <Crown className="w-4 h-4 text-cyber-purple" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400"><Clock className="w-3 h-3" />{formatRelativeTime(post.timestamp)}</div>
            </div>
          </div>
          {post.isPremium && (<div className="px-3 py-1 rounded-full bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20 border border-cyber-purple/30"><span className="text-xs font-bold text-cyber-purple">PREMIUM {post.price > 0 && `${post.price} DAI`}</span></div>)}
        </div>
      </div>
      <div className={cn(isPremiumLocked && 'relative')}>
        {isPremiumLocked ? (
          <div className="relative">
            <div className="filter backdrop-blur-xl blur-xl">
              <p className="text-white whitespace-pre-wrap p-4 opacity-30">{post.content}</p>
              {post.media && (<img src={post.media} alt="Blurred" className="w-full object-cover max-h-[500px]" />)}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center mb-4 neon-purple"><Lock className="w-10 h-10 text-white" /></div>
              <h3 className="text-2xl font-bold text-white mb-2 text-center">Эксклюзивный контент</h3>
              <p className="text-gray-300 text-center mb-6">Доступно за {post.price} DAI</p>
              <Button variant="primary" onClick={() => onUnlock(post.id, post.price)} leftIcon={<Unlock className="w-5 h-5" />} className="bg-gradient-to-r from-cyber-purple to-cyber-pink">Unlock за {post.price} DAI</Button>
            </div>
          </div>
        ) : (
          <>
            {post.type === 'poll' && post.poll && (<PollCard poll={post.poll} />)}
            {post.type === 'marketplace' && post.marketplace && (<MarketplaceCard marketplace={post.marketplace} media={post.media} />)}
            {post.type === 'event' && post.event && (<EventCard event={post.event} media={post.media} />)}
            {post.type === 'longread' && post.longread && (<LongreadCard longread={post.longread} media={post.media} content={post.content} />)}
            {post.type === 'gift' && post.gift && (<GiftCard gift={post.gift} />)}
            {(post.type === 'text' || post.type === 'image' || post.type === 'video') && (
              <>
                <div className="p-4"><p className="text-white whitespace-pre-wrap">{post.content}</p></div>
                {post.media && (
                  <div className="relative">
                    {post.type === 'video' ? (<div className="aspect-video bg-cyber-dark flex items-center justify-center"><Video className="w-12 h-12 text-gray-500" /></div>) : (<img src={post.media} alt="Post media" className="w-full object-cover max-h-[500px]" />)}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => onLike(post.id)} className={cn('flex items-center gap-2 text-gray-300 hover:scale-110 transition-transform', post.isLiked && 'text-cyber-pink')}>
            <Heart className={cn('w-6 h-6', post.isLiked && 'fill-current animate-pulse')} />
            <span className="text-sm">{post.likes}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:scale-110 transition-transform"><MessageCircle className="w-6 h-6" /><span className="text-sm">{post.comments}</span></button>
          <button className="flex items-center gap-2 text-gray-300 hover:scale-110 transition-transform"><Share2 className="w-6 h-6" /></button>
        </div>
        <Button variant="outline" size="sm" leftIcon={<DollarSign className="w-4 h-4" />} className="text-cyber-green">Донат</Button>
      </div>
    </Card>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <Card className="glass-card">
    <div className="flex items-center gap-3">
      <div className={cn('p-2 rounded-lg', color === 'cyber-cyan' && 'bg-cyber-cyan/10 text-cyber-cyan', color === 'cyber-purple' && 'bg-cyber-purple/10 text-cyber-purple', color === 'cyber-green' && 'bg-cyber-green/10 text-cyber-green', color === 'cyber-pink' && 'bg-cyber-pink/10 text-cyber-pink')}>
        <Activity className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-xl font-bold text-white">{value.toLocaleString()}</p>
      </div>
    </div>
  </Card>
);

export const SocialPage = () => {
  const [posts] = useState<Post[]>(MOCK_POSTS);
  const [unlockedPosts, setUnlockedPosts] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [algorithm, setAlgorithm] = useState<Algorithm>('foryou');

  const filteredByCategory = useMemo(() => {
    return posts.filter((post) => {
      switch (activeCategory) {
        case 'microblog': return post.type === 'text' && !post.isPremium;
        case 'media': return (post.type === 'image' || post.type === 'video') && !post.isPremium;
        case 'clips': return post.type === 'clip';
        case 'marketplace': return post.type === 'marketplace';
        case 'events': return post.type === 'event';
        case 'exclusive': return post.isPremium;
        default: return true;
      }
    });
  }, [posts, activeCategory]);

  const sortedPosts = useMemo(() => {
    return sortPosts(filteredByCategory, algorithm);
  }, [filteredByCategory, algorithm]);

  const categoryCounts = {
    all: posts.length,
    microblog: posts.filter((p) => p.type === 'text' && !p.isPremium).length,
    media: posts.filter((p) => (p.type === 'image' || p.type === 'video') && !p.isPremium).length,
    clips: posts.filter((p) => p.type === 'clip').length,
    marketplace: posts.filter((p) => p.type === 'marketplace').length,
    events: posts.filter((p) => p.type === 'event').length,
    exclusive: posts.filter((p) => p.isPremium).length,
  };

  const handleUnlock = (postId: string, price: number) => { setUnlockedPosts(new Set(unlockedPosts).add(postId)); };
  const handleLike = (postId: string) => { console.log('Like:', postId); };
  
  const clips = sortedPosts.filter((p) => p.type === 'clip');
  const isClipsMode = activeCategory === 'clips';
  const regularPosts = sortedPosts.filter((p) => p.type !== 'clip');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3"><Zap className="w-8 h-8 text-cyber-cyan" />Social Hub</h1>
          <p className="text-gray-400">Web3 Super-App с прозрачными алгоритмами</p>
        </div>
        <Button variant="primary" leftIcon={<Zap className="w-5 h-5" />}>Создать пост</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Постов" value={categoryCounts.all} color="cyber-cyan" />
        <StatCard label="Клипов" value={categoryCounts.clips} color="cyber-purple" />
        <StatCard label="Событий" value={categoryCounts.events} color="cyber-pink" />
        <StatCard label="Товаров" value={categoryCounts.marketplace} color="cyber-green" />
      </div>

      <Card className="glass-card">
        <div className="flex items-center gap-2 p-2 overflow-x-auto scrollbar-hide">
          <CategoryTab category="all" activeCategory={activeCategory} onClick={setActiveCategory} count={categoryCounts.all} />
          <CategoryTab category="microblog" activeCategory={activeCategory} onClick={setActiveCategory} count={categoryCounts.microblog} />
          <CategoryTab category="media" activeCategory={activeCategory} onClick={setActiveCategory} count={categoryCounts.media} />
          <CategoryTab category="clips" activeCategory={activeCategory} onClick={setActiveCategory} count={categoryCounts.clips} />
          <CategoryTab category="marketplace" activeCategory={activeCategory} onClick={setActiveCategory} count={categoryCounts.marketplace} />
          <CategoryTab category="events" activeCategory={activeCategory} onClick={setActiveCategory} count={categoryCounts.events} />
          <CategoryTab category="exclusive" activeCategory={activeCategory} onClick={setActiveCategory} count={categoryCounts.exclusive} />
        </div>
      </Card>

      <Card className="glass-card">
        <div className="flex items-center justify-center gap-2 p-3">
          <AlgorithmTab algorithm="foryou" activeAlgorithm={algorithm} onClick={setAlgorithm} />
          <AlgorithmTab algorithm="trending" activeAlgorithm={algorithm} onClick={setAlgorithm} />
          <AlgorithmTab algorithm="latest" activeAlgorithm={algorithm} onClick={setAlgorithm} />
        </div>
      </Card>

      <div className="max-w-2xl mx-auto w-full">
        {isClipsMode ? (
          clips.length > 0 ? (<ClipsFeed clips={clips} onLike={handleLike} />) : (<Card className="glass-card"><div className="text-center py-12 text-gray-400"><Video className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>В этой категории пока нет клипов</p></div></Card>)
        ) : (
          <div className="space-y-4">
            {regularPosts.length === 0 ? (<Card className="glass-card"><div className="text-center py-12 text-gray-400"><Zap className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>В этой категории пока нет постов</p></div></Card>) : (
              regularPosts.map((post, index) => (<motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}><PostCard post={post} isUnlocked={unlockedPosts.has(post.id)} onUnlock={handleUnlock} onLike={handleLike} /></motion.div>))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
