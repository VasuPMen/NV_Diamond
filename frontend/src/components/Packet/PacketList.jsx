import React, { memo, useCallback, useState } from 'react';

const PurchaseItem = memo(({ purchase, onAddPackets, existingPacketsCount }) => {
  const [loading, setLoading] = useState(false);
  const pieces = purchase.Pieces || purchase.pieces || 0;
  const hasPackets = existingPacketsCount > 0;

  const handleAddPackets = useCallback(async () => {
    if (!pieces || pieces <= 0) {
      alert('Pieces number is not set in this purchase. Please set it first.');
      return;
    }

    if (hasPackets) {
      if (!window.confirm(`This purchase already has ${existingPacketsCount} packet(s). Do you want to create ${pieces} more packet(s)?`)) {
        return;
      }
    }

    setLoading(true);
    try {
      await onAddPackets(purchase._id);
    } catch (err) {
      alert('Failed to add packets');
    } finally {
      setLoading(false);
    }
  }, [purchase._id, pieces, hasPackets, existingPacketsCount, onAddPackets]);

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {purchase.janganNo}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {purchase.purchaseType}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {purchase.stone?.name || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {purchase.rate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {pieces}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {existingPacketsCount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={handleAddPackets}
          disabled={!pieces || pieces <= 0 || loading}
          className={`px-4 py-2 rounded-lg transition-colors ${!pieces || pieces <= 0 || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          title={!pieces || pieces <= 0 ? 'Set pieces number in purchase first' : 'Add Packets'}
        >
          {loading ? 'Creating...' : 'Add Packets'}
        </button>
      </td>
    </tr>
  );
});

PurchaseItem.displayName = 'PurchaseItem';

const PacketList = memo(({ purchases, packets, onAddPackets }) => {


  // Create a map of purchase ID to packet count
  const purchasePacketCounts = {};
  purchases.forEach(purchase => {
    purchasePacketCounts[purchase._id] = purchase.packets?.length || 0;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Purchases - Add Packets</h3>
          <p className="text-sm text-gray-500 mt-1">
            Select a purchase and click "Add Packets" to create packets based on the pieces number
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jangan No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pieces
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Existing Packets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No purchases found
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <PurchaseItem
                    key={purchase._id}
                    purchase={purchase}
                    onAddPackets={onAddPackets}
                    existingPacketsCount={purchasePacketCounts[purchase._id] || 0}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">All Packets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Packet No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Polish Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pieces
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No packets found
                  </td>
                </tr>
              ) : (
                packets.map((packet) => (
                  <tr key={packet._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {packet.packetNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {packet.stockWeight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {packet.polishWeight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {packet.rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {packet.pieces}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs rounded-full ${packet.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {packet.status || 'hold'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

PacketList.displayName = 'PacketList';

export default PacketList;

