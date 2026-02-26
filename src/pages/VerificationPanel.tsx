import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Mail,
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  Upload,
  Eye,
  Download,
  AlertTriangle,
  BadgeCheck,
  Crown,
  Sparkles,
  Users,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

interface VerificationRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  avatar: string;
  type: 'creator' | 'admin' | 'partner' | 'premium';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  documents: {
    type: string;
    url: string;
    status: 'pending' | 'verified' | 'rejected';
  }[];
  reason: string;
  adminNotes?: string;
}

const VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'v1',
    userId: 'u1',
    username: '@crypto_queen',
    email: 'queen@crypto.com',
    avatar: 'https://picsum.photos/seed/vq1/100/100',
    type: 'creator',
    status: 'pending',
    submittedAt: new Date(Date.now() - 3600000),
    documents: [
      { type: 'Passport', url: '#', status: 'pending' },
      { type: 'Proof of Ownership', url: '#', status: 'pending' },
    ],
    reason: 'Создатель популярного крипто-канала (500K+ подписчиков)',
  },
  {
    id: 'v2',
    userId: 'u2',
    username: '@neo_matrix',
    email: 'neo@matrix.org',
    avatar: 'https://picsum.photos/seed/vq2/100/100',
    type: 'admin',
    status: 'pending',
    submittedAt: new Date(Date.now() - 7200000),
    documents: [
      { type: 'ID Card', url: '#', status: 'pending' },
      { type: 'Admin Certificate', url: '#', status: 'pending' },
    ],
    reason: 'Администратор ноды matrix.org',
  },
  {
    id: 'v3',
    userId: 'u3',
    username: '@vitalik_fan',
    email: 'vitalik@eth.org',
    avatar: 'https://picsum.photos/seed/vq3/100/100',
    type: 'partner',
    status: 'pending',
    submittedAt: new Date(Date.now() - 86400000),
    documents: [
      { type: 'Business License', url: '#', status: 'verified' },
      { type: 'Partnership Agreement', url: '#', status: 'pending' },
    ],
    reason: 'Официальный партнёр Ethereum Foundation',
  },
  {
    id: 'v4',
    userId: 'u4',
    username: '@alice_crypto',
    email: 'alice@quantum.io',
    avatar: 'https://picsum.photos/seed/vq4/100/100',
    type: 'premium',
    status: 'approved',
    submittedAt: new Date(Date.now() - 172800000),
    documents: [
      { type: 'ID Card', url: '#', status: 'verified' },
    ],
    reason: 'Premium подписчик с подтверждённой личностью',
    adminNotes: 'Документы проверены, всё в порядке',
  },
  {
    id: 'v5',
    userId: 'u5',
    username: '@bob_trader',
    email: 'bob@trading.com',
    avatar: 'https://picsum.photos/seed/vq5/100/100',
    type: 'premium',
    status: 'rejected',
    submittedAt: new Date(Date.now() - 259200000),
    documents: [
      { type: 'ID Card', url: '#', status: 'rejected' },
    ],
    reason: 'Premium подписчик',
    adminNotes: 'Документы не соответствуют требованиям',
  },
];

