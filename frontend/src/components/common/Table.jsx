import React, { memo } from 'react';

const Table = memo(({
  columns = [],
  data = [],
  onRowClick,
  actions = null,
  emptyMessage = 'No items found',
  emptyDescription = 'Get started by creating a new item',
  className = '',
  rowClassName = '',
  showActions = true,
}) => {
  const handleRowClick = (item, e) => {
    if (onRowClick && !e.target.closest('button')) {
      onRowClick(item);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key || column.name}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.label || column.title}
                </th>
              ))}
              {showActions && actions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions && actions ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-gray-500 font-medium text-lg">{emptyMessage}</p>
                    <p className="text-gray-400 text-sm mt-1">{emptyDescription}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowClass = typeof rowClassName === 'function' 
                  ? rowClassName(item) 
                  : rowClassName || '';
                
                return (
                  <tr
                    key={item._id || item.id || index}
                    className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150 ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${rowClass}`}
                    onClick={(e) => handleRowClick(item, e)}
                  >
                  {columns.map((column) => {
                    const cellValue = column.render
                      ? column.render(item[column.key || column.name], item)
                      : item[column.key || column.name] || (
                          <span className="text-gray-400">N/A</span>
                        );

                    return (
                      <td
                        key={column.key || column.name}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      >
                        <span className="font-medium">{cellValue}</span>
                      </td>
                    );
                  })}
                  {showActions && actions && (
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {typeof actions === 'function' ? actions(item) : actions}
                    </td>
                  )}
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

Table.displayName = 'Table';

export default Table;

