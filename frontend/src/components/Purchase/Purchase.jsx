import React, { useState, useEffect, useCallback, memo } from 'react';
import { purchaseAPI, packetAPI } from '../../services/api';
import PurchaseForm from './PurchaseForm';
import PurchaseList from './PurchaseList';
import PacketForm from './PacketForm';
import PurchaseDetail from './PurchaseDetail';

const Purchase = memo(() => {
  const [packets, setPackets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showPacketForm, setShowPacketForm] = useState(false);
  const [editingPacket, setEditingPacket] = useState(null);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchPurchasesData = useCallback(async (page, limit) => {
    return await purchaseAPI.getAll(page, limit);
  }, []);

  const fetchPackets = useCallback(async () => {
    try {
      const response = await packetAPI.getAll();
      setPackets(response.data || []);
    } catch (err) {
      console.error('Failed to load packets:', err);
    }
  }, []);

  useEffect(() => {
    fetchPackets();
  }, [fetchPackets]);

  const handleCreate = useCallback(() => {
    setEditingPurchase(null);
    setShowForm(true);
    setSelectedPurchase(null);
  }, []);

  const handleEdit = useCallback((purchase) => {
    setEditingPurchase(purchase);
    setShowForm(true);
    setSelectedPurchase(null);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase?')) {
      try {
        await purchaseAPI.delete(id);
        setRefreshKey(prev => prev + 1); // Refresh table
        if (selectedPurchase?._id === id) {
          setSelectedPurchase(null);
        }
      } catch (err) {
        setError('Failed to delete purchase');
      }
    }
  }, [selectedPurchase]);

  const handleSave = useCallback(async () => {
    setShowForm(false);
    setEditingPurchase(null);
    setRefreshKey(prev => prev + 1); // Refresh table
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingPurchase(null);
  }, []);

  const handlePurchaseClick = useCallback(async (purchase) => {
    setSelectedPurchase(purchase);
    setShowPacketForm(false);
    await fetchPackets();
  }, [fetchPackets]);

  const handleAddPackets = useCallback(() => {
    if (selectedPurchase) {
      setEditingPacket(null);
      setShowPacketForm(true);
    }
  }, [selectedPurchase]);

  const handlePacketSave = useCallback(async () => {
    setShowPacketForm(false);
    setEditingPacket(null);
    
      // Refresh packets first to get the newly created/updated packets with populated fields
      await fetchPackets();
      
      // Refresh the purchase table
      setRefreshKey(prev => prev + 1);
      
      // Update selected purchase if needed
      if (selectedPurchase) {
        try {
          const response = await purchaseAPI.getAll(1, 1);
          const purchases = response.data?.data || response.data || [];
          const updatedPurchase = purchases.find(p => p._id === selectedPurchase._id);
          if (updatedPurchase) {
            setSelectedPurchase(updatedPurchase);
          }
        } catch (err) {
          console.error('Error refreshing selected purchase:', err);
        }
      }
  }, [fetchPackets, selectedPurchase]);

  const handlePacketCancel = useCallback(() => {
    setShowPacketForm(false);
    setEditingPacket(null);
  }, []);

  const handleEditPacket = useCallback((packet) => {
    setEditingPacket(packet);
    setShowPacketForm(true);
  }, []);

  const handleDeletePacket = useCallback(async (packetId) => {
    if (window.confirm('Are you sure you want to delete this packet?')) {
      try {
        // Ensure packetId is a string
        const id = typeof packetId === 'object' && packetId !== null ? packetId._id : String(packetId);
        
        await packetAPI.delete(id);
        
        // Remove packet from purchase
        if (selectedPurchase) {
          // Handle both populated packets (objects) and packet IDs (strings)
          const updatedPackets = (selectedPurchase.packets || []).filter(p => {
            const packetIdStr = typeof p === 'object' && p !== null ? p._id : p;
            return String(packetIdStr) !== String(id);
          });
          const purchaseData = {
            ...selectedPurchase,
            packets: updatedPackets,
          };
          await purchaseAPI.update(selectedPurchase._id, purchaseData);
        }
        
        // Refresh packets first to get updated list
        await fetchPackets();
        
        // Then refresh purchases to get updated purchase with new packets array (populated)
        // Refresh the purchase table
        setRefreshKey(prev => prev + 1);
        
        // Update selected purchase if needed
        if (selectedPurchase) {
          try {
            const response = await purchaseAPI.getAll(1, 1);
            const purchases = response.data?.data || response.data || [];
            const updatedPurchase = purchases.find(p => p._id === selectedPurchase._id);
            if (updatedPurchase) {
              setSelectedPurchase(updatedPurchase);
            }
          } catch (err) {
            console.error('Error refreshing selected purchase:', err);
          }
        }
      } catch (err) {
        console.error('Delete packet error:', err);
        setError(err.response?.data?.message || 'Failed to delete packet. Make sure the backend server is running.');
      }
    }
  }, [selectedPurchase, fetchPackets]);

  // Get packets for selected purchase
  const getPacketsForPurchase = useCallback(() => {
    if (!selectedPurchase) return [];
    
    // Handle both populated packets (objects) and packet IDs
    const purchasePackets = selectedPurchase.packets || [];
    
    if (purchasePackets.length === 0) return [];
    
    // Check if packets are already populated (objects with _id and other properties)
    const firstPacket = purchasePackets[0];
    const isPopulated = typeof firstPacket === 'object' && firstPacket !== null && firstPacket._id && firstPacket.packetNo;
    
    // If packets are already populated (objects), return them directly
    if (isPopulated) {
      return purchasePackets;
    }
    
    // Otherwise, filter from the packets list using IDs
    if (!packets.length) return [];
    const purchasePacketIds = purchasePackets.map(p => typeof p === 'object' && p !== null ? p._id : p);
    return packets.filter(packet => purchasePacketIds.includes(packet._id));
  }, [selectedPurchase, packets]);

  if (showForm) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editingPurchase ? 'Edit Purchase' : 'Create Purchase'}
        </h2>
        <PurchaseForm
          purchase={editingPurchase}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  const purchasePackets = getPacketsForPurchase();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Purchase Management</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Purchase
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Selected Purchase Detail */}
      {selectedPurchase && (
        <PurchaseDetail
          purchase={selectedPurchase}
          packets={purchasePackets}
          onAddPackets={handleAddPackets}
          onEditPacket={handleEditPacket}
          onDeletePacket={handleDeletePacket}
        />
      )}

      {/* Packet Form */}
      {showPacketForm && selectedPurchase && (
        <PacketForm
          purchase={selectedPurchase}
          packet={editingPacket}
          existingPacketsCount={purchasePackets.length}
          onSave={handlePacketSave}
          onCancel={handlePacketCancel}
        />
      )}

      {/* Purchase List */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">All Purchases</h3>
        <PurchaseList
          fetchData={fetchPurchasesData}
          selectedPurchaseId={selectedPurchase?._id}
          onPurchaseClick={handlePurchaseClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          refreshKey={refreshKey}
        />
      </div>
    </div>
  );
});

Purchase.displayName = 'Purchase';

export default Purchase;
