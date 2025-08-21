import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconEye from '../../../components/Icon/IconEye';
import IconFile from '../../../components/Icon/IconFile';
import IconPrinter from '../../../components/Icon/IconPrinter';
import { exportTable, ExportColumn } from '../../../utils/exportUtils';

interface FeeRule {
    id: number;
    state: string;
    pay_period: string;
    rule: string;
}

const FeeRule = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Fee Rules'));
    }, [dispatch]);

    const [rules, setRules] = useState<FeeRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecords, setSelectedRecords] = useState<FeeRule[]>([]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<FeeRule[]>([]);
    const [records, setRecords] = useState<FeeRule[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'state',
        direction: 'asc',
    });

    // Helper function to capitalize state names
    const capitalizeState = (state: string) => {
        if (!state || typeof state !== 'string') return 'N/A';
        return state
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Fetch fee rules data
    useEffect(() => {
        const fetchRules = async () => {
            try {
                console.log('1. Starting to fetch fee rules...');
                setLoading(true);
                
                console.log('2. Making API call to fee rules endpoint...');
                const response = await fetch('https://garnishment-backend-6lzi.onrender.com/User/GarnishmentFeesStatesRules/', {
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
                        body: errorText
                    });
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                console.log('5. Raw API Response:', result);
                
                // Handle the response data
                let rulesData: FeeRule[] = [];
                if (result.success && Array.isArray(result.data)) {
                    console.log('6. Found data array in response with length:', result.data.length);
                    rulesData = result.data;
                } else {
                    console.warn('6. Unexpected API response format:', result);
                }
                
                console.log('7. Processed rules data:', rulesData);
                
                // Transform data
                const formattedData = rulesData.map((item: any) => ({
                    id: item.id,
                    state: item.state ? capitalizeState(item.state) : 'N/A',
                    pay_period: item.pay_period || 'N/A',
                    rule: item.rule || 'N/A'
                }));
                
                console.log('8. Formatted rules data:', formattedData);
                
                // Update state
                setRules(formattedData);
                setInitialRecords(sortBy(formattedData, 'state'));
                setError(null);
                
            } catch (err: any) {
                console.error('Error in fetchRules:', err);
                setError(err.message || 'Failed to fetch fee rules');
            } finally {
                console.log('9. Setting loading to false');
                setLoading(false);
            }
        };

        fetchRules();
    }, []);

    // Handle search and pagination
    useEffect(() => {
        const filteredRecords = rules.filter((item) => {
            if (!item) return false;
            
            const searchTerm = search.toLowerCase();
            return (
                (item.state?.toLowerCase() || '').includes(searchTerm) ||
                (item.pay_period?.toLowerCase() || '').includes(searchTerm) ||
                (item.rule?.toLowerCase() || '').includes(searchTerm)
            );
        });
        
        // Update pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        const paginatedRecords = [...filteredRecords.slice(from, to)];
        
        setInitialRecords(sortBy(filteredRecords, sortStatus.columnAccessor));
        setRecords(sortStatus.direction === 'desc' ? paginatedRecords.reverse() : paginatedRecords);
    }, [search, rules, page, pageSize, sortStatus]);

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

    // Export function
    const handleExport = (type: 'csv' | 'print') => {
        const columns: ExportColumn[] = [
            { accessor: 'id', title: 'ID' },
            { accessor: 'state', title: 'State' },
            { accessor: 'pay_period', title: 'Pay Period' },
            { accessor: 'rule', title: 'Rule' },
        ];
        
        if (type === 'csv') {
            exportTable('csv', columns, rules, 'fee_rules');
        } else {
            // Use the print functionality from exportUtils
            exportTable('print', columns, rules, 'fee_rules');
        }
    };

    return (
        <div className="panel">
            <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                <div className="flex items-center flex-wrap">
                    <h5 className="font-semibold text-lg dark:text-white-light">Fee Rules</h5>
                    <div className="ml-4 flex items-center space-x-2">
                        <button type="button" className="btn btn-primary btn-sm">
                            <IconPlus className="w-4 h-4 mr-1" />
                            Add Rule
                        </button>
                        {selectedRecords.length > 0 && (
                            <button 
                                type="button" 
                                className="btn btn-outline-danger btn-sm"
                                onClick={deleteSelectedRecords}
                            >
                                <IconTrashLines className="w-4 h-4 mr-1" />
                                Delete Selected
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <div className="text-xs">Export:</div>
                        <button 
                            type="button" 
                            className="btn btn-primary btn-sm px-2 py-1" 
                            onClick={() => handleExport('csv')}
                        >
                            <IconFile className="w-4 h-4 mr-1" />
                            CSV
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary btn-sm px-2 py-1" 
                            onClick={() => handleExport('print')}
                        >
                            <IconPrinter className="w-4 h-4 mr-1" />
                            Print
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-xs">Show:</div>
                        <select
                            className="form-select form-select-sm w-20"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                        >
                            {PAGE_SIZES.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="datatables">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex-1 max-w-xs">
                        <input
                            type="text"
                            className="form-input w-full"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-danger p-4 border border-danger rounded mb-4">
                        Error: {error}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <DataTable
                            className="whitespace-nowrap table-hover"
                            records={records}
                            columns={[
                                {
                                    accessor: 'id',
                                    title: 'ID',
                                    sortable: true,
                                    render: ({ id }) => `#${id}`,
                                },
                                {
                                    accessor: 'state',
                                    title: 'State',
                                    sortable: true,
                                },
                                {
                                    accessor: 'pay_period',
                                    title: 'Pay Period',
                                    sortable: true,
                                },
                                {
                                    accessor: 'rule',
                                    title: 'Rule',
                                    sortable: true,
                                },
                                {
                                    accessor: 'actions',
                                    title: 'Actions',
                                    titleClassName: '!text-center',
                                    render: (record) => (
                                        <div className="flex items-center w-max mx-auto gap-2">
                                            <button 
                                                type="button" 
                                                className="btn btn-primary btn-sm p-1"
                                                onClick={() => console.log('View:', record)}
                                            >
                                                <IconEye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-primary btn-sm p-1"
                                                onClick={() => console.log('Edit:', record)}
                                            >
                                                <IconEdit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                            selectedRecords={selectedRecords}
                            onSelectedRecordsChange={setSelectedRecords}
                            totalRecords={initialRecords.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => 
                                `Showing ${from} to ${to} of ${totalRecords} entries`
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeeRule;
