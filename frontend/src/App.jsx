import React, { useState, useCallback, useEffect, memo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Purchase from './components/Purchase/Purchase';
import Master from './components/Master/Master';

const AppLayout = memo(() => {
  const [activeMasterSection, setActiveMasterSection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.startsWith('/master') ? 'master' : 'purchase';

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />
      <main className="flex-1 ml-64 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/purchase" replace />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route
            path="/master"
            element={
              <Master
                activeSection={activeMasterSection}
                onSectionChange={handleMasterSectionChange}
              />
            }
          />
          <Route
            path="/master/:sectionKey"
            element={
              <Master
                activeSection={activeMasterSection}
                onSectionChange={handleMasterSectionChange}
              />
            }
          />
          <Route path="*" element={<Navigate to="/purchase" replace />} />
        </Routes>
      </main>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

export default AppLayout;

