import React from 'react';

export default function DataTable({
  columns,
  data,
  rowKey = 'id',
  emptyMessage = 'No records found',
}) {
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="card overflow-hidden shadow-md-token">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-surface border-b border-default">
            <tr>
              {safeColumns.map((col) => (
                <th
                  key={col.key || col.header}
                  scope="col"
                  className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-muted ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-surface">
            {safeData.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-muted" colSpan={Math.max(1, safeColumns.length)}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              safeData.map((row, index) => {
                const keyValue = row?.[rowKey] ?? index;

                return (
                  <tr key={keyValue} className="border-b border-default last:border-b-0 table-row-hover">
                    {safeColumns.map((col) => {
                      const value = col.accessor ? row?.[col.accessor] : undefined;
                      const content = typeof col.cell === 'function' ? col.cell({ row, value }) : value;

                      return (
                        <td key={col.key || col.header} className={`px-6 py-4 align-middle text-primary ${col.className || ''}`}>
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}