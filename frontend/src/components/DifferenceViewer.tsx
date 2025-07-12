import React from 'react';
import { CompareValuesWithDetailedDifferences } from 'object-deep-compare';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

type DiffType = 'changed' | 'added' | 'removed';

interface Difference {
    path: string;
    type: DiffType;
    oldValue?: unknown; // Optional to match library output
    newValue?: unknown; // Optional to match library output
}

interface DifferenceViewerProps {
    jsonA?: unknown;
    jsonB?: unknown;
    className?: string;
}

const formatValue = (value: unknown): string => {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value ? 'True' : 'False';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
};

const DifferenceViewer: React.FC<DifferenceViewerProps> = ({ jsonA, jsonB, className }) => {
    let differences: Difference[] = [];

    // Only compare if both are non-null objects or arrays
    if (
        typeof jsonA === 'object' && jsonA !== null &&
        typeof jsonB === 'object' && jsonB !== null
    ) {
        differences = CompareValuesWithDetailedDifferences(jsonA, jsonB) || [];
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className || ''}`}>
            <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800">Comparison Results</h3>
            </div>

            <div className="px-6 py-4">
                {differences.length === 0 ? (
                    <div className="text-center py-6">
                        <div className="text-gray-400">No differences detected</div>
                        <div className="mt-2 text-sm text-gray-500">The objects are identical</div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {differences.map((diff, idx) => (
                            <div key={idx} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-start space-x-3">
                                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${diff.type === 'added'
                                            ? 'bg-green-400'
                                            : diff.type === 'removed'
                                                ? 'bg-red-400'
                                                : 'bg-blue-400'
                                        }`}></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-700">
                                            {diff.path}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500">
                                            {diff.type === 'changed' && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-red-500 line-through">
                                                        {formatValue(diff.oldValue)}
                                                    </span>
                                                    <ChevronRightIcon className="h-3 w-3 text-gray-400" />
                                                    <span className="text-green-600">
                                                        {formatValue(diff.newValue)}
                                                    </span>
                                                </div>
                                            )}
                                            {diff.type === 'added' && (
                                                <span className="text-green-600">
                                                    Added: {formatValue(diff.newValue)}
                                                </span>
                                            )}
                                            {diff.type === 'removed' && (
                                                <span className="text-red-500">
                                                    Removed: {formatValue(diff.oldValue)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DifferenceViewer;
