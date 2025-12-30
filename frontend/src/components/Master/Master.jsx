import React, { useMemo, memo, useState, useCallback, useEffect } from 'react';
import { masterAPI } from '../../services/api';
import MasterSection from './MasterSection';
import ManagerSection from './ManagerSection';
import PartySection from './PartySection';
import DepartmentSection from './DepartmentSection';

const Master = memo(({ activeSection, onSectionChange }) => {
  const [selectedSection, setSelectedSection] = useState(activeSection || null);

  // Sync with prop changes
  useEffect(() => {
    setSelectedSection(activeSection || null);
  }, [activeSection]);

  const masterConfigs = useMemo(() => [
    {
      key: 'color',
      title: 'Color',
      icon: '🎨',
      color: 'from-pink-500 to-rose-500',
      apiMethods: masterAPI.color,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'stone',
      title: 'Stone',
      icon: '💠',
      color: 'from-purple-500 to-indigo-500',
      apiMethods: masterAPI.stone,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'shape',
      title: 'Shape',
      icon: '💎',
      color: 'from-blue-500 to-cyan-500',
      apiMethods: masterAPI.shape,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
        { name: 'advisoryShape', label: 'Advisory Shape', type: 'text', required: true },
        {
          name: 'shortGroup',
          label: 'Short Group',
          type: 'select',
          required: false,
          options: [
            { value: 'Round', label: 'Round' },
            { value: 'Fancy', label: 'Fancy' },
          ],
        },
      ],
    },
    {
      key: 'cut',
      title: 'Cut',
      icon: '✂️',
      color: 'from-green-500 to-emerald-500',
      apiMethods: masterAPI.cut,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'purity',
      title: 'Purity',
      icon: '✨',
      color: 'from-yellow-500 to-orange-500',
      apiMethods: masterAPI.purity,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'polish',
      title: 'Polish',
      icon: '🔮',
      color: 'from-indigo-500 to-purple-500',
      apiMethods: masterAPI.polish,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'symmetry',
      title: 'Symmetry',
      icon: '⚖️',
      color: 'from-teal-500 to-cyan-500',
      apiMethods: masterAPI.symmetry,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'fluorescence',
      title: 'Fluorescence',
      icon: '💡',
      color: 'from-amber-500 to-yellow-500',
      apiMethods: masterAPI.fluorescence,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'table',
      title: 'Table',
      icon: '📊',
      color: 'from-slate-500 to-gray-500',
      apiMethods: masterAPI.table,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'tension',
      title: 'Tension',
      icon: '🔗',
      color: 'from-red-500 to-pink-500',
      apiMethods: masterAPI.tension,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'height',
      title: 'Height',
      icon: '📏',
      color: 'from-violet-500 to-purple-500',
      apiMethods: masterAPI.height,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'length',
      title: 'Length',
      icon: '📐',
      color: 'from-blue-600 to-indigo-600',
      apiMethods: masterAPI.length,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'width',
      title: 'Width',
      icon: '📏',
      color: 'from-cyan-500 to-blue-500',
      apiMethods: masterAPI.width,
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'order', label: 'Order', type: 'number', required: true },
      ],
    },
    {
      key: 'manager',
      title: 'Manager',
      icon: '👔',
      color: 'from-gray-600 to-slate-600',
      apiMethods: masterAPI.manager,
      fields: [],
    },
    {
      key: 'party',
      title: 'Party',
      icon: '👥',
      color: 'from-orange-500 to-red-500',
      apiMethods: masterAPI.party,
      fields: [],
    },
    {
      key: 'department',
      title: 'Department',
      icon: '🏢',
      color: 'from-emerald-500 to-teal-500',
      apiMethods: masterAPI.department,
      fields: [],
    },
  ], []);

  const activeConfig = useMemo(
    () => masterConfigs.find((config) => config.key === selectedSection),
    [selectedSection, masterConfigs]
  );

  const handleCardClick = useCallback((sectionKey) => {
    setSelectedSection(sectionKey);
    if (onSectionChange) {
      onSectionChange(sectionKey);
    }
  }, [onSectionChange]);

  const handleBack = useCallback(() => {
    setSelectedSection(null);
    if (onSectionChange) {
      onSectionChange(null);
    }
  }, [onSectionChange]);

  // Show dashboard when no section is selected
  if (!selectedSection) {
    return (
      <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Master Configuration</h1>
            <p className="text-lg text-gray-600">Manage all master data settings and configurations</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {masterConfigs.map((config) => (
              <button
                key={config.key}
                onClick={() => handleCardClick(config.key)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-transparent transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-3xl">{config.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {config.title}
                  </h3>
                  <div className="mt-2 w-12 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent group-hover:via-blue-500 transition-all"></div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 rounded-2xl transition-all duration-300"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show selected section with back button
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Master</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activeConfig.icon}</span>
            <h2 className="text-2xl font-bold text-gray-800">{activeConfig.title}</h2>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-8">
        {activeConfig.key === 'manager' ? (
          <ManagerSection />
        ) : activeConfig.key === 'party' ? (
          <PartySection />
        ) : activeConfig.key === 'department' ? (
          <DepartmentSection />
        ) : (
          <MasterSection
            entityName={activeConfig.key}
            apiMethods={activeConfig.apiMethods}
            fields={activeConfig.fields}
            title={activeConfig.title}
          />
        )}
      </div>
    </div>
  );
});

Master.displayName = 'Master';

export default Master;

