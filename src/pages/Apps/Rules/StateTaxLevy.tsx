import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import React, { useState, useEffect } from 'react';
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
import StateTaxLevyViewPopup from '../Popup/StateTaxLevyViewPopup';

interface StateTaxLevyRule {
    id: number;
    state: string;
    deduction_basis: string;
    withholding_limit: string | number;
    withholding_limit_rule: string;
    created_at?: string;
    updated_at?: string;
}

interface ApiResponse<T> {
    success?: boolean;
    data?: T | T[];
    results?: T[];
    message?: string;
}

const StateTaxLevy = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('State Tax Levy Rules'));
    }, [dispatch]);

    const [rules, setRules] = useState<StateTaxLevyRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecords, setSelectedRecords] = useState<StateTaxLevyRule[]>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<StateTaxLevyRule[]>([]);
    const [records, setRecords] = useState<StateTaxLevyRule[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'state',
        direction: 'asc',
    });

    // State for view popup
    const [viewPopupOpen, setViewPopupOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<StateTaxLevyRule | null>(null);

    // Handle view button click
    const handleViewClick = (rule: StateTaxLevyRule) => {
        setSelectedRule(rule);
        setViewPopupOpen(true);
    };

    // Close view popup
    const closeViewPopup = () => {
        setViewPopupOpen(false);
        setSelectedRule(null);
    };

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
        console.group(`State at ${label}`);
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
                console.log('1. Starting to fetch rules...');
                setLoading(true);
                logState('after setLoading(true)');

                // Use apiService for API call
                console.log('2. Making API call via apiService...');
                const response = await apiService.getStateTaxLevyRules() as ApiResponse<StateTaxLevyRule>;
                console.log('3. API response data:', response);

                if (!response) {
                    throw new Error('No response received from API');
                }

                // Process the response data
                let rulesData: StateTaxLevyRule[] = [];

                if (Array.isArray(response)) {
                    // Handle case where the API returns an array directly
                    console.log('4. Response is an array with length:', response.length);
                    rulesData = response;
                } else if (response.results && Array.isArray(response.results)) {
                    // Handle case where data is in response.results
                    console.log('4. Found results array in response with length:', response.results.length);
                    rulesData = response.results;
                } else if (response.data) {
                    // Handle case where data is in response.data (could be array or single object)
                    if (Array.isArray(response.data)) {
                        console.log('4. Found data array in response with length:', response.data.length);
                        rulesData = response.data;
                    } else if (typeof response.data === 'object') {
                        console.log('4. Found single data object in response');
                        rulesData = [response.data];
                    }
                }

                if (rulesData.length === 0) {
                    console.warn('5. No valid data found in API response');
                } else {
                    console.log('5. Processed rules data count:', rulesData.length);
                }

                console.log('7. Processed rules data:', rulesData);

                // Helper function to capitalize state names consistently
                const capitalizeState = (state: string) => {
                    if (!state || typeof state !== 'string') return 'N/A';
                    // Handle special cases for state names with multiple words or special formatting
                    const specialCases: { [key: string]: string } = {
                        'dc': 'District of Columbia',
                        'districtofcolumbia': 'District of Columbia',
                        'newyork': 'New York',
                        'newjersey': 'New Jersey',
                        'newmexico': 'New Mexico',
                        'northcarolina': 'North Carolina',
                        'northdakota': 'North Dakota',
                        'southcarolina': 'South Carolina',
                        'southdakota': 'South Dakota',
                        'westvirginia': 'West Virginia',
                        'rhodeisland': 'Rhode Island',
                        'newhampshire': 'New Hampshire',
                    };

                    // Check for special cases first
                    const lowerState = state.toLowerCase().replace(/\s+/g, '');
                    if (specialCases[lowerState]) {
                        return specialCases[lowerState];
                    }

                    // Standard capitalization for other states
                    return state
                        .toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                };

                // Transform data to match our interface
                const formattedData = rulesData.map((item: any) => {
                    console.log('Raw state tax levy item:', item);

                    // Ensure state is always properly capitalized
                    const stateValue = item.state ? String(item.state).trim() : '';
                    const formattedState = stateValue ? capitalizeState(stateValue) : 'N/A';

                    const formattedItem = {
                        id: item.id || Math.random().toString(36).substr(2, 9),
                        state: formattedState,
                        deduction_basis: item.deduction_basis || 'N/A',
                        withholding_limit: item.withholding_limit || 'N/A',
                        withholding_limit_rule: item.withholding_limit_rule || 'N/A',
                        // Include original API fields for debugging
                        ...item
                    };

                    console.log('Formatted item:', formattedItem);
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
                setError(err.message || 'Failed to fetch state tax levy rules');
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
                (item.withholding_limit_rule?.toLowerCase() || '').includes(searchTerm) ||
                (item.deduction_basis?.toLowerCase() || '').includes(searchTerm) ||
                (item.withholding_limit?.toString().toLowerCase() || '').includes(searchTerm)
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
        { accessor: 'withholding_limit_rule', title: 'Withholding Rule' },
        { accessor: 'deduction_basis', title: 'Deduction Basis' },
        { accessor: 'withholding_limit', title: 'Withholding Limit (%)' },
    ];

    const handleExport = (type: 'csv' | 'print') => {
        exportTable(type, exportColumns, records, 'state-tax-levy-rules');
    };

    // Show loading state
    if (loading) {
        return (
            <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-600">Loading state tax levy rules...</span>
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
                        <div className="text-red-500 text-lg mb-2">Error loading state tax levy rules</div>
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
        <React.Fragment>
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
                                render: ({ state }) => {
                                    // Ensure state is properly capitalized in the UI
                                    const displayState = state ? state
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                        .join(' ') : 'N/A';
                                    return <div className="font-semibold">{displayState}</div>;
                                },
                            },
                            {
                                accessor: 'withholding_limit_rule',
                                title: 'Withholding Rule',
                                sortable: true,
                                render: ({ withholding_limit_rule }) => (
                                    <div className="max-w-md">
                                        <div className="line-clamp-2" title={withholding_limit_rule}>
                                            {withholding_limit_rule || 'N/A'}
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
                                render: (row: StateTaxLevyRule) => {
                                    // States that should have highlighted eye button
                                    const highlightedStates = [
                                        "alabama",
                                        "arkansas",
                                        "california",
                                        "connecticut",
                                        "delaware",
                                        "hawaii",
                                        "illinois",
                                        "kansas",
                                        "kentucky",
                                        "louisiana",
                                        "maryland",
                                        "michigan",
                                        "mississippi",
                                        "missouri",
                                        "montana",
                                        "nebraska",
                                        "nevada",
                                        "new hampshire",
                                        "new jersey",
                                        "north carolina",
                                        "ohio",
                                        "oklahoma",
                                        "oregon",
                                        "pennsylvania",
                                        "rhode island",
                                        "south carolina",
                                        "utah",
                                        "virginia",
                                        "washington",
                                        "wisconsin"
                                    ];

                                    const isHighlighted = highlightedStates.includes(row.state?.toLowerCase());

                                    return (
                                        <div className="flex gap-4 items-center w-max mx-auto">
                                            <button
                                                type="button"
                                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                                onClick={() => console.log('Edit:', row.id)}
                                                title="Edit"
                                            >
                                                <IconEdit className="w-5 h-5" />
                                            </button>
                                                                                        <button
                                                type="button"
                                                className={`transition-colors ${isHighlighted ? 'text-danger' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                                                onClick={() => handleViewClick(row)}
                                                title={isHighlighted ? 'Special state - Click to view details' : 'View details'}
                                            >
                                                <IconEye className={`w-5 h-5 ${isHighlighted ? 'w-5.5 h-5.5' : ''}`} />
                                            </button>
                                            <button
                                                type="button"
                                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                                title="Delete"
                                            >
                                                <IconTrashLines className="w-5 h-5" />
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

        {/* View Popup */}
        <StateTaxLevyViewPopup
            isOpen={viewPopupOpen}
            onClose={closeViewPopup}
            rule={selectedRule}
        />
        </React.Fragment>
    );
};

export default StateTaxLevy;
