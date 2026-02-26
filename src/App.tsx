import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/pages/AuthPage';
import { Layout } from '@/components/layout/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { MessengerPage } from '@/pages/MessengerPage';
import { VideoPageComponent as VideoPage } from '@/pages/VideoPage';
import { AIHubComponent as AIHub } from '@/pages/AIHub';
import { SettingsPage } from '@/pages/SettingsPage';
import { EmailPage } from '@/pages/EmailPage';
import { VLESSPage } from '@/pages/VLESSPage';
import { SocialPage } from '@/pages/SocialPage';
import AdminPanel from '@/pages/AdminPanel';
import VerificationPanel from '@/pages/VerificationPanel';
import PremiumPanel from '@/pages/PremiumPanel';
import UsersPanel from '@/pages/UsersPanel';
import ActivityPanel from '@/pages/ActivityPanel';
import PushPanel from '@/pages/PushPanel';
import ApiPanel from '@/pages/ApiPanel';
import ModeratorPanel from '@/pages/ModeratorPanel';
import ModerationPanel from '@/pages/ModerationPanel';
import UsersMapPanel from '@/pages/UsersMapPanel';
import SuperAdminDashboard from '@/pages/SuperAdminDashboard';
import NodeAdminDashboard from '@/pages/NodeAdminDashboard';
import SIPPanel from '@/pages/SIPPanel';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-black">
        <Loader2 className="w-12 h-12 text-cyber-cyan animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-black">
        <Loader2 className="w-12 h-12 text-cyber-cyan animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          classNames: {
            toast: 'glass-card border-cyber-cyan/20',
            title: 'text-white',
            description: 'text-gray-400',
            success: 'border-cyber-green/30',
            error: 'border-cyber-red/30',
            warning: 'border-cyber-orange/30',
            info: 'border-cyber-cyan/30',
          },
        }}
      />
      
      <Routes>
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Admin Panel - отдельный публичный маршрут */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/verification" element={<VerificationPanel />} />
        <Route path="/admin/premium" element={<PremiumPanel />} />
        <Route path="/admin/users" element={<UsersPanel />} />
        <Route path="/admin/activity" element={<ActivityPanel />} />
        <Route path="/admin/push" element={<PushPanel />} />
        <Route path="/admin/api" element={<ApiPanel />} />
        <Route path="/admin/moderator" element={<ModeratorPanel />} />
        <Route path="/admin/moderation" element={<ModerationPanel />} />
        <Route path="/admin/map" element={<UsersMapPanel />} />
        
        {/* Super Admin Dashboard - главная панель zametkikostik */}
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
        
        {/* Node Admin Dashboard - панель администратора ноды (без карты) */}
        <Route path="/node-admin" element={<NodeAdminDashboard />} />
        <Route path="/node/*" element={<NodeAdminDashboard />} />
        
        {/* SIP VoIP Panel - настройки SIP для приёма звонков и SMS */}
        <Route path="/admin/sip" element={<SIPPanel />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="messenger" element={<MessengerPage />} />
          <Route path="video" element={<VideoPage />} />
          <Route path="ai" element={<AIHub />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="email" element={<EmailPage />} />
          <Route path="proxy" element={<VLESSPage />} />
          <Route path="vless" element={<VLESSPage />} />
          <Route path="social" element={<SocialPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
