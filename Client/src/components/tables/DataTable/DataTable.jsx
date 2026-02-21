const DataTable = ({columns, rows, emptyState = "No data available."}) => {
  const hasRows = rows && rows.length > 0;
  return (
    <div className="panel overflow-hidden">
      <div className="divide-y divide-[color:rgb(var(--border-default))] lg:hidden">
        {hasRows ? (
          rows.map((row, index) => (
            <div key={row.id || row._id || index} className="px-4 py-4">
              <div className="grid gap-3">
                {columns.map((col) => (
                  <div key={col.key} className="grid gap-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-secondary">
                      {col.label}
                    </span>
                    <div className="min-w-0 text-sm text-primary">
                      {col.render ? col.render(row) : row[col.key]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-sm text-secondary">{emptyState}</div>
        )}
      </div>
      <div className="hidden lg:block">
        <table className="w-full text-left text-sm">
          <thead className="surface-hover">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-head px-4 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:rgb(var(--border-default))]">
            {hasRows ? (
              rows.map((row, index) => (
                <tr key={row.id || row._id || index} className="text-sm">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 align-top text-primary">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-sm text-secondary" colSpan={columns.length}>
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;



