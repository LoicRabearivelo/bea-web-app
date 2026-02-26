import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Layout from './components/layout/Layout';
import BeaChatbot from './components/BeaChatbot';
import WelcomeForm from './components/WelcomeForm';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ProDashboard from './pages/ProDashboard';
import Annuaire from './pages/Annuaire';
import Suivi from './pages/Suivi';
import Messagerie from './pages/Messagerie';
import Communaute from './pages/Communaute';
import Articles from './pages/Articles';
import FicheEnfant from './pages/FicheEnfant';
import Profil from './pages/Profil';

function ProtectedRoute({ children, allowedType }: { children: React.ReactNode; allowedType?: string }) {
  const { utilisateur } = useAuth();
  if (!utilisateur) return <Navigate to="/connexion" replace />;
  if (allowedType && utilisateur.type !== allowedType) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { utilisateur } = useAuth();
  if (utilisateur) {
    return <Navigate to={utilisateur.type === 'professionnel' ? '/pro/tableau-de-bord' : '/tableau-de-bord'} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/connexion" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/inscription" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Patient routes */}
        <Route path="/onboarding" element={<ProtectedRoute allowedType="patient"><Onboarding /></ProtectedRoute>} />
        <Route path="/tableau-de-bord" element={<ProtectedRoute allowedType="patient"><Dashboard /></ProtectedRoute>} />
        <Route path="/suivi" element={<ProtectedRoute allowedType="patient"><Suivi /></ProtectedRoute>} />
        <Route path="/fiche-enfant" element={<ProtectedRoute allowedType="patient"><FicheEnfant /></ProtectedRoute>} />

        {/* Pro routes */}
        <Route path="/pro/tableau-de-bord" element={<ProtectedRoute allowedType="professionnel"><ProDashboard /></ProtectedRoute>} />

        {/* Shared authenticated routes */}
        <Route path="/annuaire" element={<ProtectedRoute><Annuaire /></ProtectedRoute>} />
        <Route path="/messagerie" element={<ProtectedRoute><Messagerie /></ProtectedRoute>} />
        <Route path="/communaute" element={<ProtectedRoute><Communaute /></ProtectedRoute>} />
        <Route path="/articles" element={<ProtectedRoute><Articles /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BeaChatbot />
      <WelcomeForm />
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <AppRoutes />
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
