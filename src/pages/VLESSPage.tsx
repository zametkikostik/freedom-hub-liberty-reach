import React, { useState, useEffect } from 'react';
import {
  Shield, Globe, Zap, Lock, Unlock, Wifi, WifiOff,
  Server, Activity, Clock, Download, Upload,
  Settings, RefreshCw, CheckCircle, AlertTriangle,
  Radio, Signal, Terminal, Fingerprint, Key,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
type NodeType = 'free' | 'premium';

interface ServerNode {
  id: string;
  country: string;
  flag: string;
  city: string;
  protocol: string;
  load: number;
  ping: number;
  type: NodeType;
  isUnlocked?: boolean;
}

interface Telemetry {
  ping: number;
  download: number;
  upload: number;
  ip: string;
}

const FREE_NODES: ServerNode[] = [
  { id: 'f1', country: 'Germany', flag: '🇩🇪', city: 'Frankfurt', protocol: 'XTLS-Reality', load: 45, ping: 24, type: 'free' },
  { id: 'f2', country: 'Netherlands', flag: '🇳🇱', city: 'Amsterdam', protocol: 'VLESS-GRPC', load: 62, ping: 31, type: 'free' },
  { id: 'f3', country: 'Finland', flag: '🇫🇮', city: 'Helsinki', protocol: 'VMESS-TLS', load: 38, ping: 28, type: 'free' },
  { id: 'f4', country: 'Poland', flag: '🇵🇱', city: 'Warsaw', protocol: 'TROJAN-GFW', load: 55, ping: 35, type: 'free' },
  { id: 'f5', country: 'Czech Republic', flag: '🇨🇿', city: 'Prague', protocol: 'SHADOWSOCKS', load: 71, ping: 42, type: 'free' },
];

const PREMIUM_NODES: ServerNode[] = [
  { id: 'p1', country: 'Switzerland', flag: '🇨🇭', city: 'Zurich', protocol: 'VLESS-XTLS', load: 12, ping: 8, type: 'premium', isUnlocked: false },
  { id: 'p2', country: 'Iceland', flag: '🇮🇸', city: 'Reykjavik', protocol: 'VLESS-REALITY', load: 8, ping: 6, type: 'premium', isUnlocked: false },
  { id: 'p3', country: 'Singapore', flag: '🇸🇬', city: 'Singapore', protocol: 'VLESS-GRPC', load: 15, ping: 9, type: 'premium', isUnlocked: true },
  { id: 'p4', country: 'Japan', flag: '🇯🇵', city: 'Tokyo', protocol: 'VLESS-XTLS', load: 18, ping: 11, type: 'premium', isUnlocked: false },
];

const MOCK_TELEMETRY: Telemetry = { ping: 24, download: 847.5, upload: 423.2, ip: '185.234.***.***' };

const Proxy: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [selectedNode, setSelectedNode] = useState<ServerNode | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [smartRouting, setSmartRouting] = useState(true);
  const [globalMode, setGlobalMode] = useState(false);
  const [killSwitch, setKillSwitch] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState<string | null>(null);

  const handleConnect = () => {
    if (connectionStatus === 'connected') {
      setConnectionStatus('disconnected');
      setTelemetry(null);
      return;
    }
    if (!selectedNode) {
      const bestNode = FREE_NODES.reduce((best, current) => current.ping < best.ping ? current : best);
      setSelectedNode(bestNode);
    }
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
      setTelemetry(MOCK_TELEMETRY);
    }, 2500);
  };

  useEffect(() => {
    if (connectionStatus !== 'connected') return;
    const interval = setInterval(() => {
      setTelemetry(prev => prev ? ({
        ping: prev.ping + Math.floor(Math.random() * 6) - 3,
        download: prev.download + (Math.random() * 20 - 10),
        upload: prev.upload + (Math.random() * 10 - 5),
        ip: prev.ip,
      }) : null);
    }, 3000);
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const handleUnlockNode = (nodeId: string) => {
    setIsUnlocking(nodeId);
    setTimeout(() => { setIsUnlocking(null); }, 2000);
  };

  const renderConnectionButton = () => {
    const config = {
      disconnected: { bg: "from-gray-700/50 to-gray-900/50 border-gray-600/50", text: "text-gray-400", subtext: "System Offline", icon: <WifiOff className="w-16 h-16 text-gray-500" />, pulse: false },
      connecting: { bg: "from-amber-500/30 to-orange-600/30 border-amber-500/50", text: "text-amber-400", subtext: "Handshake with VLESS Node...", icon: <RefreshCw className="w-16 h-16 text-amber-400 animate-spin" />, pulse: true },
      connected: { bg: "from-emerald-500/30 to-green-600/30 border-emerald-500/50", text: "text-emerald-400", subtext: "Secured & Connected", icon: <Shield className="w-16 h-16 text-emerald-400" />, pulse: false },
      error: { bg: "from-red-500/30 to-red-900/30 border-red-500/50", text: "text-red-400", subtext: "Connection Failed", icon: <AlertTriangle className="w-16 h-16 text-red-400" />, pulse: false },
    };
    const c = config[connectionStatus];

    return (
      <div className="flex flex-col items-center space-y-6">
        <button onClick={handleConnect} className={cn("relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-500 cursor-pointer backdrop-blur-xl border-4 shadow-2xl", c.bg)}>
          {c.pulse && (<><div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping" /><div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-pulse" style={{ animationDelay: '200ms' }} /><div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-pulse" style={{ animationDelay: '400ms' }} /></>)}
          {connectionStatus === 'connected' && (<><div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse" /><div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-xl" /></>)}
          <div className="relative z-10 flex flex-col items-center space-y-3">
            {c.icon}
            <div className="text-center">
              <p className={cn("text-2xl font-bold", c.text)}>{connectionStatus === 'disconnected' ? 'CONNECT' : connectionStatus === 'connecting' ? 'CONNECTING...' : 'CONNECTED'}</p>
              <p className="text-sm text-white/60 mt-1">{c.subtext}</p>
            </div>
          </div>
        </button>
        {connectionStatus === 'connected' && telemetry && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-4 text-center">
              <Activity className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-mono font-bold text-white">{telemetry.ping}<span className="text-sm text-white/60 ml-1">ms</span></p>
              <p className="text-xs text-white/40">Ping</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-4 text-center">
              <Download className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-mono font-bold text-white">{telemetry.download.toFixed(1)}<span className="text-sm text-white/60 ml-1">Mbps</span></p>
              <p className="text-xs text-white/40">Download</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-4 text-center">
              <Upload className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-mono font-bold text-white">{telemetry.upload.toFixed(1)}<span className="text-sm text-white/60 ml-1">Mbps</span></p>
              <p className="text-xs text-white/40">Upload</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-4 text-center">
              <Globe className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <p className="text-lg font-mono font-bold text-white">{telemetry.ip}</p>
              <p className="text-xs text-white/40">Masked IP</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNodeCard = (node: ServerNode) => (
    <div key={node.id} onClick={() => node.type === 'free' && setSelectedNode(node)} className={cn("backdrop-blur-xl rounded-2xl border p-5 transition-all cursor-pointer", node.type === 'free' ? selectedNode?.id === node.id ? "bg-cyan-500/20 border-cyan-500/40 shadow-lg shadow-cyan-500/20" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" : node.isUnlocked ? "bg-gradient-to-br from-amber-500/20 to-purple-500/20 border-amber-500/40" : "bg-white/5 border-white/10 opacity-70")}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">{node.flag}</span>
          <div><p className="text-white font-semibold">{node.city}</p><p className="text-xs text-white/60">{node.country}</p></div>
        </div>
        {node.type === 'premium' && <div className="px-2 py-1 bg-gradient-to-r from-amber-500 to-purple-500 rounded-lg text-xs font-bold text-white">PREMIUM</div>}
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60 flex items-center space-x-1"><Terminal className="w-3 h-3" /><span>{node.protocol}</span></span>
          <span className="text-white/60 flex items-center space-x-1"><Signal className="w-3 h-3" /><span>{node.load}% Load</span></span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className={cn("h-full transition-all", node.load > 70 ? "bg-red-500" : node.load > 40 ? "bg-yellow-500" : "bg-green-500")} style={{ width: `${node.load}%` }} /></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-sm">
          <span className={cn("font-mono font-bold", node.ping < 20 ? "text-green-400" : node.ping < 50 ? "text-yellow-400" : "text-red-400")}>{node.ping}ms</span>
          {selectedNode?.id === node.id && <CheckCircle className="w-4 h-4 text-cyan-400" />}
        </div>
        {node.type === 'premium' && !node.isUnlocked && (
          <button onClick={(e) => { e.stopPropagation(); handleUnlockNode(node.id); }} disabled={isUnlocking === node.id} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1", isUnlocking === node.id ? "bg-white/10 text-white/60" : "bg-gradient-to-r from-amber-500 to-purple-500 text-white hover:from-amber-400 hover:to-purple-400")}>
            {isUnlocking === node.id ? (<><RefreshCw className="w-3 h-3 animate-spin" /><span>Processing...</span></>) : (<><Unlock className="w-3 h-3" /><span>5 DAI/mo</span></>)}
          </button>
        )}
      </div>
    </div>
  );

  const renderRoutingSettings = () => (
    <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
      <div className="flex items-center space-x-3 mb-6"><Settings className="w-6 h-6 text-cyan-400" /><h3 className="text-xl font-bold text-white">Routing Rules</h3></div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", smartRouting ? "bg-cyan-500/20" : "bg-white/10")}><Fingerprint className={cn("w-6 h-6", smartRouting ? "text-cyan-400" : "text-white/40")} /></div>
            <div><p className="text-white font-semibold">Smart Routing</p><p className="text-xs text-white/60">Proxy only blocked sites</p></div>
          </div>
          <button onClick={() => { setSmartRouting(true); setGlobalMode(false); }} className={cn("relative w-14 h-7 rounded-full transition-all", smartRouting ? "bg-cyan-500" : "bg-white/20")}><div className={cn("absolute top-1 w-5 h-5 bg-white rounded-full transition-all", smartRouting ? "left-8" : "left-1")} /></button>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", globalMode ? "bg-purple-500/20" : "bg-white/10")}><Globe className={cn("w-6 h-6", globalMode ? "text-purple-400" : "text-white/40")} /></div>
            <div><p className="text-white font-semibold">Global Mode</p><p className="text-xs text-white/60">All traffic through VLESS</p></div>
          </div>
          <button onClick={() => { setGlobalMode(true); setSmartRouting(false); }} className={cn("relative w-14 h-7 rounded-full transition-all", globalMode ? "bg-purple-500" : "bg-white/20")}><div className={cn("absolute top-1 w-5 h-5 bg-white rounded-full transition-all", globalMode ? "left-8" : "left-1")} /></button>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", killSwitch ? "bg-red-500/20" : "bg-white/10")}><Lock className={cn("w-6 h-6", killSwitch ? "text-red-400" : "text-white/40")} /></div>
            <div><p className="text-white font-semibold">Kill Switch</p><p className="text-xs text-white/60">Block internet on disconnect</p></div>
          </div>
          <button onClick={() => setKillSwitch(!killSwitch)} className={cn("relative w-14 h-7 rounded-full transition-all", killSwitch ? "bg-red-500" : "bg-white/20")}><div className={cn("absolute top-1 w-5 h-5 bg-white rounded-full transition-all", killSwitch ? "left-8" : "left-1")} /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4"><Shield className="w-10 h-10 text-cyan-400" /><h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">VLESS Proxy</h1></div>
          <p className="text-white/60">DPI Bypass • Post-Quantum Encryption • Censorship Resistance</p>
        </div>
        <div className="mb-12">{renderConnectionButton()}</div>
        <div className="space-y-8 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4"><Radio className="w-5 h-5 text-cyan-400" /><h2 className="text-xl font-bold text-white">Free Community Nodes</h2><span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">Speed Limited</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{FREE_NODES.map(renderNodeCard)}</div>
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-4"><Zap className="w-5 h-5 text-amber-400" /><h2 className="text-xl font-bold text-white">Premium Dedicated Nodes</h2><span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">Ping &lt;10ms</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{PREMIUM_NODES.map(renderNodeCard)}</div>
          </div>
        </div>
        {renderRoutingSettings()}
        <div className="mt-8 p-4 backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/20">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-cyan-400 mt-0.5" />
            <div><p className="text-white font-semibold text-sm">Military-Grade Encryption</p><p className="text-white/60 text-xs mt-1">Your traffic is protected with VLESS-XTLS-Reality protocol featuring post-quantum cryptographic algorithms.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proxy;

export const VLESSPage: React.FC = Proxy;
