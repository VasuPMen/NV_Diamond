import React, { useState, useEffect, memo, useCallback } from 'react';
import { packetAPI, purchaseAPI, masterAPI } from '../../services/api';

const PacketForm = memo(({ purchase, packet = null, existingPacketsCount = 0, onSave, onCancel }) => {
  const totalPieces = purchase?.Pieces || purchase?.pieces || 0;
  const remainingPieces = totalPieces - existingPacketsCount;
  const isEditing = !!packet;

  // Initialize form data - if editing, use packet data; otherwise create new row
  const getInitialRow = () => {
    if (packet) {
      return {
        id: 1,
        packetNo: packet.packetNo || '',
        stockWeight: packet.stockWeight || '',
        polishWeight: packet.polishWeight || '',
        shape: packet.shape?._id || packet.shape || '',
        color: packet.color?._id || packet.color || '',
        purity: packet.purity?._id || packet.purity || '',
        cut: packet.cut?._id || packet.cut || '',
        polish: packet.polish?._id || packet.polish || '',
        symmetry: packet.symmetry?._id || packet.symmetry || '',
        fluorescence: packet.fluorescence?._id || packet.fluorescence || '',
        table: packet.table?._id || packet.table || '',
        discount: packet.discount || '',
        rapoRate: packet.rapoRate || '',
        rate: packet.rate || purchase?.rate || '',
        estValue: packet.estValue || '',
        purchaseRate: packet.purchaseRate || purchase?.rate || '',
      };
    }
    return {
      id: 1,
      packetNo: '',
      stockWeight: '',
      polishWeight: '',
      shape: '',
      color: '',
      purity: '',
      cut: '',
      polish: '',
      symmetry: '',
      fluorescence: '',
      table: '',
      discount: '',
      rapoRate: '',
      rate: '',
      estValue: '',
      purchaseRate: '',
    };
  };

  const [packetRows, setPacketRows] = useState(() => [getInitialRow()]);

  const [masterData, setMasterData] = useState({
    shapes: [],
    colors: [],
    purities: [],
    cuts: [],
    polishes: [],
    symmetries: [],
    fluorescences: [],
    tables: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nextId, setNextId] = useState(2);

  useEffect(() => {
    // Reset form when packet changes
    if (packet) {
      setPacketRows([{
        id: 1,
        packetNo: packet.packetNo || '',
        stockWeight: packet.stockWeight || '',
        polishWeight: packet.polishWeight || '',
        shape: packet.shape?._id || packet.shape || '',
        color: packet.color?._id || packet.color || '',
        purity: packet.purity?._id || packet.purity || '',
        cut: packet.cut?._id || packet.cut || '',
        polish: packet.polish?._id || packet.polish || '',
        symmetry: packet.symmetry?._id || packet.symmetry || '',
        fluorescence: packet.fluorescence?._id || packet.fluorescence || '',
        table: packet.table?._id || packet.table || '',
        discount: packet.discount || '',
        rapoRate: packet.rapoRate || '',
        rate: packet.rate || purchase?.rate || '',
        estValue: packet.estValue || '',
        purchaseRate: packet.purchaseRate || purchase?.rate || '',
      }]);
    } else {
      setPacketRows([{
        id: 1,
        packetNo: '',
        stockWeight: '',
        polishWeight: '',
        shape: '',
        color: '',
        purity: '',
        cut: '',
        polish: '',
        symmetry: '',
        fluorescence: '',
        table: '',
        discount: '',
        rapoRate: '',
        rate: '',
        estValue: '',
        purchaseRate: '',
      }]);
    }
  }, [packet, purchase]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [
          shapesRes,
          colorsRes,
          puritiesRes,
          cutsRes,
          polishesRes,
          symmetriesRes,
          fluorescencesRes,
          tablesRes,
        ] = await Promise.all([
          masterAPI.shape.getAll(1, 1000), // Fetch all data with large limit
          masterAPI.color.getAll(1, 1000),
          masterAPI.purity.getAll(1, 1000),
          masterAPI.cut.getAll(1, 1000),
          masterAPI.polish.getAll(1, 1000),
          masterAPI.symmetry.getAll(1, 1000),
          masterAPI.fluorescence.getAll(1, 1000),
          masterAPI.table.getAll(1, 1000),
        ]);

        // Handle paginated response structure
        const getDataArray = (response) => {
          if (!response || !response.data) return [];
          // Check if response.data is paginated structure
          if (response.data.data && Array.isArray(response.data.data)) {
            return response.data.data;
          }
          // Check if response.data is direct array
          if (Array.isArray(response.data)) {
            return response.data;
          }
          return [];
        };

        setMasterData({
          shapes: getDataArray(shapesRes),
          colors: getDataArray(colorsRes),
          purities: getDataArray(puritiesRes),
          cuts: getDataArray(cutsRes),
          polishes: getDataArray(polishesRes),
          symmetries: getDataArray(symmetriesRes),
          fluorescences: getDataArray(fluorescencesRes),
          tables: getDataArray(tablesRes),
        });
      } catch (err) {
        setError('Failed to load master data');
      }
    };
    fetchMasterData();
  }, []);

  const handleAddRow = useCallback(() => {
    const currentPacketCount = packetRows.length;
    if (currentPacketCount + existingPacketsCount >= totalPieces) {
      setError(`Cannot add more rows. Total packets (${currentPacketCount + existingPacketsCount}) would exceed purchase pieces (${totalPieces})`);
      return;
    }
    setError('');
    setPacketRows((prev) => [
      ...prev,
      {
        id: nextId,
        packetNo: '',
        stockWeight: '',
        polishWeight: '',
        shape: '',
        color: '',
        purity: '',
        cut: '',
        polish: '',
        symmetry: '',
        fluorescence: '',
        table: '',
        discount: '',
        rapoRate: '',
        rate: '',
        estValue: '',
        purchaseRate: '',
      },
    ]);
    setNextId((prev) => prev + 1);
  }, [nextId, purchase, packetRows, existingPacketsCount, totalPieces]);

  const handleRemoveRow = useCallback((id) => {
    setPacketRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const handleRowChange = useCallback((id, field, value) => {
    setPacketRows((prev) => {
      const updated = prev.map((row) => (row.id === id ? { ...row, [field]: value } : row));
      return updated;
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate all rows
      const invalidRows = packetRows.filter(
        (row) =>
          !row.packetNo ||
          !row.stockWeight ||
          !row.polishWeight ||
          !row.shape ||
          !row.color ||
          !row.purity ||
          !row.cut ||
          !row.polish ||
          !row.symmetry ||
          !row.fluorescence ||
          !row.table ||
          !row.discount ||
          !row.rapoRate ||
          !row.rate ||
          !row.estValue ||
          !row.purchaseRate
      );

      if (invalidRows.length > 0) {
        setError('Please fill all required fields in all rows');
        setLoading(false);
        return;
      }

      // Validate total packets limit
      const currentPacketCount = packetRows.length;
      if (currentPacketCount + existingPacketsCount > totalPieces) {
        setError(`Total packets (${currentPacketCount + existingPacketsCount}) cannot exceed purchase pieces (${totalPieces}). Please reduce the number of packets.`);
        setLoading(false);
        return;
      }

      // If editing a single packet
      if (isEditing && packet) {
        const packetData = {
          packetNo: packetRows[0].packetNo,
          stockWeight: parseFloat(packetRows[0].stockWeight),
          polishWeight: parseFloat(packetRows[0].polishWeight),
          shape: packetRows[0].shape,
          color: packetRows[0].color,
          purity: packetRows[0].purity,
          cut: packetRows[0].cut,
          polish: packetRows[0].polish,
          symmetry: packetRows[0].symmetry,
          fluorescence: packetRows[0].fluorescence,
          table: packetRows[0].table,
          discount: parseFloat(packetRows[0].discount),
          rapoRate: parseFloat(packetRows[0].rapoRate),
          rate: parseFloat(packetRows[0].rate),
          estValue: parseFloat(packetRows[0].estValue),
          purchaseRate: parseFloat(packetRows[0].purchaseRate),
        };

        await packetAPI.update(packet._id, packetData);
      } else {
        // Create all packets
        const createdPackets = [];
        for (const row of packetRows) {
          const packetData = {
            packetNo: row.packetNo,
            stockWeight: parseFloat(row.stockWeight),
            polishWeight: parseFloat(row.polishWeight),
            shape: row.shape,
            color: row.color,
            purity: row.purity,
            cut: row.cut,
            polish: row.polish,
            symmetry: row.symmetry,
            fluorescence: row.fluorescence,
            table: row.table,
            discount: parseFloat(row.discount),
            rapoRate: parseFloat(row.rapoRate),
            rate: parseFloat(row.rate),
            estValue: parseFloat(row.estValue),
            purchaseRate: parseFloat(row.purchaseRate),
          };

          const response = await packetAPI.create(packetData);
          createdPackets.push(response.data);
        }

        // Add all packets to purchase
        if (purchase?._id && createdPackets.length > 0) {
          const purchaseData = {
            ...purchase,
            packets: [
              ...(purchase.packets || []),
              ...createdPackets.map((p) => p._id),
            ],
          };
          await purchaseAPI.update(purchase._id, purchaseData);
        }
      }

      // Call onSave which will refresh the data
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create packets');
    } finally {
      setLoading(false);
    }
  }, [packetRows, purchase, onSave]);

  const getSelectOptions = useCallback((type) => {
    const data = masterData[type];
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data.map((item) => (
      <option key={item._id} value={item._id}>
        {item.name} ({item.code})
      </option>
    ));
  }, [masterData]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">
              {isEditing ? 'Edit Packet' : 'Add Packets to Purchase'}
            </h3>
            <p className="text-green-100 text-sm mt-1">
              {isEditing ? 'Update packet details' : 'Create new packets for this purchase'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-6">

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

        {!isEditing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Purchase Pieces:</span>
                  <span className="ml-2 text-gray-600">{totalPieces}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Existing Packets:</span>
                  <span className="ml-2 text-gray-600">{existingPacketsCount}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Remaining:</span>
                  <span className="ml-2 text-gray-600">{remainingPieces}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">New Packets:</span>
                  <span className="ml-2 text-gray-600">{packetRows.length}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                disabled={packetRows.length + existingPacketsCount >= totalPieces}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Row
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto overflow-y-auto max-h-[600px] border border-gray-300 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-20">
              <tr>
                  {!isEditing && (
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 sticky left-0 bg-gray-50 z-30 min-w-[80px]">
                      Action
                    </th>
                  )}
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[120px] whitespace-nowrap">
                  Packet No *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[110px] whitespace-nowrap">
                  Stock Wt *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[110px] whitespace-nowrap">
                  Polish Wt *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[130px] whitespace-nowrap">
                  Shape *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[130px] whitespace-nowrap">
                  Color *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[130px] whitespace-nowrap">
                  Purity *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[130px] whitespace-nowrap">
                  Cut *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[130px] whitespace-nowrap">
                  Polish *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[130px] whitespace-nowrap">
                  Symmetry *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[140px] whitespace-nowrap">
                  Fluorescence *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[130px] whitespace-nowrap">
                  Table *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[120px] whitespace-nowrap">
                  Discount *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[120px] whitespace-nowrap">
                  Rapo Rate *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[100px] whitespace-nowrap">
                  Rate *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase border-r border-gray-300 min-w-[120px] whitespace-nowrap">
                  Est Value *
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase min-w-[140px] whitespace-nowrap">
                  Purchase Rate *
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packetRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {!isEditing && (
                    <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 sticky left-0 bg-white z-10">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="text-red-600 hover:text-red-900 text-base font-bold"
                        disabled={packetRows.length === 1}
                      >
                        ✕
                      </button>
                    </td>
                  )}
                  <td className="px-4 py-3 border-r border-gray-300">
                    <input
                      type="text"
                      value={row.packetNo}
                      onChange={(e) => handleRowChange(row.id, 'packetNo', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <input
                      type="number"
                      step="0.01"
                      value={row.stockWeight}
                      onChange={(e) => handleRowChange(row.id, 'stockWeight', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <input
                      type="number"
                      step="0.01"
                      value={row.polishWeight}
                      onChange={(e) => handleRowChange(row.id, 'polishWeight', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <select
                      value={row.shape}
                      onChange={(e) => handleRowChange(row.id, 'shape', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      {getSelectOptions('shapes')}
                    </select>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <select
                      value={row.color}
                      onChange={(e) => handleRowChange(row.id, 'color', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      {getSelectOptions('colors')}
                    </select>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <select
                      value={row.purity}
                      onChange={(e) => handleRowChange(row.id, 'purity', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      {getSelectOptions('purities')}
                    </select>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <select
                      value={row.cut}
                      onChange={(e) => handleRowChange(row.id, 'cut', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      {getSelectOptions('cuts')}
                    </select>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <select
                      value={row.polish}
                      onChange={(e) => handleRowChange(row.id, 'polish', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      {getSelectOptions('polishes')}
                    </select>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <select
                      value={row.symmetry}
                      onChange={(e) => handleRowChange(row.id, 'symmetry', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      {getSelectOptions('symmetries')}
                    </select>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <select
                      value={row.fluorescence}
                      onChange={(e) => handleRowChange(row.id, 'fluorescence', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      {getSelectOptions('fluorescences')}
                    </select>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <select
                      value={row.table}
                      onChange={(e) => handleRowChange(row.id, 'table', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      {getSelectOptions('tables')}
                    </select>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <input
                      type="number"
                      step="0.01"
                      value={row.discount}
                      onChange={(e) => handleRowChange(row.id, 'discount', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <input
                      type="number"
                      step="0.01"
                      value={row.rapoRate}
                      onChange={(e) => handleRowChange(row.id, 'rapoRate', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <input
                      type="number"
                      step="0.01"
                      value={row.rate}
                      onChange={(e) => handleRowChange(row.id, 'rate', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </td>
                  <td className="px-4 py-3 border-r border-gray-300">
                    <input
                      type="number"
                      step="0.01"
                      value={row.estValue}
                      onChange={(e) => handleRowChange(row.id, 'estValue', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={row.purchaseRate}
                      onChange={(e) => handleRowChange(row.id, 'purchaseRate', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditing ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Packet
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create {packetRows.length} Packet{packetRows.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
});

PacketForm.displayName = 'PacketForm';

export default PacketForm;
