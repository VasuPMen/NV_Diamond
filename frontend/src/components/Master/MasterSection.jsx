import React, { useState, useCallback, memo } from 'react';
import { masterAPI } from '../../services/api';
import MasterForm from './MasterForm';
import MasterList from './MasterList';

const MasterSection = memo(({ entityName, apiMethods, fields, title }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = useCallback(() => {
    setEditingItem(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await apiMethods.delete(id);
      setRefreshKey(prev => prev + 1); // Trigger table refresh
    } catch (err) {
      // Error will be handled by PaginatedTable
    }
  }, [apiMethods]);

  const handleSubmit = useCallback(async (data) => {
    try {
      if (editingItem?._id) {
        await apiMethods.update(editingItem._id, data);
      } else {
        await apiMethods.create(data);
      }
      setShowForm(false);
      setEditingItem(null);
      setRefreshKey(prev => prev + 1); // Trigger table refresh
    } catch (err) {
      throw err;
    }
  }, [editingItem, apiMethods]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingItem(null);
  }, []);

  if (showForm) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingItem ? `Edit ${title}` : `Create ${title}`}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {editingItem ? 'Update the details below' : 'Fill in the information to create a new entry'}
          </p>
        </div>
        <MasterForm
          entity={entityName}
          data={editingItem}
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your {title.toLowerCase()} data</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create {title}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <MasterList
        key={refreshKey}
        apiMethods={apiMethods}
        fields={fields}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
});

MasterSection.displayName = 'MasterSection';

export default MasterSection;

