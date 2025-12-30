import React, { useState, useEffect, memo, useCallback } from 'react';
import { masterAPI } from '../../services/api';

const ManagerForm = memo(({ manager, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    shortName: '',
    emailId: '',
    mobileNo: '',
    gender: '',
    bankName: '',
    ifscCode: '',
    accountNo: '',
    address: {
      permanentAddress: '',
      pinCode: '',
      city: '',
      state: '',
    },
    fixedSalary: {
      salary: '',
    },
    diamondExperience: {
      diamondKnowledge: false,
      laserKnowledge: false,
      sarinKnowledge: false,
      computerKnowledge: false,
    },
    referenceDetails: {
      name: '',
      mobileNo: '',
      lastCompany: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (manager) {
      setFormData({
        firstName: manager.firstName || '',
        lastName: manager.lastName || '',
        shortName: manager.shortName || '',
        emailId: manager.emailId || '',
        mobileNo: manager.mobileNo || '',
        gender: manager.gender || '',
        bankName: manager.bankName || '',
        ifscCode: manager.ifscCode || '',
        accountNo: manager.accountNo || '',
        address: {
          permanentAddress: manager.address?.permanentAddress || '',
          pinCode: manager.address?.pinCode || '',
          city: manager.address?.city || '',
          state: manager.address?.state || '',
        },
        fixedSalary: {
          salary: manager.fixedSalary?.salary || '',
        },
        diamondExperience: {
          diamondKnowledge: manager.diamondExperience?.diamondKnowledge || false,
          laserKnowledge: manager.diamondExperience?.laserKnowledge || false,
          sarinKnowledge: manager.diamondExperience?.sarinKnowledge || false,
          computerKnowledge: manager.diamondExperience?.computerKnowledge || false,
        },
        referenceDetails: {
          name: manager.referenceDetails?.name || '',
          mobileNo: manager.referenceDetails?.mobileNo || '',
          lastCompany: manager.referenceDetails?.lastCompany || '',
        },
      });
    }
  }, [manager]);


  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else if (name.startsWith('diamondExperience.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        diamondExperience: { ...prev.diamondExperience, [field]: checked },
      }));
    } else if (name.startsWith('referenceDetails.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        referenceDetails: { ...prev.referenceDetails, [field]: value },
      }));
    } else if (name === 'fixedSalary.salary') {
      setFormData((prev) => ({
        ...prev,
        fixedSalary: { ...prev.fixedSalary, salary: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare submit data - convert empty strings to undefined for optional fields
      const submitData = {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        shortName: formData.shortName || undefined,
        emailId: formData.emailId || undefined,
        mobileNo: formData.mobileNo || undefined,
        gender: formData.gender || undefined,
        bankName: formData.bankName || undefined,
        ifscCode: formData.ifscCode || undefined,
        accountNo: formData.accountNo || undefined,
        address: formData.address.permanentAddress || formData.address.city || formData.address.state || formData.address.pinCode
          ? {
              permanentAddress: formData.address.permanentAddress || undefined,
              pinCode: formData.address.pinCode || undefined,
              city: formData.address.city || undefined,
              state: formData.address.state || undefined,
            }
          : undefined,
        fixedSalary: formData.fixedSalary.salary 
          ? { salary: parseFloat(formData.fixedSalary.salary) } 
          : undefined,
        diamondExperience: formData.diamondExperience,
        referenceDetails: formData.referenceDetails.name || formData.referenceDetails.mobileNo || formData.referenceDetails.lastCompany
          ? {
              name: formData.referenceDetails.name || undefined,
              mobileNo: formData.referenceDetails.mobileNo || undefined,
              lastCompany: formData.referenceDetails.lastCompany || undefined,
            }
          : undefined,
      };
      await onSubmit(submitData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save manager');
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

      {/* Basic Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
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
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permanent Address
            </label>
            <textarea
              name="address.permanentAddress"
              value={formData.address.permanentAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pin Code
            </label>
            <input
              type="text"
              name="address.pinCode"
              value={formData.address.pinCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Bank Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IFSC Code
            </label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account No
            </label>
            <input
              type="text"
              name="accountNo"
              value={formData.accountNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Work Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Work Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fixed Salary
            </label>
            <input
              type="number"
              step="0.01"
              name="fixedSalary.salary"
              value={formData.fixedSalary.salary}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter fixed salary"
            />
          </div>
        </div>
      </div>

      {/* Diamond Experience */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Diamond Experience</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'diamondKnowledge', label: 'Diamond Knowledge' },
            { key: 'laserKnowledge', label: 'Laser Knowledge' },
            { key: 'sarinKnowledge', label: 'Sarin Knowledge' },
            { key: 'computerKnowledge', label: 'Computer Knowledge' },
          ].map((item) => (
            <label key={item.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={`diamondExperience.${item.key}`}
                checked={formData.diamondExperience[item.key]}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reference Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Reference Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Name
            </label>
            <input
              type="text"
              name="referenceDetails.name"
              value={formData.referenceDetails.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Mobile No
            </label>
            <input
              type="text"
              name="referenceDetails.mobileNo"
              value={formData.referenceDetails.mobileNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Company
            </label>
            <input
              type="text"
              name="referenceDetails.lastCompany"
              value={formData.referenceDetails.lastCompany}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
          {loading ? 'Saving...' : manager?._id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
});

ManagerForm.displayName = 'ManagerForm';

export default ManagerForm;


