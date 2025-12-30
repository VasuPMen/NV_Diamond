import React, { useState, useEffect, memo, useCallback } from 'react';

const MasterForm = memo(({ entity, data, fields, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const initialData = {};
    fields.forEach((field) => {
      initialData[field.name] = data?.[field.name] || (field.type === 'number' ? '' : '');
    });
    setFormData(initialData);
  }, [data, fields]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    try {
      const submitData = { ...formData };
      fields.forEach((field) => {
        if (field.type === 'number' && submitData[field.name] !== '') {
          submitData[field.name] = parseFloat(submitData[field.name]);
        }
      });
      await onSubmit(submitData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  }, [formData, fields, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
                required={field.required}
                step={field.type === 'number' ? '0.01' : undefined}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
        >
          {data?._id ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Update
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </>
          )}
        </button>
      </div>
    </form>
  );
});

MasterForm.displayName = 'MasterForm';

export default MasterForm;

