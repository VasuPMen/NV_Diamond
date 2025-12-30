import React, { memo } from 'react';

const PurchaseDetail = memo(({ purchase, packets, onAddPackets, onEditPacket, onDeletePacket }) => {
  const pieces = purchase.Pieces || purchase.pieces || 0;
  const packetsCount = packets.length;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Purchase Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Purchase Details</h3>
            <p className="text-blue-100 text-sm mt-1">Jangan No: {purchase.janganNo}</p>
          </div>
          {packetsCount < pieces && (
            <button
              onClick={onAddPackets}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Packets
            </button>
          )}
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
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Packets</h4>

          {packets.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">No packets have been created for this purchase yet.</span>
              </div>
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEditPacket(packet)}
                            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-150 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => onDeletePacket(packet._id)}
                            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-150 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
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


