import React, { memo } from 'react';

const PurchaseDetail = memo(({ purchase, packets, onAddPackets, onEditPacket, onDeletePacket }) => {
  const pieces = purchase.Pieces || purchase.pieces || 0;
  const packetsCount = packets.length;

  return (
    <div className="bg-white rounded-lg shadow-lg mb-6 border border-gray-200">
      {/* Purchase Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-lg">
        <div>
          <h3 className="text-xl font-bold">Purchase Details</h3>
          <p className="text-blue-100 text-sm mt-1">Jangan No: {purchase.janganNo}</p>
        </div>
      </div>

      {/* Purchase Information Table */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Purchase Type</p>
            <p className="text-lg font-semibold text-gray-900">{purchase.purchaseType}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Stone</p>
            <p className="text-lg font-semibold text-gray-900">{purchase.stone?.name || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Rate</p>
            <p className="text-lg font-semibold text-gray-900">{purchase.rate}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Weight</p>
            <p className="text-lg font-semibold text-gray-900">{purchase.totalWeight}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Pieces</p>
            <p className="text-lg font-semibold text-gray-900">{pieces}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Packets Created</p>
            <p className="text-lg font-semibold text-gray-900">{packetsCount} / {pieces}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Remaining</p>
            <p className={`text-lg font-semibold ${pieces - packetsCount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {pieces - packetsCount}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="text-lg font-semibold text-gray-900">{purchase.status || 'hold'}</p>
          </div>
        </div>

        {/* Packets Table */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Packets</h4>
            {packetsCount < pieces && (
              <button
                onClick={onAddPackets}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + Add Packets
              </button>
            )}
          </div>

          {packets.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">No packets have been created for this purchase yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Packet No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Stock Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Polish Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Shape
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Color
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Purity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Cut
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Polish
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Symmetry
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Fluorescence
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Table
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {packets.map((packet) => (
                    <tr key={packet._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.packetNo}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.stockWeight}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.polishWeight}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.shape?.name || 'N/A'} {packet.shape?.code ? `(${packet.shape.code})` : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.color?.name || 'N/A'} {packet.color?.code ? `(${packet.color.code})` : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.purity?.name || 'N/A'} {packet.purity?.code ? `(${packet.purity.code})` : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.cut?.name || 'N/A'} {packet.cut?.code ? `(${packet.cut.code})` : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.polish?.name || 'N/A'} {packet.polish?.code ? `(${packet.polish.code})` : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.symmetry?.name || 'N/A'} {packet.symmetry?.code ? `(${packet.symmetry.code})` : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.fluorescence?.name || 'N/A'} {packet.fluorescence?.code ? `(${packet.fluorescence.code})` : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.table?.name || 'N/A'} {packet.table?.code ? `(${packet.table.code})` : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        {packet.rate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          packet.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {packet.status || 'hold'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => onEditPacket(packet)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeletePacket(packet._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PurchaseDetail.displayName = 'PurchaseDetail';

export default PurchaseDetail;


