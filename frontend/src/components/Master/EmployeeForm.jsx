import React, { useState, useEffect, memo, useCallback } from 'react';
import { masterAPI } from '../../services/api';
import MultiSelect from '../common/MultiSelect';

const EmployeeForm = memo(({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    shortName: '',
    emailId: '',
    mobileNo: '',
    gender: '',
    manager: '',
    process: [], // Array of process IDs
    workingType: 'FixedSalary', // Default to FixedSalary
    perJemDetails: {
      processes: [], // Redundant but required by schema? Or maybe calculated on submit
      perProcess: {}, // Map of processId -> rate
    },
    fixedSalary: {
      salary: '',
    },
    bankName: '',
    ifscCode: '',
    accountNo: '',
    address: {
      permanentAddress: '',
      pinCode: '',
      city: '',
      state: '',
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

  const [managers, setManagers] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch Managers and Processes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [managersRes, processesRes] = await Promise.all([
          masterAPI.manager.getAll(1, 100), // Fetch enough managers
          masterAPI.process.getAll(),
        ]);
        setManagers(managersRes.data || []);
        setProcesses(processesRes.data || []);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
        setError('Failed to load managers or processes');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        shortName: employee.shortName || '',
        emailId: employee.emailId || '',
        mobileNo: employee.mobileNo || '',
        gender: employee.gender || '',
        manager: employee.manager?._id || employee.manager || '',
        process: employee.process?.map(p => p._id || p) || [],
        workingType: employee.workingType || 'FixedSalary',
        perJemDetails: {
            processes: employee.perJemDetails?.processes || [],
            perProcess: employee.perJemDetails?.perProcess || {},
        },
        fixedSalary: {
          salary: employee.fixedSalary?.salary || '',
        },
        bankName: employee.bankName || '',
        ifscCode: employee.ifscCode || '',
        accountNo: employee.accountNo || '',
        address: {
          permanentAddress: employee.address?.permanentAddress || '',
          pinCode: employee.address?.pinCode || '',
          city: employee.address?.city || '',
          state: employee.address?.state || '',
        },
        diamondExperience: {
          diamondKnowledge: employee.diamondExperience?.diamondKnowledge || false,
          laserKnowledge: employee.diamondExperience?.laserKnowledge || false,
          sarinKnowledge: employee.diamondExperience?.sarinKnowledge || false,
          computerKnowledge: employee.diamondExperience?.computerKnowledge || false,
        },
        referenceDetails: {
          name: employee.referenceDetails?.name || '',
          mobileNo: employee.referenceDetails?.mobileNo || '',
          lastCompany: employee.referenceDetails?.lastCompany || '',
        },
      });
    }
  }, [employee]);

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

  const handleProcessChange = useCallback((newProcesses) => {
      setFormData(prev => ({ ...prev, process: newProcesses }));
  }, []);

  const handlePerJemRateChange = useCallback((processId, rate) => {
    setFormData(prev => ({
        ...prev,
        perJemDetails: {
            ...prev.perJemDetails,
            perProcess: {
                ...prev.perJemDetails.perProcess,
                [processId]: rate
            }
        }
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare submit data
      const submitData = {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        shortName: formData.shortName || undefined,
        emailId: formData.emailId || undefined,
        mobileNo: formData.mobileNo || undefined,
        gender: formData.gender || undefined,
        manager: formData.manager || undefined,
        process: formData.process, // Main process list
        workingType: formData.workingType,
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
        diamondExperience: formData.diamondExperience,
        referenceDetails: formData.referenceDetails.name || formData.referenceDetails.mobileNo || formData.referenceDetails.lastCompany
          ? {
              name: formData.referenceDetails.name || undefined,
              mobileNo: formData.referenceDetails.mobileNo || undefined,
              lastCompany: formData.referenceDetails.lastCompany || undefined,
            }
          : undefined,
      };

      if (formData.workingType === 'FixedSalary') {
          submitData.fixedSalary = { salary: parseFloat(formData.fixedSalary.salary) };
      } else if (formData.workingType === 'perJem') {
          // Filter perJem processes to only those selected in main process list or handled separately?
          // Schema requires perJemDetails.processes and perJemDetails.perProcess
          // Assuming we use the same selected processes for perJemDetails
          const selectedProcesses = formData.process; // or filtered based on UI
          const perProcessRates = {};
          selectedProcesses.forEach(pid => {
              if (formData.perJemDetails.perProcess[pid]) {
                  perProcessRates[pid] = parseFloat(formData.perJemDetails.perProcess[pid]);
              }
          });

          submitData.perJemDetails = {
              processes: selectedProcesses,
              perProcess: perProcessRates
          };
      }

      await onSubmit(submitData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  }, [formData, onSubmit]);

  const processOptions = processes.map(p => ({
      value: p._id,
      label: p.name
  }));

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
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Name</label>
            <input
              type="text"
              name="shortName"
              value={formData.shortName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No *</label>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email ID *</label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* Manager Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Manager *</label>
            <select
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Manager</option>
              {managers.map(mgr => (
                  <option key={mgr._id} value={mgr._id}>
                      {mgr.firstName} {mgr.lastName}
                  </option>
              ))}
            </select>
          </div>
        </div>
      </div>

       {/* Work & Process Details */}
       <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Work & Process Details</h4>
        
        {/* Working Type */}
        <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Working Type *</label>
            <div className="flex space-x-4">
                {[
                    { value: 'FixedSalary', label: 'Fixed Salary', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
                    { value: 'perJem', label: 'Per Jem', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                ].map((type) => (
                    <label 
                        key={type.value}
                        className={`
                            relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                            ${formData.workingType === type.value 
                                ? 'border-blue-500 bg-blue-50/50 text-blue-700 ring-2 ring-blue-500/20' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                        `}
                    >
                        <input
                            type="radio"
                            name="workingType"
                            value={type.value}
                            checked={formData.workingType === type.value}
                            onChange={handleChange}
                            className="sr-only" // Hide default radio
                        />
                        <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                            ${formData.workingType === type.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                        `}>
                            <div className="w-2 h-2 rounded-full bg-white transform scale-0 transition-transform duration-200 data-[checked=true]:scale-100" data-checked={formData.workingType === type.value}></div>
                        </div>
                        <span className="font-medium">{type.label}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Process Selection */}
        <div className="mb-6">
             <MultiSelect
                label="Process"
                placeholder="Select Processes"
                options={processOptions}
                value={formData.process}
                onChange={handleProcessChange}
             />
        </div>

        {/* Conditional Fields based on Working Type */}
        {formData.workingType === 'FixedSalary' && (
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Salary *</label>
                <input
                    type="number"
                    step="0.01"
                    name="fixedSalary.salary"
                    value={formData.fixedSalary.salary}
                    onChange={handleChange}
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
             </div>
        )}

        {formData.workingType === 'perJem' && (
            <div className="space-y-4 animate-fadeIn">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h5 className="text-base font-semibold text-gray-800">Process Rates</h5>
                 </div>
                 
                 {formData.process.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-400 text-sm">Select processes above to set their rates.</p>
                    </div>
                 ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                         {formData.process.map(processId => {
                             const proc = processes.find(p => p._id === processId);
                             return (
                                 <div key={processId} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 group">
                                     <div className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                                            {proc?.name || 'Unknown Process'}
                                        </span>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-400 sm:text-sm">₹</span>
                                            </div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={formData.perJemDetails.perProcess[processId] || ''}
                                                onChange={(e) => handlePerJemRateChange(processId, e.target.value)}
                                                className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder:text-gray-300"
                                                required
                                            />
                                        </div>
                                     </div>
                                 </div>
                             );
                         })}
                     </div>
                 )}
            </div>
        )}
      </div>

      {/* Address */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Permanent Address</label>
            <textarea
              name="address.permanentAddress"
              value={formData.address.permanentAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
            <input
              type="text"
              name="address.pinCode"
              value={formData.address.pinCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-4">Bank Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account No</label>
            <input
              type="text"
              name="accountNo"
              value={formData.accountNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Reference Name</label>
            <input
              type="text"
              name="referenceDetails.name"
              value={formData.referenceDetails.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reference Mobile No</label>
            <input
              type="text"
              name="referenceDetails.mobileNo"
              value={formData.referenceDetails.mobileNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Company</label>
            <input
              type="text"
              name="referenceDetails.lastCompany"
              value={formData.referenceDetails.lastCompany}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
          {loading ? 'Saving...' : employee?._id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
});

EmployeeForm.displayName = 'EmployeeForm';

export default EmployeeForm;
