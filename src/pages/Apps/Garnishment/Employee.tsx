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
import { exportTable, handleDownloadExcel, ExportColumn } from '../../../utils/exportUtils';
import IconFile from '../../../components/Icon/IconFile';
import IconPrinter from '../../../components/Icon/IconPrinter';

const Employee = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Employee List'));
    });

    const [items, setItems] = useState<any[]>([]);
    useEffect(() => {
        console.log('items updated:', items);
    }, [items]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch employees data
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const data: any = await apiService.getEmployees();
                console.log('API Response:', data);
                const employeesArray = Array.isArray(data) ? data : data?.data || [];
                setItems(employeesArray);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching employees:', err);
                setError(err.message || 'Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
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

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return items.filter((item) => {
                return (
                    item.ee_id?.toLowerCase().includes(search.toLowerCase()) ||
                    item.case_id?.toLowerCase().includes(search.toLowerCase()) ||
                    item.social_security_number?.toLowerCase().includes(search.toLowerCase()) ||
                    item.age?.toString().includes(search.toLowerCase()) ||
                    item.gender?.toLowerCase().includes(search.toLowerCase()) ||
                    item.home_state?.toLowerCase().includes(search.toLowerCase()) ||
                    item.work_state?.toLowerCase().includes(search.toLowerCase()) ||
                    item.filing_status?.toLowerCase().includes(search.toLowerCase()) ||
                    item.marital_status?.toLowerCase().includes(search.toLowerCase()) ||
                    item.pay_period?.toLowerCase().includes(search.toLowerCase())
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
                    <span className="ml-2 text-gray-600">Loading employees...</span>
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
                        <div className="text-red-500 text-lg mb-2">Error loading employees</div>
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

    // Export columns (should match DataTable columns except actions)
    const exportColumns: ExportColumn[] = [
        { accessor: 'ee_id', title: 'Employee ID' },
        { accessor: 'case_id', title: 'Case ID' },
        { accessor: 'first_name', title: 'First Name' },
        { accessor: 'last_name', title: 'Last Name' },
        { accessor: 'gender', title: 'Gender' },
        { accessor: 'home_state', title: 'Home State' },
        { accessor: 'work_state', title: 'Work State' },
        { accessor: 'filing_status', title: 'Filing Status' },
        { accessor: 'marital_status', title: 'Marital Status' },
        { accessor: 'pay_period', title: 'Pay Period' },
        { accessor: 'garnishment_fees_status', title: 'Fees Status' },
    ];
    const handleExport = (type: 'csv' | 'print') => {
        exportTable(type, exportColumns, records, 'employee-list');
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
                        <Link to="/apps/employee/add" className="btn btn-primary gap-2">
                            <IconPlus />
                            Add Employee
                        </Link>
                        {/* Export Buttons */}
                        <button type="button" onClick={() => handleExport('csv')} className="btn btn-primary btn-sm m-1 ">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> CSV
                        </button>
                        <button type="button" onClick={() => handleExport('print')} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" /> PRINT
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
                        columns={[
                            {
                                accessor: 'ee_id',
                                title: 'Employee ID',
                                sortable: true,
                                render: ({ ee_id }) => (
                                    <div className="text-primary underline hover:no-underline font-semibold">{ee_id}</div>
                                ),
                            },
                            {
                                accessor: 'case_id',
                                title: 'Case ID',
                                sortable: true,
                            },
                            {
                                accessor: 'social_security_number',
                                title: 'SSN',
                                sortable: true,
                            },
                            {
                                accessor: 'age',
                                title: 'Age',
                                sortable: true,
                            },
                            {
                                accessor: 'gender',
                                title: 'Gender',
                                sortable: true,
                            },
                            {
                                accessor: 'home_state',
                                title: 'Home State',
                                sortable: true,
                            },
                            {
                                accessor: 'work_state',
                                title: 'Work State',
                                sortable: true,
                            },
                            {
                                accessor: 'filing_status',
                                title: 'Filing Status',
                                sortable: true,
                            },
                            {
                                accessor: 'marital_status',
                                title: 'Marital Status',
                                sortable: true,
                            },
                            {
                                accessor: 'pay_period',
                                title: 'Pay Period',
                                sortable: true,
                            },
                            {
                                accessor: 'garnishment_fees_status',
                                title: 'Fees Status',
                                sortable: true,
                                render: ({ garnishment_fees_status }) => (
                                    <span className={`badge badge-outline-${garnishment_fees_status ? 'success' : 'danger'}`}>
                                        {garnishment_fees_status ? 'Active' : 'Suspended'}
                                    </span>
                                ),
                            },
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlignment: 'center',
                                render: ({ id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <NavLink to={`/apps/employee/edit/${id}`} className="flex hover:text-info">
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </NavLink>
                                        <NavLink to={`/apps/employee/view/${id}`} className="flex hover:text-primary">
                                            <IconEye />
                                        </NavLink>
                                        <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(id)}>
                                            <IconTrashLines />
                                        </button>
                                    </div>
                                ),
                            },
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

export default Employee;
