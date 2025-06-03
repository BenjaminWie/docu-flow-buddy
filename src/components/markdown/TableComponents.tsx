
import { ReactNode } from 'react';

export const Table = ({ children }: { children: ReactNode }) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-lg">
      {children}
    </table>
  </div>
);

export const TableHead = ({ children }: { children: ReactNode }) => (
  <thead className="bg-gray-50">
    {children}
  </thead>
);

export const TableHeader = ({ children }: { children: ReactNode }) => (
  <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
    {children}
  </th>
);

export const TableCell = ({ children }: { children: ReactNode }) => (
  <td className="border border-gray-300 px-4 py-2 text-gray-700">
    {children}
  </td>
);
