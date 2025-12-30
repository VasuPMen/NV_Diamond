import React, { memo, useCallback } from 'react';
import PaginatedTable from '../common/PaginatedTable';

const PurchaseList = memo(({ fetchData, selectedPurchaseId, onPurchaseClick, onEdit, onDelete, refreshKey = 0 }) => {
  const columns = [
    { key: 'janganNo', label: 'Jangan No' },
    { key: 'purchaseType', label: 'Type' },
    {
      key: 'stone',
      label: 'Stone',
      render: (value, item) => item.stone?.name || 'N/A',
    },
    { key: 'rate', label: 'Rate' },
    { key: 'totalWeight', label: 'Total Weight' },
    {
      key: 'pieces',
      label: 'Pieces',
      render: (value, item) => item.Pieces || item.pieces || 0,
    },
    {
      key: 'packets',
      label: 'Packets',
      render: (value, item) => item.packets?.length || 0,
    },
  ];

  const renderActions = useCallback(
    (purchase) => {
      const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(purchase);
      };

      const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(purchase._id);
      };

      return (
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-150 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-all duration-150 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      );
    },
    [onEdit, onDelete]
  );

  const handleRowClick = useCallback(
    (purchase) => {
      onPurchaseClick(purchase);
    },
    [onPurchaseClick]
  );

  return (
    <PaginatedTable
      columns={columns}
      fetchData={fetchData}
      onRowClick={handleRowClick}
      actions={renderActions}
      emptyMessage="No purchases found"
      emptyDescription="Click 'Create Purchase' to add one"
      rowClassName={(item) => (selectedPurchaseId === item._id ? 'bg-blue-50 hover:bg-blue-100' : '')}
      pageSize={10}
      refreshKey={refreshKey}
    />
  );
});

PurchaseList.displayName = 'PurchaseList';

export default PurchaseList;
