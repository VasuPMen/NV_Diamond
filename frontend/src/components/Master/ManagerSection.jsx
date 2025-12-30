import React, { useState, useEffect, useCallback, memo } from 'react';
import { masterAPI } from '../../services/api';
import ManagerForm from './ManagerForm';
import ManagerList from './ManagerList';

const ManagerSection = memo(() => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [error, setError] = useState('');

  const fetchManagers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await masterAPI.manager.getAll();
      setManagers(response.data || []);
    } catch (err) {
      setError('Failed to load managers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleCreate = useCallback(() => {
    setEditingManager(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((manager) => {
    setEditingManager(manager);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await masterAPI.manager.delete(id);
      await fetchManagers();
    } catch (err) {
      setError('Failed to delete manager');
    }
  }, [fetchManagers]);

  const handleSubmit = useCallback(async (data) => {
    try {
      if (editingManager?._id) {
        await masterAPI.manager.update(editingManager._id, data);
      } else {
        await masterAPI.manager.create(data);
      }
      setShowForm(false);
      setEditingManager(null);
      await fetchManagers();
    } catch (err) {
      throw err;
    }
  }, [editingManager, fetchManagers]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingManager(null);
  }, []);

  if (showForm) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6">
          {editingManager ? 'Edit Manager' : 'Create Manager'}
        </h3>
        <ManagerForm
          manager={editingManager}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Managers</h3>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Manager
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <ManagerList
          managers={managers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
});

ManagerSection.displayName = 'ManagerSection';

export default ManagerSection;



