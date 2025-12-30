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

  const handleBack = useCallback(() => {
    setSelectedPurchase(null);
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
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Purchases</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPurchase ? 'Edit Purchase' : 'Create Purchase'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {editingPurchase ? 'Update the purchase details below' : 'Fill in the information to create a new purchase'}
              </p>
            </div>
            <PurchaseForm
              purchase={editingPurchase}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  const purchasePackets = getPacketsForPurchase();

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header Section - only show when no purchase is selected */}
          {!selectedPurchase && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Purchase Management</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage your purchase data</p>
                </div>
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Purchase
                </button>
              </div>
            </div>
          )}

          {/* Header Section - show when purchase is selected */}
          {selectedPurchase && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Purchases</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Purchase Management</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage your purchase data</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
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

          {/* Purchase List - only show when no purchase is selected */}
          {!selectedPurchase && (
            <PurchaseList
              fetchData={fetchPurchasesData}
              selectedPurchaseId={selectedPurchase?._id}
              onPurchaseClick={handlePurchaseClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
              refreshKey={refreshKey}
            />
          )}
        </div>
      </div>
    </div>
  );
});

Purchase.displayName = 'Purchase';

export default Purchase;