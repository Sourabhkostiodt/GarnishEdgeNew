import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconEye from '../../../components/Icon/IconEye';
import apiService from '../../../contexts/ApiService';
import { exportTable, ExportColumn } from '../../../utils/exportUtils';
import IconFile from '../../../components/Icon/IconFile';
import IconPrinter from '../../../components/Icon/IconPrinter';
import { getCurrencyConfig } from '../../../utils/currencyUtils';

const Order = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Garnishment Orders'));
    });

    const [items, setItems] = useState<any[]>([]);
    useEffect(() => {
        console.log('items updated:', items);
    }, [items]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch order details data
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data: any = await apiService.getOrderDetails();
                console.log('API Response:', data);
                const ordersArray = Array.isArray(data) ? data : data?.data || [];
                console.log('Orders data structure:', ordersArray.length > 0 ? Object.keys(ordersArray[0]) : 'No data');
                console.log('First order record:', ordersArray[0]);
                setItems(ordersArray);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching orders:', err);
                setError(err.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const deleteRow = (id: any = null) => {
        if (window.confirm('Are you sure want to delete selected row ?')) {
            if (id) {
                setRecords(items.filter((user) => user.id !== id));
                setInitialRecords(items.filter((user) => user.id !== id));
                setItems(items.filter((user) => user.id !== id));
                setSearch('');
                setSelectedRecords([]);
            } else {
                let selectedRows = selectedRecords || [];
                const ids = selectedRows.map((d: any) => {
                    return d.id;
                });
                const result = items.filter((d) => !ids.includes(d.id as never));
                setRecords(result);
                setInitialRecords(result);
                setItems(result);
                setSearch('');
                setSelectedRecords([]);
                setPage(1);
            }
        }
    };

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(items, 'invoice'));
    useEffect(() => {
        console.log('initialRecords updated:', initialRecords);
    }, [initialRecords]);
    const [records, setRecords] = useState(initialRecords);
    useEffect(() => {
        console.log('records updated:', records);
    }, [records]);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [showAllFields, setShowAllFields] = useState(false);
    const [currencyConfig, setCurrencyConfig] = useState(getCurrencyConfig());

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [pageSize]);

    // Listen for currency changes
    useEffect(() => {
        const handleCurrencyChange = () => {
            setCurrencyConfig(getCurrencyConfig());
        };

        window.addEventListener('currencyChanged', handleCurrencyChange);
        window.addEventListener('storage', (e) => {
            if (e.key === 'currencySymbol' || e.key === 'globalCurrency' || e.key === 'currencyPosition' || e.key === 'decimalPlaces' || e.key === 'thousandsSeparator' || e.key === 'decimalSeparator') {
                handleCurrencyChange();
            }
        });

        return () => {
            window.removeEventListener('currencyChanged', handleCurrencyChange);
        };
    }, []);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return items.filter((item) => {
                return (
                    item.eeid?.toLowerCase().includes(search.toLowerCase()) ||
                    item.fein?.toLowerCase().includes(search.toLowerCase()) ||
                    item.case_id?.toLowerCase().includes(search.toLowerCase()) ||
                    item.work_state?.toLowerCase().includes(search.toLowerCase()) ||
                    item.type?.toLowerCase().includes(search.toLowerCase()) ||
                    item.sdu?.toLowerCase().includes(search.toLowerCase()) ||
                    item.start_date?.toLowerCase().includes(search.toLowerCase()) ||
                    item.end_date?.toLowerCase().includes(search.toLowerCase()) ||
                    item.amount?.toString().includes(search.toLowerCase()) ||
                    item.arrear_amount?.toString().includes(search.toLowerCase()) ||
                    item.record_updated?.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [items, search]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);

    // Show loading state
    if (loading) {
        return (
            <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-600">Loading orders...</span>
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
                        <div className="text-red-500 text-lg mb-2">Error loading orders</div>
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

    // Dynamically generate export columns from the first record in records
    const exportColumns: ExportColumn[] = records[0]
        ? Object.keys(records[0])
            .filter(key => key !== 'actions') // Exclude actions or UI-only fields if present
            .map(key => ({
                accessor: key,
                title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            }))
        : [];

        // Helper function to format currency values
    const formatCurrency = (value: string | number) => {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numericValue)) return '0.00';

        const formattedNumber = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: currencyConfig.decimalPlaces,
            maximumFractionDigits: currencyConfig.decimalPlaces,
            useGrouping: true
        });

        let result = formattedNumber
            .replace(/,/g, currencyConfig.thousandsSeparator)
            .replace(/\./g, currencyConfig.decimalSeparator);

        if (currencyConfig.position === 'before') {
            result = `${currencyConfig.symbol}${result}`;
        } else {
            result = `${result}${currencyConfig.symbol}`;
        }

        return result;
    };

    // Generate dynamic columns for all available fields
    const generateDynamicColumns = () => {
        if (!records || records.length === 0) return [];

        return Object.keys(records[0])
            .filter(key => !['id', 'action', 'actions'].includes(key))
            .map(key => ({
                accessor: key,
                title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                sortable: true,
                render: (record: any) => {
                    const value = record[key];
                    if (typeof value === 'boolean') {
                        return (
                            <span className={`badge badge-outline-${value ? 'success' : 'danger'}`}>
                                {value ? 'Yes' : 'No'}
                            </span>
                        );
                    }
                    if (typeof value === 'number' && (key.includes('amount') || key.includes('pay'))) {
                        return <span className="font-semibold">{formatCurrency(value)}</span>;
                    }
                    if (typeof value === 'string' && (key.includes('amount') || key.includes('pay'))) {
                        return <span className="font-semibold">{formatCurrency(value)}</span>;
                    }
                    if (key.includes('date')) {
                        return <span>{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>;
                    }
                    return <span>{value || 'N/A'}</span>;
                }
            }));
    };
    const handleExport = (type: 'csv' | 'print') => {
        exportTable(type, exportColumns, records, 'order-list');
    };

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="employee-table">
                <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <button type="button" className="btn btn-danger gap-2" onClick={() => deleteRow()}>
                            <IconTrashLines />
                            Delete Selected
                        </button>
                        <Link to="/apps/garnishment/order/add" className="btn btn-primary gap-2">
                            <IconPlus />
                            Add Order
                        </Link>
                        {/* Export Buttons */}
                        <button type="button" onClick={() => handleExport('csv')} className="btn btn-primary btn-sm m-1 ">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> CSV
                        </button>
                        <button type="button" onClick={() => handleExport('print')} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" /> PRINT
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAllFields(!showAllFields)}
                            className={`btn btn-sm m-1 ${showAllFields ? 'btn-success' : 'btn-outline-success'}`}
                        >
                            {showAllFields ? 'Show Standard Fields' : 'Show All Fields'}
                        </button>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className="whitespace-nowrap table-hover employee-table"
                        records={records}
                        columns={showAllFields ? [
                            ...generateDynamicColumns(),
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlignment: 'center',
                                render: (record: any) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <NavLink to={`/apps/employee/edit/${record.id}`} className="flex hover:text-info">
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </NavLink>
                                        <NavLink to={`/apps/employee/view/${record.id}`} className="flex hover:text-primary">
                                            <IconEye />
                                        </NavLink>
                                        <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(record.id)}>
                                            <IconTrashLines />
                                        </button>
                                    </div>
                                ),
                            }
                        ] : [
                            {
                                accessor: 'eeid',
                                title: 'Employee ID',
                                sortable: true,
                                render: (record: any) => (
                                    <div className="text-primary underline hover:no-underline font-semibold">{record.eeid}</div>
                                ),
                            },
                            {
                                accessor: 'fein',
                                title: 'FEIN',
                                sortable: true,
                                render: (record: any) => (
                                    <span>{record.fein === 'nan' ? 'N/A' : record.fein}</span>
                                ),
                            },
                            {
                                accessor: 'case_id',
                                title: 'Case ID',
                                sortable: true,
                            },
                            {
                                accessor: 'work_state',
                                title: 'Work State',
                                sortable: true,
                            },
                            {
                                accessor: 'type',
                                title: 'Garnishment Type',
                                sortable: true,
                                render: (record: any) => (
                                    <span className="badge badge-outline-primary">{record.type}</span>
                                ),
                            },
                            {
                                accessor: 'sdu',
                                title: 'SDU',
                                sortable: true,
                            },
                            {
                                accessor: 'start_date',
                                title: 'Start Date',
                                sortable: true,
                                render: (record: any) => (
                                    <span>{record.start_date ? new Date(record.start_date).toLocaleDateString() : 'N/A'}</span>
                                ),
                            },
                            {
                                accessor: 'end_date',
                                title: 'End Date',
                                sortable: true,
                                render: (record: any) => (
                                    <span>{record.end_date ? new Date(record.end_date).toLocaleDateString() : 'N/A'}</span>
                                ),
                            },
                            {
                                accessor: 'amount',
                                title: 'Amount',
                                sortable: true,
                                render: (record: any) => (
                                    <span className="font-semibold text-danger">{formatCurrency(record.amount)}</span>
                                ),
                            },
                            {
                                accessor: 'arrear_greater_than_12_weeks',
                                title: 'Arrear > 12 Weeks',
                                sortable: true,
                                render: (record: any) => (
                                    <span className={`badge badge-outline-${record.arrear_greater_than_12_weeks ? 'danger' : 'success'}`}>
                                        {record.arrear_greater_than_12_weeks ? 'Yes' : 'No'}
                                    </span>
                                ),
                            },
                            {
                                accessor: 'arrear_amount',
                                title: 'Arrear Amount',
                                sortable: true,
                                render: (record: any) => (
                                    <span className="font-semibold">{formatCurrency(record.arrear_amount)}</span>
                                ),
                            },
                            {
                                accessor: 'record_updated',
                                title: 'Last Updated',
                                sortable: true,
                                render: (record: any) => (
                                    <span>{record.record_updated ? new Date(record.record_updated).toLocaleString() : 'N/A'}</span>
                                ),
                            },
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlignment: 'center',
                                render: (record: any) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <NavLink to={`/apps/employee/edit/${record.id}`} className="flex hover:text-info">
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </NavLink>
                                        <NavLink to={`/apps/employee/view/${record.id}`} className="flex hover:text-primary">
                                            <IconEye />
                                        </NavLink>
                                        <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(record.id)}>
                                            <IconTrashLines />
                                        </button>
                                    </div>
                                ),
                            }
                        ]}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default Order;
