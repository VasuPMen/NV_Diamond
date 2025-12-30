import React, { useState, useEffect, memo, useCallback } from 'react';

const PartyForm = memo(({ party, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    shortName: '',
    emailId: '',
    mobileNo: '',
    gstNumber: '',
    panCard: '',
    stoneType: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (party) {
      setFormData({
        firstName: party.firstName || '',
        lastName: party.lastName || '',
        shortName: party.shortName || '',
        emailId: party.emailId || '',
        mobileNo: party.mobileNo || '',
        gstNumber: party.gstNumber || '',
        panCard: party.panCard || '',
        stoneType: party.stoneType || '',
      });
    }
  }, [party]);

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
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save party');
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
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Name
          </label>
          <input
            type="text"
            name="shortName"
            value={formData.shortName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Unique short name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile No *
          </label>
          <input
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email ID
          </label>
          <input
            type="email"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stone Type
          </label>
          <select
            name="stoneType"
            value={formData.stoneType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Stone Type</option>
            <option value="Nature">Nature</option>
            <option value="HPHT">HPHT</option>
            <option value="CVD">CVD</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GST Number
          </label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="GST Number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Card
          </label>
          <input
            type="text"
            name="panCard"
            value={formData.panCard}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="PAN Card Number"
          />
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {party?._id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
});

PartyForm.displayName = 'PartyForm';

export default PartyForm;


