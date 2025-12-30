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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Type *
          </label>
          <select
            name="purchaseType"
            value={formData.purchaseType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="roughPurchase">Rough Purchase</option>
            <option value="rejectionPurchase">Rejection Purchase</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Party *
          </label>
          <select
            name="selectParty"
            value={formData.selectParty}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jangan No *
          </label>
          <input
            type="text"
            name="janganNo"
            value={formData.janganNo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stone *
          </label>
          <select
            name="stone"
            value={formData.stone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate *
          </label>
          <input
            type="number"
            step="0.01"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration *
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pieces *
          </label>
          <input
            type="number"
            name="pieces"
            value={formData.pieces}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Number of packets to create"
            required
            min="1"
          />
          <p className="mt-1 text-xs text-gray-500">
            Number of pieces for this purchase
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Weight *
          </label>
          <input
            type="number"
            step="0.01"
            name="totalWeight"
            value={formData.totalWeight}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
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
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : purchase?._id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
});

PurchaseForm.displayName = 'PurchaseForm';

export default PurchaseForm;

