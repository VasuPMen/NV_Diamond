import React, { memo, useMemo } from 'react';

const Sidebar = memo(({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'purchase', label: 'Purchase' },
    { id: 'master', label: 'Master' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-700 bg-gray-900">
        <h1 className="text-xl font-bold">NV Diamond</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;

