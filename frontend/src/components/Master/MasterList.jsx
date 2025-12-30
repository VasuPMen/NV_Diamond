import React, { memo, useCallback } from 'react';
import PaginatedTable from '../common/PaginatedTable';

const MasterList = memo(({ apiMethods, fields, onEdit, onDelete }) => {
  const columns = fields.map((field) => ({
    key: field.name,
    label: field.label,
    render: field.render,
  }));

  const fetchData = useCallback(
    async (page, limit) => {
      return await apiMethods.getAll(page, limit);
    },
    [apiMethods]
  );

  const renderActions = useCallback(
    (item) => {
      const handleEdit = () => {
        onEdit(item);
      };

      const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
          onDelete(item._id);
        }
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

  return (
    <PaginatedTable
      columns={columns}
      fetchData={fetchData}
      actions={renderActions}
      emptyMessage="No items found"
      emptyDescription="Get started by creating a new item"
      pageSize={10}
    />
  );
});

MasterList.displayName = 'MasterList';

export default MasterList;