const VERIFICATION_TYPES = [
  { id: 'creator', name: 'Создатель', icon: Crown, color: 'text-amber-400', description: 'Для создателей контента и лидеров мнений' },
  { id: 'admin', name: 'Администратор', icon: Shield, color: 'text-cyan-400', description: 'Для админов нод и серверов' },
  { id: 'partner', name: 'Партнёр', icon: BadgeCheck, color: 'text-purple-400', description: 'Для официальных партнёров' },
  { id: 'premium', name: 'Premium', icon: Sparkles, color: 'text-pink-400', description: 'Для Premium пользователей' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}> = ({ title, value, icon, color, trend }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
    <div className="flex items-center justify-between mb-4">
      <div className={cn('p-3 rounded-xl bg-white/10', color)}>{icon}</div>
      {trend && (
        <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</p>
    <p className="text-white/60 text-sm">{title}</p>
  </div>
);

const RequestCard: React.FC<{
  request: VerificationRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (request: VerificationRequest) => void;
}> = ({ request, onApprove, onReject, onViewDetails }) => {
  const TypeIcon = VERIFICATION_TYPES.find(t => t.id === request.type)?.icon || Shield;
  const typeConfig = VERIFICATION_TYPES.find(t => t.id === request.type);

  return (
    <div className={cn(
      'bg-white/5 border rounded-2xl p-6 backdrop-blur-xl transition-all hover:border-white/20',
      request.status === 'pending' && 'border-amber-500/30',
      request.status === 'approved' && 'border-green-500/30',
      request.status === 'rejected' && 'border-red-500/30'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img src={request.avatar} alt={request.username} className="w-14 h-14 rounded-full border-2 border-white/20" />
            <div className={cn(
              'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-900',
              request.status === 'pending' && 'bg-amber-500',
              request.status === 'approved' && 'bg-green-500',
              request.status === 'rejected' && 'bg-red-500'
            )}>
              {request.status === 'pending' && <Clock className="w-3 h-3 text-white" />}
              {request.status === 'approved' && <CheckCircle className="w-3 h-3 text-white" />}
              {request.status === 'rejected' && <XCircle className="w-3 h-3 text-white" />}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-bold text-lg">{request.username}</h3>
              <TypeIcon className={cn('w-5 h-5', typeConfig?.color)} />
            </div>
            <p className="text-white/60 text-sm">{request.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold',
                request.status === 'pending' && 'bg-amber-500/20 text-amber-400',
                request.status === 'approved' && 'bg-green-500/20 text-green-400',
                request.status === 'rejected' && 'bg-red-500/20 text-red-400'
              )}>
                {request.status === 'pending' && 'На проверке'}
                {request.status === 'approved' && 'Одобрено'}
                {request.status === 'rejected' && 'Отклонено'}
              </span>
              <span className="text-white/40 text-xs">
                {typeConfig?.name}
              </span>
            </div>
          </div>
        </div>
        <span className="text-white/40 text-xs whitespace-nowrap">
          {Math.round((Date.now() - request.submittedAt.getTime()) / 3600000)}ч назад
        </span>
      </div>

      {/* Reason */}
      <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
        <p className="text-white/80 text-sm">{request.reason}</p>
      </div>

      {/* Documents */}
      <div className="mb-4">
        <p className="text-white/60 text-xs mb-2 flex items-center space-x-1">
          <FileText className="w-3 h-3" />
          <span>Документы</span>
        </p>
        <div className="flex space-x-2">
          {request.documents.map((doc, idx) => (
            <div key={idx} className={cn(
              'flex-1 p-2 rounded-lg border text-center text-xs',
              doc.status === 'pending' && 'bg-amber-500/10 border-amber-500/30 text-amber-400',
              doc.status === 'verified' && 'bg-green-500/10 border-green-500/30 text-green-400',
              doc.status === 'rejected' && 'bg-red-500/10 border-red-500/30 text-red-400'
            )}>
              <p className="font-medium">{doc.type}</p>
              <p className="text-white/40 text-xs mt-0.5">
                {doc.status === 'pending' && 'На проверке'}
                {doc.status === 'verified' && 'Проверен'}
                {doc.status === 'rejected' && 'Отклонён'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Notes */}
      {request.adminNotes && (
        <div className="mb-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
          <div className="flex items-center space-x-2 mb-1">
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold">Заметка админа</span>
          </div>
          <p className="text-blue-200 text-sm">{request.adminNotes}</p>
        </div>
      )}

      {/* Actions */}
      {request.status === 'pending' && (
        <div className="flex space-x-3">
          <button
            onClick={() => onApprove(request.id)}
            className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Одобрить</span>
          </button>
          <button
            onClick={() => onReject(request.id)}
            className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <XCircle className="w-4 h-4" />
            <span>Отклонить</span>
          </button>
          <button
            onClick={() => onViewDetails(request)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Детали</span>
          </button>
        </div>
      )}

      {request.status !== 'pending' && (
        <button
          onClick={() => onViewDetails(request)}
          className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
        >
          Просмотреть детали
        </button>
      )}
    </div>
  );
};

const VerificationDetailsModal: React.FC<{
  request: VerificationRequest | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ request, onClose, onApprove, onReject }) => {
  const [adminNotes, setAdminNotes] = useState(request?.adminNotes || '');

  if (!request) return null;

  const typeConfig = VERIFICATION_TYPES.find(t => t.id === request.type);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">Заявка на верификацию</h2>
              <p className="text-white/60 text-sm">ID: {request.id}</p>
            </div>
          </div>
          <div className={cn(
            'px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1',
            request.status === 'pending' && 'bg-amber-500/20 text-amber-400',
            request.status === 'approved' && 'bg-green-500/20 text-green-400',
            request.status === 'rejected' && 'bg-red-500/20 text-red-400'
          )}>
            {request.status === 'pending' && <Clock className="w-3 h-3" />}
            {request.status === 'approved' && <CheckCircle className="w-3 h-3" />}
            {request.status === 'rejected' && <XCircle className="w-3 h-3" />}
            <span>
              {request.status === 'pending' && 'На проверке'}
              {request.status === 'approved' && 'Одобрено'}
              {request.status === 'rejected' && 'Отклонено'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <img src={request.avatar} alt={request.username} className="w-16 h-16 rounded-full border-2 border-white/20" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-bold text-lg">{request.username}</h3>
                {typeConfig?.icon && <typeConfig.icon className={cn('w-5 h-5', typeConfig.color)} />}
              </div>
              <p className="text-white/60 text-sm">{request.email}</p>
              <p className="text-white/40 text-xs mt-1">Тип: {typeConfig?.name}</p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Причина запроса</span>
            </h3>
            <p className="text-white/80 bg-white/5 p-4 rounded-xl border border-white/10">{request.reason}</p>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Загруженные документы</span>
            </h3>
            <div className="space-y-2">
              {request.documents.map((doc, idx) => (
                <div key={idx} className={cn(
                  'flex items-center justify-between p-4 rounded-xl border',
                  doc.status === 'pending' && 'bg-amber-500/10 border-amber-500/30',
                  doc.status === 'verified' && 'bg-green-500/10 border-green-500/30',
                  doc.status === 'rejected' && 'bg-red-500/10 border-red-500/30'
                )}>
                  <div className="flex items-center space-x-3">
                    <FileText className={cn('w-5 h-5',
                      doc.status === 'pending' && 'text-amber-400',
                      doc.status === 'verified' && 'text-green-400',
                      doc.status === 'rejected' && 'text-red-400'
                    )} />
                    <div>
                      <p className="text-white font-medium">{doc.type}</p>
                      <p className={cn('text-xs',
                        doc.status === 'pending' && 'text-amber-400/60',
                        doc.status === 'verified' && 'text-green-400/60',
                        doc.status === 'rejected' && 'text-red-400/60'
                      )}>
                        {doc.status === 'pending' && 'Ожидает проверки'}
                        {doc.status === 'verified' && 'Проверен'}
                        {doc.status === 'rejected' && 'Отклонён'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Заметки админа</span>
            </h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Добавьте заметку..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50 min-h-[100px]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        {request.status === 'pending' && (
          <div className="sticky bottom-0 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-white/10 p-6 flex space-x-3">
            <button
              onClick={() => { onApprove(request.id); onClose(); }}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Одобрить верификацию</span>
            </button>
            <button
              onClick={() => { onReject(request.id); onClose(); }}
              className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <XCircle className="w-5 h-5" />
              <span>Отклонить</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const VerificationPanel: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<VerificationRequest[]>(VERIFICATION_REQUESTS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const matchesType = typeFilter === 'all' || req.type === typeFilter;
    const matchesSearch = req.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesType && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <BadgeCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Верификация аккаунтов</h1>
              <p className="text-white/60">Проверка документов и подтверждение аккаунтов</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Всего заявок"
            value={stats.total}
            icon={<FileText className="w-6 h-6 text-white" />}
            color="text-white"
          />
          <StatCard
            title="На проверке"
            value={stats.pending}
            icon={<Clock className="w-6 h-6 text-amber-400" />}
            color="bg-amber-500/20"
            trend="+12%"
          />
          <StatCard
            title="Одобрено"
            value={stats.approved}
            icon={<CheckCircle className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
          />
          <StatCard
            title="Отклонено"
            value={stats.rejected}
            icon={<XCircle className="w-6 h-6 text-red-400" />}
            color="bg-red-500/20"
          />
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по username или email..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/40" />
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    filter === status
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  {status === 'all' && 'Все'}
                  {status === 'pending' && 'На проверке'}
                  {status === 'approved' && 'Одобрено'}
                  {status === 'rejected' && 'Отклонено'}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all" className="bg-slate-900">Все типы</option>
              {VERIFICATION_TYPES.map(t => (
                <option key={t.id} value={t.id} className="bg-slate-900">{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Verification Types Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {VERIFICATION_TYPES.map((type) => (
            <div key={type.id} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-2">
                <type.icon className={cn('w-5 h-5', type.color)} />
                <span className="text-white font-semibold">{type.name}</span>
              </div>
              <p className="text-white/60 text-xs">{type.description}</p>
            </div>
          ))}
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={setSelectedRequest}
            />
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-white/20" />
            </div>
            <p className="text-white/60">Заявки не найдены</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <VerificationDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default VerificationPanel;
