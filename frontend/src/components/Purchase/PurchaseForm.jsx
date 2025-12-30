import React, { useState, useEffect, memo, useCallback } from 'react';
import { purchaseAPI, masterAPI } from '../../services/api';

const PurchaseForm = memo(({ purchase, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    purchaseType: 'roughPurchase',
    selectParty: '',
    janganNo: '',
    stone: '',
    rate: '',
    duration: '',
    pieces: '',
    totalWeight: '',
  });

  const [parties, setParties] = useState([]);
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (purchase) {
      setFormData({
        purchaseType: purchase.purchaseType || 'roughPurchase',
        selectParty: purchase.selectParty?._id || purchase.selectParty || '',
        janganNo: purchase.janganNo || '',
        stone: purchase.stone?._id || purchase.stone || '',
        rate: purchase.rate || '',
        duration: purchase.duration || '',
        pieces: purchase.Pieces || purchase.pieces || '',
        totalWeight: purchase.totalWeight || '',
      });
    }
  }, [purchase]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stonesRes, partiesRes] = await Promise.all([
          masterAPI.stone.getAll(),
          masterAPI.party.getAll(),
        ]);
        setStones(stonesRes.data || []);
        setParties(partiesRes.data || []);
      } catch (err) {
        setError('Failed to load master data');
      }
    };
    fetchData();
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
      const data = {
        purchaseType: formData.purchaseType,
        selectParty: formData.selectParty,
        janganNo: formData.janganNo,
        stone: formData.stone,
        rate: parseFloat(formData.rate),
        duration: parseInt(formData.duration),
        pieces: parseInt(formData.pieces) || 0,
        totalWeight: parseFloat(formData.totalWeight),
      };

      if (purchase?._id) {
        await purchaseAPI.update(purchase._id, data);
      } else {
        await purchaseAPI.create(data);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save purchase');
    } finally {
      setLoading(false);
    }
  }, [formData, purchase, onSave]);

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
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Purchase Type <span className="text-red-500">*</span>
          </label>
          <select
            name="purchaseType"
            value={formData.purchaseType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
            required
          >
            <option value="roughPurchase">Rough Purchase</option>
            <option value="rejectionPurchase">Rejection Purchase</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Select Party <span className="text-red-500">*</span>
          </label>
          <select
            name="selectParty"
            value={formData.selectParty}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
            required
          >
            <option value="">Select Party</option>
            {parties.map((party) => (
              <option key={party._id} value={party._id}>
                {party.firstName} {party.lastName} {party.shortName ? `(${party.shortName})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Jangan No <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="janganNo"
            value={formData.janganNo}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
            placeholder="Enter jangan number"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Stone <span className="text-red-500">*</span>
          </label>
          <select
            name="stone"
            value={formData.stone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
            required
          >
            <option value="">Select Stone</option>
            {stones.map((stone) => (
              <option key={stone._id} value={stone._id}>
                {stone.name} ({stone.code})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Rate <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
            placeholder="Enter rate"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Duration <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
            placeholder="Enter duration"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Pieces <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="pieces"
            value={formData.pieces}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
            placeholder="Enter number of pieces"
            required
            min="1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of pieces for this purchase
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Total Weight <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="totalWeight"
            value={formData.totalWeight}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
            placeholder="Enter total weight"
            required
          />
        </div>
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
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : purchase?._id ? (
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

PurchaseForm.displayName = 'PurchaseForm';

export default PurchaseForm;

