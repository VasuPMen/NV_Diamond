import React, { useState, useEffect, memo, useCallback } from 'react';
import { masterAPI } from '../../services/api';

const DepartmentForm = memo(({ department, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    managerName: '',
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        shortName: department.shortName || '',
        managerName: department.managerName?._id || department.managerName || '',
      });
    }
  }, [department]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await masterAPI.manager.getAll();
        setManagers(response.data || []);
      } catch (err) {
        console.error('Failed to load managers:', err);
      }
    };
    fetchManagers();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save department');
    } finally {
      setLoading(false);
    }
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Name *
          </label>
          <input
            type="text"
            name="shortName"
            value={formData.shortName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manager Name *
          </label>
          <select
            name="managerName"
            value={formData.managerName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.firstName} {manager.lastName} {manager.shortName ? `(${manager.shortName})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : department?._id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
});

DepartmentForm.displayName = 'DepartmentForm';

export default DepartmentForm;


