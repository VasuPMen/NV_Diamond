import React, { useState, useEffect, useCallback, memo } from 'react';
import { masterAPI } from '../../services/api';
import EmployeeForm from './EmployeeForm';
import EmployeeList from './EmployeeList';

const EmployeeSection = memo(() => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [error, setError] = useState('');

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await masterAPI.employee.getAll();
      setEmployees(response.data || []);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleCreate = useCallback(() => {
    setEditingEmployee(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await masterAPI.employee.delete(id);
      await fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee');
    }
  }, [fetchEmployees]);

  const handleSubmit = useCallback(async (data) => {
    try {
      if (editingEmployee?._id) {
        await masterAPI.employee.update(editingEmployee._id, data);
      } else {
        await masterAPI.employee.create(data);
      }
      setShowForm(false);
      setEditingEmployee(null);
      await fetchEmployees();
    } catch (err) {
      throw err;
    }
  }, [editingEmployee, fetchEmployees]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingEmployee(null);
  }, []);

  if (showForm) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6">
          {editingEmployee ? 'Edit Employee' : 'Create Employee'}
        </h3>
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Employees</h3>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Employee
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
        <EmployeeList
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
});

EmployeeSection.displayName = 'EmployeeSection';

export default EmployeeSection;
