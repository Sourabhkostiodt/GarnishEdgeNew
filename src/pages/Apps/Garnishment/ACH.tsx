import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconFile from '../../../components/Icon/IconFile';
import IconDownload from '../../../components/Icon/IconDownload';
import IconEye from '../../../components/Icon/IconEye';
import IconTrash from '../../../components/Icon/IconTrash';
import IconPencil from '../../../components/Icon/IconPencil';
import IconPlus from '../../../components/Icon/IconPlus';
import IconSearch from '../../../components/Icon/IconSearch';
import IconRefresh from '../../../components/Icon/IconRefresh';
import { DataTable } from 'mantine-datatable';

const ACH = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('ACH Processing'));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<any>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    // Sample ACH data
    const [recordsData, setRecordsData] = useState([
        {
            id: 1,
            transactionId: 'ACH-2024-001',
            accountNumber: '****1234',
            routingNumber: '021000021',
            amount: 1250.00,
            type: 'Credit',
            status: 'Completed',
            date: '2024-01-15',
            description: 'Payroll Deposit',
            bankName: 'Chase Bank',
            batchId: 'BATCH-001',
            processingTime: '2 hours',
        },
        {
            id: 2,
            transactionId: 'ACH-2024-002',
            accountNumber: '****5678',
            routingNumber: '121000248',
            amount: 850.75,
            type: 'Debit',
            status: 'Pending',
            date: '2024-01-16',
            description: 'Utility Payment',
            bankName: 'Wells Fargo',
            batchId: 'BATCH-002',
            processingTime: '1 hour',
        },
        {
            id: 3,
            transactionId: 'ACH-2024-003',
            accountNumber: '****9012',
            routingNumber: '071000013',
            amount: 2200.50,
            type: 'Credit',
            status: 'Failed',
            date: '2024-01-17',
            description: 'Vendor Payment',
            bankName: 'Bank of America',
            batchId: 'BATCH-003',
            processingTime: '3 hours',
        },
        {
            id: 4,
            transactionId: 'ACH-2024-004',
            accountNumber: '****3456',
            routingNumber: '021000021',
            amount: 675.25,
            type: 'Debit',
            status: 'Completed',
            date: '2024-01-18',
            description: 'Insurance Premium',
            bankName: 'Chase Bank',
            batchId: 'BATCH-004',
            processingTime: '1.5 hours',
        },
        {
            id: 5,
            transactionId: 'ACH-2024-005',
            accountNumber: '****7890',
            routingNumber: '121000248',
            amount: 1500.00,
            type: 'Credit',
            status: 'Processing',
            date: '2024-01-19',
            description: 'Tax Refund',
            bankName: 'Wells Fargo',
            batchId: 'BATCH-005',
            processingTime: '2.5 hours',
        },
    ]);

    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [initialRecords, setInitialRecords] = useState(recordsData);
    const [records, setRecords] = useState(initialRecords);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(initialRecords.slice(from, to));
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        if (initialRecords) {
            const filteredRecords = initialRecords.filter((item: any) => {
                return (
                    item.transactionId.toLowerCase().includes(search.toLowerCase()) ||
                    item.accountNumber.toLowerCase().includes(search.toLowerCase()) ||
                    item.routingNumber.toLowerCase().includes(search.toLowerCase()) ||
                    item.type.toLowerCase().includes(search.toLowerCase()) ||
                    item.status.toLowerCase().includes(search.toLowerCase()) ||
                    item.description.toLowerCase().includes(search.toLowerCase()) ||
                    item.bankName.toLowerCase().includes(search.toLowerCase()) ||
                    item.batchId.toLowerCase().includes(search.toLowerCase())
                );
            });
            setRecords(filteredRecords);
        }
    }, [search, initialRecords]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'processing':
                return 'info';
            case 'failed':
                return 'danger';
            default:
                return 'primary';
        }
    };

    const getTypeColor = (type: string) => {
        return type.toLowerCase() === 'credit' ? 'success' : 'danger';
    };

    const columns = [
        {
            accessor: 'transactionId',
            title: 'Transaction ID',
            sortable: true,
            render: ({ transactionId }: any) => <span className="font-semibold">{transactionId}</span>,
        },
        {
            accessor: 'accountNumber',
            title: 'Account Number',
            sortable: true,
            render: ({ accountNumber }: any) => <span className="font-mono">{accountNumber}</span>,
        },
        {
            accessor: 'routingNumber',
            title: 'Routing Number',
            sortable: true,
            render: ({ routingNumber }: any) => <span className="font-mono">{routingNumber}</span>,
        },
        {
            accessor: 'amount',
            title: 'Amount',
            sortable: true,
            render: ({ amount }: any) => <span className="font-semibold">{formatCurrency(amount)}</span>,
        },
        {
            accessor: 'type',
            title: 'Type',
            sortable: true,
            render: ({ type }: any) => (
                <span className={`badge badge-outline-${getTypeColor(type)}`}>
                    {type}
                </span>
            ),
        },
        {
            accessor: 'status',
            title: 'Status',
            sortable: true,
            render: ({ status }: any) => (
                <span className={`badge badge-outline-${getStatusColor(status)}`}>
                    {status}
                </span>
            ),
        },
        {
            accessor: 'date',
            title: 'Date',
            sortable: true,
            render: ({ date }: any) => <span>{new Date(date).toLocaleDateString()}</span>,
        },
        {
            accessor: 'description',
            title: 'Description',
            sortable: true,
        },
        {
            accessor: 'bankName',
            title: 'Bank',
            sortable: true,
        },
        {
            accessor: 'batchId',
            title: 'Batch ID',
            sortable: true,
            render: ({ batchId }: any) => <span className="font-mono text-xs">{batchId}</span>,
        },
        {
            accessor: 'processingTime',
            title: 'Processing Time',
            sortable: true,
        },
        {
            accessor: 'actions',
            title: 'Actions',
            titleClassName: '!text-center',
            render: ({ id }: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary">
                        <IconEye className="w-4 h-4" />
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-info">
                        <IconPencil className="w-4 h-4" />
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger">
                        <IconTrash className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="panel mt-6">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">ACH Processing</h5>
                    <div className="flex items-center gap-2">
                        <button type="button" className="btn btn-primary btn-sm">
                            <IconPlus className="w-4 h-4 mr-2" />
                            New ACH Transaction
                        </button>
                        <button type="button" className="btn btn-outline-primary btn-sm">
                            <IconDownload className="w-4 h-4 mr-2" />
                            Export
                        </button>
                    </div>
                </div>

                {/* ACH Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h6 className="text-white-light">Total Transactions</h6>
                                <p className="text-2xl font-bold">{recordsData.length}</p>
                            </div>
                            <IconFile className="w-8 h-8 text-white-light" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h6 className="text-white-light">Completed</h6>
                                <p className="text-2xl font-bold">
                                    {recordsData.filter(item => item.status === 'Completed').length}
                                </p>
                            </div>
                            <IconFile className="w-8 h-8 text-white-light" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h6 className="text-white-light">Pending</h6>
                                <p className="text-2xl font-bold">
                                    {recordsData.filter(item => item.status === 'Pending').length}
                                </p>
                            </div>
                            <IconFile className="w-8 h-8 text-white-light" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h6 className="text-white-light">Failed</h6>
                                <p className="text-2xl font-bold">
                                    {recordsData.filter(item => item.status === 'Failed').length}
                                </p>
                            </div>
                            <IconFile className="w-8 h-8 text-white-light" />
                        </div>
                    </div>
                </div>

                {/* ACH Information */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h6 className="font-semibold mb-3">About ACH (Automated Clearing House)</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="mb-2">
                                <strong>What is ACH?</strong> The Automated Clearing House (ACH) is an electronic funds-transfer system
                                that facilitates payments in the United States. It processes large volumes of credit and debit transactions
                                in batches.
                            </p>
                            <p className="mb-2">
                                <strong>Processing Times:</strong> ACH transactions typically take 1-3 business days to complete,
                                depending on the type of transaction and the financial institutions involved.
                            </p>
                        </div>
                        <div>
                            <p className="mb-2">
                                <strong>Common Uses:</strong> ACH is used for direct deposits, bill payments, business-to-business payments,
                                and recurring transactions like subscriptions and loan payments.
                            </p>
                            <p className="mb-2">
                                <strong>Security:</strong> ACH transactions are secure and regulated by the National Automated Clearing
                                House Association (NACHA) and federal banking regulations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <IconSearch className="w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="form-input w-auto"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button type="button" className="btn btn-outline-primary btn-sm">
                            <IconSearch className="w-4 h-4 mr-2" />
                            Advanced Search
                        </button>
                        <button type="button" className="btn btn-outline-secondary btn-sm">
                            <IconRefresh className="w-4 h-4 mr-2" />
                            Refresh
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Show:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="form-select w-auto"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="text-sm">entries</span>
                    </div>
                </div>

                {/* DataTable */}
                <div className="datatables">
                    <DataTable
                        noRecordsText="No ACH transactions found"
                        highlightOnHover
                        className="table-hover whitespace-nowrap"
                        records={records}
                        columns={columns}
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

const PAGE_SIZES = [10, 25, 50, 100];

export default ACH;
