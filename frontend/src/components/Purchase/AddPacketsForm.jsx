import React, { useState, useCallback, memo } from 'react';
import { purchaseAPI } from '../../services/api';

const AddPacketsForm = memo(({ purchase, onSave, onCancel }) => {
  const pieces = purchase.Pieces || purchase.pieces || 0;
  const [numberOfPackets, setNumberOfPackets] = useState(pieces || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!numberOfPackets || numberOfPackets <= 0) {
      setError('Number of packets must be greater than 0');
      return;
    }

    if (numberOfPackets < pieces) {
      setError(`Number of packets (${numberOfPackets}) should be greater than or equal to pieces (${pieces})`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await purchaseAPI.addPackets(purchase._id, numberOfPackets);
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create packets');
    } finally {
      setLoading(false);
    }
  }, [numberOfPackets, pieces, purchase._id, onSave]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add Packets to Purchase</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Selected Purchase Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-blue-900 mb-2">Selected Purchase:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Jangan No:</span>
            <span className="ml-2 font-medium">{purchase.janganNo}</span>
          </div>
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="ml-2 font-medium">{purchase.purchaseType}</span>
          </div>
          <div>
            <span className="text-gray-600">Stone:</span>
            <span className="ml-2 font-medium">{purchase.stone?.name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-600">Pieces:</span>
            <span className="ml-2 font-medium">{pieces}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Packets to Create *
          </label>
          <input
            type="number"
            min={pieces || 1}
            value={numberOfPackets}
            onChange={(e) => setNumberOfPackets(parseInt(e.target.value) || pieces)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
            disabled={loading}
          />
          <p className="mt-2 text-sm text-gray-500">
            Minimum: {pieces} packets (based on pieces). You can create more packets if needed.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Packets...' : 'Create Packets'}
          </button>
        </div>
      </form>
    </div>
  );
});

AddPacketsForm.displayName = 'AddPacketsForm';

export default AddPacketsForm;

