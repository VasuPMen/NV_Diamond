import React, { useState, useEffect, useCallback, memo } from 'react';

const PaginatedTable = memo(({
  columns = [],
  fetchData,
  onRowClick,
  actions = null,
  emptyMessage = 'No items found',
  emptyDescription = 'Get started by creating a new item',
  className = '',
  rowClassName = '',
  showActions = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  refreshKey = 0,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeState, setPageSizeState] = useState(pageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadData = useCallback(async (page = 1, limit = pageSizeState) => {
    if (!fetchData) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetchData(page, limit);
      const result = response.data || response;
      
      // Handle different response formats
      if (result.data && Array.isArray(result.data)) {
        setData(result.data);
        setTotalCount(result.total || result.count || result.data.length);
        setTotalPages(result.totalPages || Math.ceil((result.total || result.count || result.data.length) / limit));
      } else if (Array.isArray(result)) {
        setData(result);
        setTotalCount(result.length);
        setTotalPages(Math.ceil(result.length / limit));
      } else {
        setData([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
      setData([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [fetchData, pageSizeState]);

  useEffect(() => {
    loadData(currentPage, pageSizeState);
  }, [loadData, currentPage, pageSizeState, refreshKey]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  const handlePageSizeChange = useCallback((e) => {
    const newSize = parseInt(e.target.value);
    setPageSizeState(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleRowClick = (item, e) => {
    if (onRowClick && !e.target.closest('button')) {
      onRowClick(item);
    }
  };

  const startIndex = (currentPage - 1) * pageSizeState + 1;
  const endIndex = Math.min(currentPage * pageSizeState, totalCount);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Page Size Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 font-medium">Show:</label>
          <select
            value={pageSizeState}
            onChange={handlePageSizeChange}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entries</span>
        </div>
        <div className="text-sm text-gray-600">
          Showing {startIndex} to {endIndex} of {totalCount} entries
        </div>
      </div>

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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 font-medium">Loading...</p>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 0 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

PaginatedTable.displayName = 'PaginatedTable';

export default PaginatedTable;

