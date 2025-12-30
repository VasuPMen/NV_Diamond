import React, { useState, useEffect, useCallback, memo } from 'react';
import { purchaseAPI, packetAPI } from '../../services/api';
import PacketList from './PacketList';

const Packet = memo(() => {
  const [purchases, setPurchases] = useState([]);
  const [packets, setPackets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await purchaseAPI.getAll();
      setPurchases(response.data || []);
    } catch (err) {
      setError('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPackets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await packetAPI.getAll();
      setPackets(response.data || []);
    } catch (err) {
      setError('Failed to load packets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
    fetchPackets();
  }, [fetchPurchases, fetchPackets]);

  const handleAddPackets = useCallback(async (purchaseId) => {
    try {
      setLoading(true);
      setError('');
      await purchaseAPI.addPackets(purchaseId);
      await fetchPackets();
      await fetchPurchases();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add packets');
    } finally {
      setLoading(false);
    }
  }, [fetchPackets, fetchPurchases]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Packets</h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <PacketList
          purchases={purchases}
          packets={packets}
          onAddPackets={handleAddPackets}
        />
      )}
    </div>
  );
});

Packet.displayName = 'Packet';

export default Packet;

