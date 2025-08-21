import React from 'react';

interface JsonTableRenderProps {
    data: any;
    title?: string;
    className?: string;
}

interface TableData {
    headers: string[];
    rows: any[][];
}

const JsonTableRender: React.FC<JsonTableRenderProps> = ({ data, title, className = '' }) => {
    // Check if we have results data to display in row-column format
    const hasResultsData = data && data.results && Array.isArray(data.results) && data.results.length > 0;

    // Function to convert results array to table data
    const getResultsTableData = (results: any[]): TableData => {
        if (!results || results.length === 0) return { headers: [], rows: [] };
        
        // Get all unique keys from all result items
        const allKeys = results.reduce((keys: Set<string>, item) => {
            if (item && typeof item === 'object') {
                Object.keys(item).forEach(key => keys.add(key));
            }
            return keys;
        }, new Set<string>());

        const headers = Array.from(allKeys);
        const rows = results.map(item => 
            headers.map(header => {
                const value = item[header];
                if (value === null || value === undefined) return 'null';
                if (typeof value === 'object') return JSON.stringify(value);
                return String(value);
            })
        );

        return { headers, rows };
    };

    // Function to flatten the object into key-value pairs
    const flattenObject = (obj: any, prefix = ''): Array<{key: string, value: string}> => {
        if (!obj || typeof obj !== 'object') return [];
        
        return Object.keys(obj).reduce((acc: Array<{key: string, value: string}>, k) => {
            if (k === 'results') return acc; // Skip results as we handle it separately
            
            const pre = prefix.length ? `${prefix}.` : '';
            const currentKey = pre + k;
            const value = obj[k];
            
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                // For nested objects, recursively flatten them
                return [...acc, ...flattenObject(value, currentKey)];
            } else if (Array.isArray(value)) {
                // For arrays, convert to string
                return [...acc, { 
                    key: currentKey, 
                    value: `[${value.map((item: any) => 
                        typeof item === 'object' ? JSON.stringify(item) : String(item)
                    ).join(', ')}]` 
                }];
            } else {
                // For primitive values
                return [...acc, { 
                    key: currentKey, 
                    value: value === null ? 'null' : String(value) 
                }];
            }
        }, []);
    };

    // Get flattened data (excluding results)
    const flattenedData = flattenObject(data);
    
    // Get results table data if available
    const resultsTableData = hasResultsData ? getResultsTableData(data.results) : null;

    return (
        <div className={`space-y-6 ${className}`}>
            {title && <h4 className="font-medium">{title}</h4>}
            
            {/* Main data table */}
            {flattenedData.length > 0 && (
                <div className="overflow-auto max-h-96 border rounded-md">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="border px-4 py-2 text-left w-1/3">Key</th>
                                <th className="border px-4 py-2 text-left">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flattenedData.map((item, index) => (
                                <tr key={`data-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="border px-4 py-2 font-mono text-sm">{item.key}</td>
                                    <td className="border px-4 py-2 break-words">{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Results table */}
            {resultsTableData && resultsTableData.headers.length > 0 && (
                <div className="mt-6">
                    <h5 className="font-medium mb-2">Results</h5>
                    <div className="overflow-auto max-h-96 border rounded-md">
                        <table className="min-w-full bg-white dark:bg-gray-800">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    {resultsTableData.headers.map((header, idx) => (
                                        <th key={`header-${idx}`} className="border px-4 py-2 text-left">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {resultsTableData.rows.map((row, rowIdx) => (
                                    <tr key={`row-${rowIdx}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        {row.map((cell, cellIdx) => (
                                            <td key={`cell-${rowIdx}-${cellIdx}`} className="border px-4 py-2 break-words">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JsonTableRender;
