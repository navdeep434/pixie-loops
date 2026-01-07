type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
};

export default function Table<T>({ 
  columns, 
  data,
  striped = false,
  hoverable = true,
  className = "",
}: TableProps<T>) {
  return (
    <div className={`overflow-hidden rounded-2xl border-2 border-gray-100 shadow-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="border-b-2 border-gray-100 px-6 py-4 text-left text-sm font-bold text-purple-900"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📭</span>
                    <p>No data available</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={`
                    border-b border-gray-50 transition-colors
                    ${hoverable ? "hover:bg-purple-50/50" : ""}
                    ${striped && idx % 2 === 1 ? "bg-gray-50/50" : ""}
                  `}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}