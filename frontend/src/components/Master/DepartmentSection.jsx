import React, { useState, useEffect, useCallback, memo } from 'react';
import { masterAPI } from '../../services/api';
import DepartmentForm from './DepartmentForm';
import DepartmentList from './DepartmentList';

const DepartmentSection = memo(() => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [error, setError] = useState('');

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await masterAPI.department.getAll();
      // Handle the response structure { success: true, data: [...] }
      const data = response.data?.data || response.data || [];
      setDepartments(data);
    } catch (err) {
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleCreate = useCallback(() => {
    setEditingDepartment(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((department) => {
    setEditingDepartment(department);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await masterAPI.department.delete(id);
      await fetchDepartments();
    } catch (err) {
      setError('Failed to delete department');
    }
  }, [fetchDepartments]);

  const handleSubmit = useCallback(async (data) => {
    try {
      if (editingDepartment?._id) {
        const response = await masterAPI.department.update(editingDepartment._id, data);
        // Handle response structure if needed
      } else {
        const response = await masterAPI.department.create(data);
        // Handle response structure if needed
      }
      setShowForm(false);
      setEditingDepartment(null);
      await fetchDepartments();
    } catch (err) {
      throw err;
    }
  }, [editingDepartment, fetchDepartments]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingDepartment(null);
  }, []);

  if (showForm) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6">
          {editingDepartment ? 'Edit Department' : 'Create Department'}
        </h3>
        <DepartmentForm
          department={editingDepartment}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Departments</h3>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Department
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
        <DepartmentList
          departments={departments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
});

DepartmentSection.displayName = 'DepartmentSection';

export default DepartmentSection;

