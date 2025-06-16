import { useState } from "react";

export function OpenPositions() {
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-slate-900 max-w-7xl mx-auto">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Open Account Positions
          </h1>

          {/* Market Status Banner */}
          <div className="bg-blue-100 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-8 text-center">
            The market is currently closed. Current account positions are only
            updated when the market is open.
          </div>

          {/* Open Positions by Underlying and Expiration Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Open Positions by Underlying and Expiration
            </h2>

            <div className="bg-slate-800 rounded-lg border border-slate-700">
              {/* Tab Headers */}
              <div className="flex border-b border-slate-700">
                <div className="px-4 py-3 text-sm text-gray-300 cursor-pointer hover:text-white border-r border-slate-700">
                  Account <span className="text-gray-500">▼</span>
                </div>
                <div className="px-4 py-3 text-sm text-gray-300 cursor-pointer hover:text-white border-r border-slate-700">
                  Underlying <span className="text-gray-500">▼</span>
                </div>
                <div className="px-4 py-3 text-sm text-gray-300 cursor-pointer hover:text-white border-r border-slate-700">
                  Expiration
                </div>
                <div className="px-4 py-3 text-sm text-gray-300 cursor-pointer hover:text-white border-r border-slate-700">
                  Long Puts
                </div>
                <div className="px-4 py-3 text-sm text-gray-300 cursor-pointer hover:text-white border-r border-slate-700">
                  Short Puts
                </div>
                <div className="px-4 py-3 text-sm text-gray-300 cursor-pointer hover:text-white border-r border-slate-700">
                  Long Calls
                </div>
                <div className="px-4 py-3 text-sm text-gray-300 cursor-pointer hover:text-white border-r border-slate-700">
                  Short Calls
                </div>
                <div className="px-4 py-3 text-sm text-gray-300 cursor-pointer hover:text-white border-r border-slate-700">
                  Short Calls vs Short Puts
                </div>
                <div className="px-4 py-3 text-sm text-gray-300 cursor-pointer hover:text-white">
                  Long Calls vs Long Puts
                </div>
              </div>

              {/* Empty State Message */}
              <div className="p-8 text-center">
                <p className="text-gray-400">
                  The market is currently closed. Current account positions are
                  only shown when the market is open.
                </p>
              </div>
            </div>
          </div>

          {/* All Account Positions Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              All Account Positions
            </h2>

            {/* Show entries and Search controls */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="bg-slate-700 border border-slate-600 text-white px-3 py-1 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-gray-300 text-sm">entries</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">Search:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white px-3 py-1 rounded text-sm w-48"
                  placeholder=""
                />
              </div>
            </div>

            {/* Main Positions Table */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Account <span className="text-gray-500">▲</span>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Symbol <span className="text-gray-500">▲</span>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Underlying
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Strike
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      P/C
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Expiration
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Last Changed
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Acct Open Qty
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Bots Open Qty
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Qty Diff
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Bot Avg Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Current Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                      Open Profit (Loss)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state row */}
                  <tr>
                    <td
                      colSpan={13}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      The market is currently closed. Current account positions
                      are only shown when the market is open.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination Info and Controls */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-gray-300 text-sm">
                Showing 0 to 0 of 0 entries
              </div>

              <div className="flex space-x-2">
                <button
                  disabled
                  className="px-3 py-1 bg-slate-700 text-gray-500 rounded text-sm cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled
                  className="px-3 py-1 bg-slate-700 text-gray-500 rounded text-sm cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
