import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEdit from '../../../components/Icon/IconEdit';
import IconEye from '../../../components/Icon/IconEye';
import IconSearch from '../../../components/Icon/IconSearch';
import IconHorizontalDots from '../../../components/Icon/IconHorizontalDots';
import IconFile from '../../../components/Icon/IconFile';
import IconPrinter from '../../../components/Icon/IconPrinter';
import IconUser from '../../../components/Icon/IconUser';
import IconMapPin from '../../../components/Icon/IconMapPin';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconCreditCard from '../../../components/Icon/IconCreditCard';
import apiService from '../../../contexts/ApiService';
import { exportTable, handleDownloadExcel, ExportColumn } from '../../../utils/exportUtils';

const EmployeeCard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Employee Cards'));
    });

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Show 8 cards per page

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

    const deleteRow = (id: any) => {
        if (window.confirm('Are you sure want to delete this employee?')) {
            setItems(items.filter((user) => user.id !== id));
        }
    };

    // Filter items based on search
    const filteredItems = items.filter((item) => {
        return (
            item.ee_id?.toLowerCase().includes(search.toLowerCase()) ||
            item.case_id?.toLowerCase().includes(search.toLowerCase()) ||
            item.first_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.last_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.gender?.toLowerCase().includes(search.toLowerCase()) ||
            item.home_state?.toLowerCase().includes(search.toLowerCase()) ||
            item.work_state?.toLowerCase().includes(search.toLowerCase()) ||
            item.filing_status?.toLowerCase().includes(search.toLowerCase()) ||
            item.marital_status?.toLowerCase().includes(search.toLowerCase()) ||
            item.pay_period?.toLowerCase().includes(search.toLowerCase())
        );
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Export columns
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
        exportTable(type, exportColumns, filteredItems, 'employee-cards');
    };

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

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="employee-cards">
                {/* Header Controls */}
                <div className="mb-6 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <Link to="/apps/employee/add" className="btn btn-primary gap-2">
                            <IconPlus />
                            Add Employee
                        </Link>
                        {/* Export Buttons */}
                        <button type="button" onClick={() => handleExport('csv')} className="btn btn-outline-primary btn-sm">
                            <IconFile className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> Export CSV
                        </button>
                        <button type="button" onClick={() => handleExport('print')} className="btn btn-outline-primary btn-sm">
                            <IconPrinter className="w-4 h-4 ltr:mr-2 rtl:ml-2" /> Print
                        </button>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <div className="relative">
                            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                className="form-input pl-10 w-auto"
                                placeholder="Search employees..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="px-5 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} employees
                        </div>
                        <div className="flex items-center gap-2">
                            <IconHorizontalDots className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{filteredItems.length} results</span>
                        </div>
                    </div>
                </div>

                {/* Employee Cards Grid */}
                <div className="px-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentItems.map((employee) => (
                            <div
                                key={employee.id}
                                className="group relative bg-white dark:bg-[#1a1c23] rounded-xl border-2 border-gray-100 dark:border-gray-600 shadow-lg hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Card Header */}
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-700/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center shadow-sm">
                                                <IconUser className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                                    {employee.first_name} {employee.last_name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    ID: {employee.ee_id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Case ID
                                            </label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {employee.case_id || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Age
                                            </label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {employee.age || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            Gender
                                        </label>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {employee.gender || 'N/A'}
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                                            <IconMapPin className="w-3 h-3" />
                                            Location
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Home:</span>
                                                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                                    {employee.home_state || 'N/A'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Work:</span>
                                                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                                    {employee.work_state || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Info */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                                            <IconCreditCard className="w-3 h-3" />
                                            Status
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Filing:</span>
                                                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                                    {employee.filing_status || 'N/A'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Marital:</span>
                                                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                                                    {employee.marital_status || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pay Period */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1">
                                            <IconCalendar className="w-3 h-3" />
                                            Pay Period
                                        </label>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {employee.pay_period || 'N/A'}
                                        </p>
                                    </div>

                                    {/* Fees Status */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            Fees Status
                                        </label>
                                        <div className="mt-1">
                                            <span className={`badge badge-outline-${employee.garnishment_fees_status ? 'success' : 'danger'}`}>
                                                {employee.garnishment_fees_status ? 'Active' : 'Suspended'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center justify-center gap-2">
                                        <NavLink
                                            to={`/apps/employee/view/${employee.id}`}
                                            className="btn btn-sm btn-outline-info hover:bg-info hover:text-white transition-colors duration-200"
                                            title="View Details"
                                        >
                                            <IconEye className="w-4 h-4" />
                                        </NavLink>
                                        <NavLink
                                            to={`/apps/employee/edit/${employee.id}`}
                                            className="btn btn-sm btn-outline-primary hover:bg-primary hover:text-white transition-colors duration-200"
                                            title="Edit Employee"
                                        >
                                            <IconEdit className="w-4 h-4" />
                                        </NavLink>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger hover:bg-danger hover:text-white transition-colors duration-200"
                                            onClick={() => deleteRow(employee.id)}
                                            title="Delete Employee"
                                        >
                                            <IconTrashLines className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {currentItems.length === 0 && (
                    <div className="px-5 py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IconUser className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No employees found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            {search ? 'Try adjusting your search terms.' : 'Get started by adding your first employee.'}
                        </p>
                        {!search && (
                            <Link to="/apps/employee/add" className="btn btn-primary">
                                <IconPlus className="w-4 h-4 mr-2" />
                                Add Employee
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeCard;
