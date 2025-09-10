import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SiteProvider } from './contexts/SiteContext';
import { useSite } from './hooks/useSite';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent: React.FC = () => {
  const { isLoading, siteIdentity } = useSite();

  if (isLoading || !siteIdentity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Cargando...</h1>
            <p className="text-gray-600">Por favor, espera un momento.</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
};

export default App;