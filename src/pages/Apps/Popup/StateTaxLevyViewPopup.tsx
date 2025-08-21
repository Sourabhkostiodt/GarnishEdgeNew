import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import IconX from '../../../components/Icon/IconX';
import IconEdit from '../../../components/Icon/IconEdit';
import ExemptionConfigEditPopup from './ExemptionConfigEditPopup';
import apiService from '../../../contexts/ApiService';

interface ExemptionConfig {
    id: number;
    state: string;
    pay_period: string;
    minimum_hourly_wage_basis: string;
    minimum_wage_amount: string;
    multiplier_lt: string;
    condition_expression_lt: string;
    lower_threshold_amount: string;
    multiplier_ut: string;
    condition_expression_ut: string;
    upper_threshold_amount: string;
    created_at?: string;
    updated_at?: string;
}

interface StateTaxLevyRule {
    id: number;
    state: string;
    deduction_basis: string;
    withholding_limit: string | number;
    withholding_limit_rule: string;
    created_at?: string;
    updated_at?: string;
}

interface StateTaxLevyViewPopupProps {
    isOpen: boolean;
    onClose: () => void;
    rule: StateTaxLevyRule | null;
}

const StateTaxLevyViewPopup: React.FC<StateTaxLevyViewPopupProps> = ({ isOpen, onClose, rule: initialRule }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [exemptionConfigs, setExemptionConfigs] = useState<ExemptionConfig[]>([]);
    const [rule, setRule] = useState<StateTaxLevyRule | null>(initialRule);
    const [editingConfig, setEditingConfig] = useState<ExemptionConfig | null>(null);

    useEffect(() => {
        if (isOpen && initialRule) {
            setRule(initialRule);
            
            const fetchExemptionConfig = async () => {
                // Reset states before fetching new data
                setExemptionConfigs([]);
                setLoading(true);
                setError(null);
                
                try {
                    const response = await apiService.getStateTaxLevyExemptAmtConfig(initialRule.state) as { data: ExemptionConfig[] };
                    if (response?.data && Array.isArray(response.data)) {
                        setExemptionConfigs(response.data);
                    } else {
                        setExemptionConfigs([]);
                    }
                } catch (err) {
                    console.error('Error fetching exemption config:', err);
                    setError('Failed to load exemption configuration');
                    setExemptionConfigs([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchExemptionConfig();
        } else {
            // Clear data when popup is closed
            setExemptionConfigs([]);
            setLoading(false);
            setError(null);
        }
    }, [isOpen, initialRule?.state]);

    if (!rule) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">State Tax Levy Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                        >
                            <IconX className="h-6 w-6" />
                        </button>
                    </div>
                    
                    {/* <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">State</p>
                                <p className="mt-1 text-sm text-gray-900">{rule.state}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Deduction Basis</p>
                                <p className="mt-1 text-sm text-gray-900">{rule.deduction_basis}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Withholding Limit</p>
                                <p className="mt-1 text-sm text-gray-900">{rule.withholding_limit}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Withholding Limit Rule</p>
                                <p className="mt-1 text-sm text-gray-900">{rule.withholding_limit_rule}</p>
                            </div>
                        </div>
                        
                        {(rule.created_at || rule.updated_at) && (
                            <div className="pt-4 border-t border-gray-200 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rule.created_at && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Created At</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {new Date(rule.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                    {rule.updated_at && (
                                        <div>
                                            <p className="text-xs font-medium text-gray-500">Last Updated</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {new Date(rule.updated_at).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                    {/* Exemption Configuration Table */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium mb-4">Exemption Configuration {rule?.state?.toLowerCase()
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </h3>
                        
                        {loading ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 text-sm p-4">{error}</div>
                        ) : exemptionConfigs.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-lg">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4 className="mt-2 text-sm font-medium text-gray-900">No Data Available</h4>
                                <p className="mt-1 text-sm text-gray-500">No exemption configuration found for {rule?.state?.toUpperCase()} state.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Period</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wage Basis</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Wage</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Multiplier (LT)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition (LT)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lower Threshold</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Multiplier (UT)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition (UT)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upper Threshold</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {exemptionConfigs.map((config) => (
                                            <tr key={config.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {config.pay_period}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {config.minimum_hourly_wage_basis}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${parseFloat(config.minimum_wage_amount).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {parseFloat(config.multiplier_lt).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500">
                                                    <code className="text-xs bg-gray-100 p-1 rounded">
                                                        {config.condition_expression_lt}
                                                    </code>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                    ${parseFloat(config.lower_threshold_amount).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {parseFloat(config.multiplier_ut).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500">
                                                    <code className="text-xs bg-gray-100 p-1 rounded">
                                                        {config.condition_expression_ut}
                                                    </code>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                                    ${parseFloat(config.upper_threshold_amount).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                                                    {config.updated_at ? new Date(config.updated_at).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                    <button 
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        onClick={() => setEditingConfig(config)}
                                                        title="Edit"
                                                        disabled={loading}
                                                    >
                                                        <IconEdit className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Close
                        </button>
                    </div>
                </Dialog.Panel>
            </div>

            {/* Edit Exemption Config Popup */}
            {editingConfig && (
                <ExemptionConfigEditPopup
                    isOpen={!!editingConfig}
                    onClose={() => setEditingConfig(null)}
                    config={editingConfig}
                    onSave={async (updatedConfig) => {
                        try {
                            setSaving(true);
                            // Call API to update the exemption config
                            // Note: The API service method needs to be implemented in ApiService.ts
                            // await apiService.updateStateTaxLevyExemptAmtConfig(updatedConfig);
                            
                            // For now, we'll just update the local state
                            // TODO: Uncomment and implement the API call when the endpoint is ready
                            
                            // Update local state
                            setExemptionConfigs(prev => 
                                prev.map(config => 
                                    config.id === updatedConfig.id ? updatedConfig : config
                                )
                            );
                            
                            setEditingConfig(null);
                        } catch (error) {
                            console.error('Error updating exemption config:', error);
                            setError('Failed to update exemption configuration');
                        } finally {
                            setSaving(false);
                        }
                    }}
                />
            )}
        </Dialog>
    );
};

export default StateTaxLevyViewPopup;
