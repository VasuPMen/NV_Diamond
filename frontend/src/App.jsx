import React, { useState, useCallback, memo } from 'react';
import Sidebar from './components/Sidebar';
import Purchase from './components/Purchase/Purchase';
import Master from './components/Master/Master';

const App = memo(() => {
  const [activeTab, setActiveTab] = useState('purchase');
  const [activeMasterSection, setActiveMasterSection] = useState(null);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    // Reset master section when switching away from master
    if (tab !== 'master') {
      setActiveMasterSection(null);
    }
  }, []);

  const handleMasterSectionChange = useCallback((section) => {
    setActiveMasterSection(section);
  }, []);

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'purchase':
        return <Purchase />;
      case 'master':
        return <Master activeSection={activeMasterSection} onSectionChange={handleMasterSectionChange} />;
      default:
        return <Purchase />;
    }
  }, [activeTab, activeMasterSection, handleMasterSectionChange]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />
      <main className="flex-1 ml-64 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
});

App.displayName = 'App';

export default App;

