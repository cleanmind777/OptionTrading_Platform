import { useEffect, useState, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { FaSyncAlt as RefreshIcon, FaExclamationCircle as ExclamationCircleIcon } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface BacktestLog {
    id: string;
    user_id: string;
    bot_id: string;
    strategy_id: string;
    is_active: boolean;
    result: JSON;
    start_date: string;
    end_date: string;
    created_at: string;
    finished_at: string;
}

const BacktestList = () => {
    const [backtestLogs, setBacktestLogs] = useState<BacktestLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedResult, setSelectedResult] = useState<JSON | null>(null); // State for selected result
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const userInfo = JSON.parse(localStorage.getItem("userinfo")!);

    const getAllBacktests = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { user_id: userInfo.id };
            const response = await axios.get(`${BACKEND_URL}/backtest/get-all-results`, { params });
            setBacktestLogs(response.data);
        } catch (err) {
            const error = err as AxiosError;
            setError(error.message || 'Failed to fetch backtest logs');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Open modal with result data
    const handleRowClick = (result: JSON) => {
        setSelectedResult(result);
        setIsModalOpen(true);
    };
    const [sortConfig, setSortConfig] = useState<{ key: keyof BacktestLog; direction: 'asc' | 'desc' } | null>(null);

    // Sorting function
    const sortedLogs = useMemo(() => {
        if (!sortConfig) return backtestLogs;

        return [...backtestLogs].sort((a, b) => {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];

            // Handle date strings
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                const dateA = new Date(valueA).getTime();
                const dateB = new Date(valueB).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Handle boolean values
            if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
                return sortConfig.direction === 'asc' ? (valueA === valueB ? 0 : valueA ? -1 : 1) : (valueA === valueB ? 0 : valueA ? 1 : -1);
            }

            // Default sorting for strings/numbers
            if (valueA < valueB) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [backtestLogs, sortConfig]);

    // Handle column header click for sorting
    const handleSort = (key: keyof BacktestLog) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Render sort indicator
    const getSortIndicator = (key: keyof BacktestLog) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    };
    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedResult(null);
    };

    useEffect(() => {
        getAllBacktests();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <ExclamationCircleIcon className="h-12 w-12 text-red-500 mb-4" />
                <div className="text-red-500 text-lg mb-4">Error: {error}</div>
                <button
                    onClick={getAllBacktests}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Backtest Logs</h1>
                <button
                    onClick={getAllBacktests}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <RefreshIcon className="h-5 w-5 mr-2" />
                    Refresh
                </button>
            </div>

            {backtestLogs.length === 0 ? (
                <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-sm">
                    No backtest logs found
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('id')}
                                >
                                    ID{getSortIndicator('id')}
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('bot_id')}
                                >
                                    Bot ID{getSortIndicator('bot_id')}
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('start_date')}
                                >
                                    Start Date{getSortIndicator('start_date')}
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('end_date')}
                                >
                                    End Date{getSortIndicator('end_date')}
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('created_at')}
                                >
                                    Created At{getSortIndicator('created_at')}
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('finished_at')}
                                >
                                    Finished At{getSortIndicator('finished_at')}
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('is_active')}
                                >
                                    Status{getSortIndicator('is_active')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedLogs.map(log => (
                                <tr
                                    key={log.id}
                                    onClick={() => handleRowClick(log.result)}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {log.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {log.bot_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(log.start_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(log.end_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(log.finished_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 text-sm font-semibold rounded-full ${log.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {log.is_active ? 'Running' : 'Finished'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for displaying result */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Backtest Result</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                {JSON.stringify(selectedResult, null, 2)}
                            </pre>
                        </div>
                        <div className="p-6 border-t border-gray-200">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BacktestList;