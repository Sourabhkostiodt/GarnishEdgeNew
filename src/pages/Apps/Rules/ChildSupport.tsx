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
import IconLoader from '../../../components/Icon/IconLoader';
import IconXCircle from '../../../components/Icon/IconXCircle';
import IconInfoTriangle from '../../../components/Icon/IconInfoTriangle';
import apiService from '../../../contexts/ApiService';
import { exportTable, ExportColumn } from '../../../utils/exportUtils';

const ChildSupport = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Child Support Rules'));
    });

    const [items, setItems] = useState<any[]>([]);
    useEffect(() => {
        console.log('items updated:', items);
    }, [items]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // TODO: Update API endpoint for Child Support Rules
                const data: any = await apiService.getChildSupportRules();
                console.log('API Response:', data);
                const dataArray = Array.isArray(data) ? data : data?.data || [];
                setItems(dataArray);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Rest of the component logic from Order.tsx
    // ...

    return (
        <div>
            <div className="panel flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold">Child Support Rules</h2>
                <div className="flex items-center flex-wrap gap-2">
                    <button type="button" className="btn btn-primary">
                        <IconPlus className="ltr:mr-1.5 rtl:ml-1.5" />
                        Add Rule
                    </button>
                </div>
            </div>
            
            <div className="panel mt-5">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <IconLoader className="animate-spin text-primary text-4xl mb-4" />
                        <p className="text-lg font-medium text-gray-600">Loading Child Support Rules...</p>
                        <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest data</p>
                    </div>
                ) : error ? (
                    <div className="bg-danger-light/20 border border-danger/30 rounded-md p-4">
                        <div className="flex items-start">
                            <IconXCircle className="text-danger text-xl mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                                <h3 className="text-danger font-medium">Error Loading Data</h3>
                                <p className="text-gray-700 dark:text-gray-300 mt-1">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="btn btn-outline-danger mt-3"
                                >
                                    <IconLoader className="mr-1" /> Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <IconInfoTriangle className="text-warning text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">No Child Support Rules Found</h3>
                        <p className="text-gray-500 mt-1">Get started by adding your first rule</p>
                        <button className="btn btn-primary mt-4">
                            <IconPlus className="mr-1" /> Add Rule
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">{items.length}</span> rules
                            </div>
                            <div className="flex space-x-2">
                                <button className="btn btn-outline-primary btn-sm">
                                    <IconFile className="w-4 h-4 mr-1" />
                                    Export
                                </button>
                                <button className="btn btn-outline-primary btn-sm">
                                    <IconPrinter className="w-4 h-4 mr-1" />
                                    Print
                                </button>
                            </div>
                        </div>
                        {/* Table will go here */}
                        <div className="rounded-md border border-[#e0e6ed] dark:border-[#1b2e4b]">
                            <div className="p-4 text-center text-gray-500">
                                Child Support Rules table will be displayed here
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChildSupport;
