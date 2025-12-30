import React, { useState, useCallback, useEffect, memo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Purchase from './components/Purchase/Purchase';
import Master from './components/Master/Master';
import Login from './components/Login';
import ProcessPage from './components/Process/ProcessPage';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const AppLayout = memo(() => {
  const [activeMasterSection, setActiveMasterSection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // If on login page, don't show layout details or sidebar
  const isLoginPage = location.pathname === '/login';

  const activeTab = location.pathname.startsWith('/master') ? 'master' 
                  : location.pathname.startsWith('/process') ? 'process'
                  : 'purchase';

  useEffect(() => {
    if (location.pathname.startsWith('/master')) {
      const parts = location.pathname.split('/');
      setActiveMasterSection(parts[2] || null);
    } else {
      setActiveMasterSection(null);
    }
  }, [location.pathname]);

  const handleTabChange = useCallback((tab) => {
    if (tab === 'master') {
      navigate('/master');
    } else if (tab === 'process') {
      navigate('/process');
    } else {
      navigate('/purchase');
    }
  }, [navigate]);

  const handleMasterSectionChange = useCallback((section) => {
    setActiveMasterSection(section);
    if (section) {
      navigate(`/master/${section}`);
    } else {
      navigate('/master');
    }
  }, [navigate]);

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <main className="flex-1 ml-64 overflow-y-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/purchase" replace />} />
          <Route
            path="/purchase"
            element={
              <ProtectedRoute>
                <Purchase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/master"
            element={
              <ProtectedRoute>
                <Master
                  activeSection={activeMasterSection}
                  onSectionChange={handleMasterSectionChange}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/master/:sectionKey"
            element={
              <ProtectedRoute>
                <Master
                  activeSection={activeMasterSection}
                  onSectionChange={handleMasterSectionChange}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/process"
            element={
              <ProtectedRoute>
                <ProcessPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/purchase" replace />} />
        </Routes>
      </main>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

const App = () => (
  <AuthProvider>
    <AppLayout />
  </AuthProvider>
);

export default App;

