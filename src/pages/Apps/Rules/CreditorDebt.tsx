import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import apiService from '../../../contexts/ApiService';
import { exportTable, ExportColumn } from '../../../utils/exportUtils';
import IconFile from '../../../components/Icon/IconFile';
import IconPrinter from '../../../components/Icon/IconPrinter';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconEdit from '../../../components/Icon/IconEdit';
import IconEye from '../../../components/Icon/IconEye';

interface CreditorDebtRule {
    id: number;
    state: string;
    rule: string;
    deduction_basis: string;
    withholding_limit: string | number;
    withholding_limit_rule?: string;
    created_at?: string;
    updated_at?: string;
}

const CreditorDebt = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Creditor Debt Rules'));
    }, [dispatch]);

    const [rules, setRules] = useState<CreditorDebtRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecords, setSelectedRecords] = useState<CreditorDebtRule[]>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<CreditorDebtRule[]>([]);
    const [records, setRecords] = useState<CreditorDebtRule[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'state',
        direction: 'asc',
    });

    // Handle delete selected records
    const deleteSelectedRecords = () => {
        if (window.confirm('Are you sure you want to delete selected records?')) {
            const updatedRules = rules.filter(rule => !selectedRecords.some(selected => selected.id === rule.id));
            setRules(updatedRules);
            setInitialRecords(updatedRecords =>
                updatedRecords.filter(record => !selectedRecords.some(selected => selected.id === record.id))
            );
            setSelectedRecords([]);
        }
    };

    // Debug function to log current state
    const logState = (label: string) => {
        console.group(`CreditorDebt State at ${label}`);
        console.log('rules:', rules);
        console.log('initialRecords:', initialRecords);
        console.log('records:', records);
        console.log('loading:', loading);
        console.log('error:', error);
        console.groupEnd();
    };

    // Fetch rules data
    useEffect(() => {
        const fetchRules = async () => {
            try {
                console.log('1. Starting to fetch creditor debt rules...');
                setLoading(true);
                logState('after setLoading(true)');

                // Make direct API call for debugging
                console.log('2. Making API call to creditor debt endpoint...');
                const response = await fetch('https://garnishment-backend-6lzi.onrender.com/garnishment_creditor/creditor-debt-rule/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });

                console.log('3. API response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('4. API Error Response:', {
                        status: response.status,
                        statusText: response.statusText,
                        headers: Object.fromEntries(response.headers.entries()),
                        body: errorText
                    });
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('5. Raw API Response:', {
                    type: typeof data,
                    isArray: Array.isArray(data),
                    keys: Object.keys(data),
                    data: data
                });

                // Handle the response data
                let rulesData = [];
                if (Array.isArray(data)) {
                    console.log('6. Response is an array with length:', data.length);
                    rulesData = data;
                } else if (data && typeof data === 'object' && !Array.isArray(data)) {
                    console.log('6. Response is a single object, converting to array');
                    if (data.results && Array.isArray(data.results)) {
                        console.log('6a. Found results array in response');
                        rulesData = data.results;
                    } else if (data.data && Array.isArray(data.data)) {
                        console.log('6b. Found data array in response');
                        rulesData = data.data;
                    } else {
                        console.log('6c. Using response object as single item');
                        rulesData = [data];
                    }
                } else {
                    console.warn('6. Unexpected API response format:', data);
                }

                console.log('7. Processed rules data:', rulesData);

                // Helper function to capitalize state names
                const capitalizeState = (state: string) => {
                    if (!state || typeof state !== 'string') return 'N/A';
                    return state
                        .toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                };

                // Transform data to match our interface
                const formattedData = rulesData.map((item: any) => {
                    console.log('Raw creditor debt item:', item);

                    const formattedItem = {
                        id: item.id || Math.random().toString(36).substr(2, 9),
                        state: item.state ? capitalizeState(item.state) : 'N/A',
                        rule: item.rule || 'N/A',
                        deduction_basis: item.deduction_basis || 'N/A',
                        withholding_limit: item.withholding_limit || 'N/A',
                        withholding_limit_rule: item.withholding_limit_rule || 'N/A',
                        // Include original API fields for debugging
                        ...item
                    };

                    console.log('Formatted creditor debt item:', formattedItem);
                    return formattedItem;
                });

                console.log('8. Formatted rules data:', formattedData);

                // Update state
                console.log('9. Updating state...');
                setRules(formattedData);
                setInitialRecords(sortBy(formattedData, 'state'));
                setError(null);

                // Log after state updates
                setTimeout(() => {
                    console.log('10. State after updates:');
                    logState('after state updates');
                }, 0);

            } catch (err: any) {
                console.error('Error in fetchRules:', err);
                setError(err.message || 'Failed to fetch creditor debt rules');
            } finally {
                console.log('11. Setting loading to false');
                setLoading(false);
            }
        };

        console.log('0. Starting fetchRules...');
        fetchRules();
    }, []);

    // Handle pagination
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    // Handle search and pagination
    useEffect(() => {
        console.log('A. Running search/pagination effect');
        console.log('B. Current search term:', search);
        console.log('C. Current rules:', rules);

        const filteredRecords = rules.filter((item) => {
            if (!item) return false;

            const searchTerm = search.toLowerCase();
            return (
                (item.state?.toLowerCase() || '').includes(searchTerm) ||
                (item.rule?.toLowerCase() || '').includes(searchTerm) ||
                (item.deduction_basis?.toLowerCase() || '').includes(searchTerm) ||
                (item.withholding_limit?.toString().toLowerCase() || '').includes(searchTerm) ||
                (item.withholding_limit_rule?.toLowerCase() || '').includes(searchTerm)
            );
        });

        console.log('D. Filtered records:', filteredRecords);

        // Update initialRecords
        setInitialRecords(sortBy(filteredRecords, 'state'));

        // Update pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        const paginatedRecords = [...filteredRecords.slice(from, to)];

        console.log('E. Paginated records:', {
            page,
            pageSize,
            from,
            to,
            totalRecords: filteredRecords.length,
            paginatedRecords
        });

        setRecords(paginatedRecords);
    }, [search, rules, page, pageSize]);

    // Handle sorting
    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    // Export columns
    const exportColumns: ExportColumn[] = [
        { accessor: 'state', title: 'State' },
        { accessor: 'rule', title: 'Rule' },
        { accessor: 'deduction_basis', title: 'Deduction Basis' },
        { accessor: 'withholding_limit', title: 'Withholding Limit (%)' },
    ];

    const handleExport = (type: 'csv' | 'print') => {
        exportTable(type, exportColumns, records, 'creditor-debt-rules');
    };

    // Show loading state
    if (loading) {
        return (
            <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-600">Loading creditor debt rules...</span>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-500 text-lg mb-2">Error loading creditor debt rules</div>
                        <div className="text-gray-600">{error}</div>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="rules-table">
                <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex items-center gap-2">
                        {selectedRecords.length > 0 && (
                            <button type="button" className="btn btn-danger gap-2" onClick={deleteSelectedRecords}>
                                <IconTrashLines />
                                Delete Selected
                            </button>
                        )}
                        {/* Export Buttons */}
                        <button type="button" onClick={() => handleExport('csv')} className="btn btn-primary btn-sm m-1">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> CSV
                        </button>
                        <button type="button" onClick={() => handleExport('print')} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" /> PRINT
                        </button>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-auto"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className="whitespace-nowrap table-hover"
                        records={records}
                        columns={[
                            {
                                accessor: 'state',
                                title: 'State',
                                sortable: true,
                                render: ({ state }) => (
                                    <div className="font-semibold">{state}</div>
                                ),
                            },
                            {
                                accessor: 'rule',
                                title: 'Rule',
                                sortable: true,
                                render: ({ rule }) => (
                                    <div className="max-w-md">
                                        <div className="line-clamp-2" title={rule}>
                                            {rule}
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'deduction_basis',
                                title: 'Deduction Basis',
                                sortable: true,
                                render: ({ deduction_basis }) => (
                                    <div className="capitalize">
                                        {deduction_basis || 'N/A'}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'withholding_limit',
                                title: 'Withholding Limit (%)',
                                sortable: true,
                                render: ({ withholding_limit }) => (
                                    <div>
                                        {withholding_limit || 'N/A'}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                sortable: false,
                                textAlignment: 'center',
                                render: ({ id, state }) => {
                                    // States that should have highlighted eye button
                                    const highlightedStates = [
                                        "california",
                                        "hawaii",
                                        "massachusetts",
                                        "minnesota",
                                        "missouri",
                                        "nebraska",
                                        "nevada",
                                        "new york",
                                        "south dakota",
                                        "tennessee",
                                        "new jersey",
                                        "north dakota"
                                    ];

                                    const isHighlighted = highlightedStates.includes(state?.toLowerCase());

                                    return (
                                        <div className="flex gap-4 items-center w-max mx-auto">
                                            <button type="button" className="flex hover:text-info">
                                                <IconEdit className="w-4.5 h-4.5" />
                                            </button>
                                            <button
                                                type="button"
                                                className={`flex ${isHighlighted ? 'text-primary' : 'hover:text-primary'}`}
                                                title={isHighlighted ? 'Special state - Click to view details' : 'View details'}
                                            >
                                                <IconEye className={isHighlighted ? 'w-4.5 h-4.5' : ''} />
                                            </button>
                                            <button type="button" className="flex hover:text-danger">
                                                <IconTrashLines />
                                            </button>
                                        </div>
                                    );
                                },
                            },
                        ]}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={setPage}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={(size) => {
                            setPageSize(size);
                            setPage(1);
                        }}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        paginationText={({ from, to, totalRecords }) =>
                            `Showing ${from} to ${to} of ${totalRecords} entries`
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default CreditorDebt;
