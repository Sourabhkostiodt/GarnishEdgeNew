import React from 'react';
import { Dialog } from '@headlessui/react';
import IconX from '../../../components/Icon/IconX';
import IconSave from '../../../components/Icon/IconSave';
import IconLoader from '../../../components/Icon/IconLoader';

type WageBasis = 'FEDERAL_MINIMUM_WAGE' | 'STATE_MINIMUM_WAGE';

export interface ExemptionConfig {
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
}

interface ExemptionConfigEditPopupProps {
    isOpen: boolean;
    onClose: () => void;
    config: ExemptionConfig | null;
    onSave: (updatedConfig: ExemptionConfig) => Promise<void>;
}

const ExemptionConfigEditPopup: React.FC<ExemptionConfigEditPopupProps> = ({
    isOpen,
    onClose,
    config,
    onSave,
}) => {
    const [isSaving, setIsSaving] = React.useState(false);
    const [formData, setFormData] = React.useState<ExemptionConfig>({
        id: 0,
        state: '',
        pay_period: '',
        minimum_hourly_wage_basis: 'FEDERAL_MINIMUM_WAGE', // Default value
        minimum_wage_amount: '',
        multiplier_lt: '',
        condition_expression_lt: '',
        lower_threshold_amount: '',
        multiplier_ut: '',
        condition_expression_ut: '',
        upper_threshold_amount: '',
    });

    React.useEffect(() => {
        if (config) {
            // Normalize the wage basis value to match our expected format
            let normalizedWageBasis = 'FEDERAL_MINIMUM_WAGE';
            if (config.minimum_hourly_wage_basis) {
                // Handle both 'STATE MINIMUM WAGE' and 'STATE_MINIMUM_WAGE' formats
                const basis = config.minimum_hourly_wage_basis.trim().toUpperCase();
                normalizedWageBasis = basis.includes('STATE') 
                    ? 'STATE_MINIMUM_WAGE' 
                    : 'FEDERAL_MINIMUM_WAGE';
            }
                
            console.log('Setting form data with wage basis:', normalizedWageBasis);
            
            setFormData(prev => ({
                ...prev,
                ...config,
                minimum_hourly_wage_basis: normalizedWageBasis
            }));
        }
    }, [config]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        
        try {
            setIsSaving(true);
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving exemption config:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!config) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                            Edit Exemption Configuration - {config.state}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                            disabled={isSaving}
                        >
                            <IconX className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="form-label">Pay Period</label>
                                <input
                                    type="text"
                                    value={formData.pay_period}
                                    className="form-input bg-gray-100"
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">Pay period is determined by the system</p>
                            </div>

                            <div>
                                <label className="form-label">Minimum Wage Basis</label>
                                <select
                                    name="minimum_hourly_wage_basis"
                                    value={formData.minimum_hourly_wage_basis}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                    disabled={isSaving}
                                >
                                    <option value="FEDERAL_MINIMUM_WAGE">Federal Minimum Wage</option>
                                    <option value="STATE_MINIMUM_WAGE">State Minimum Wage</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Minimum Wage Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2">$</span>
                                    <input
                                        type="number"
                                        name="minimum_wage_amount"
                                        value={formData.minimum_wage_amount}
                                        onChange={handleChange}
                                        className="form-input pl-8"
                                        step="0.01"
                                        required
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Lower Threshold Multiplier</label>
                                <input
                                    type="number"
                                    name="multiplier_lt"
                                    value={formData.multiplier_lt}
                                    onChange={handleChange}
                                    className="form-input"
                                    step="0.01"
                                    required
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <label className="form-label">Lower Threshold Condition</label>
                                <input
                                    type="text"
                                    name="condition_expression_lt"
                                    value={formData.condition_expression_lt}
                                    onChange={handleChange}
                                    className="form-input font-mono text-sm"
                                    required
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <label className="form-label">Lower Threshold Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2">$</span>
                                    <input
                                        type="number"
                                        name="lower_threshold_amount"
                                        value={formData.lower_threshold_amount}
                                        onChange={handleChange}
                                        className="form-input pl-8"
                                        step="0.01"
                                        required
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Upper Threshold Multiplier</label>
                                <input
                                    type="number"
                                    name="multiplier_ut"
                                    value={formData.multiplier_ut}
                                    onChange={handleChange}
                                    className="form-input"
                                    step="0.01"
                                    required
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <label className="form-label">Upper Threshold Condition</label>
                                <input
                                    type="text"
                                    name="condition_expression_ut"
                                    value={formData.condition_expression_ut}
                                    onChange={handleChange}
                                    className="form-input font-mono text-sm"
                                    required
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <label className="form-label">Upper Threshold Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2">$</span>
                                    <input
                                        type="number"
                                        name="upper_threshold_amount"
                                        value={formData.upper_threshold_amount}
                                        onChange={handleChange}
                                        className="form-input pl-8"
                                        step="0.01"
                                        required
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-outline-danger"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <IconLoader className="animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <IconSave className="mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ExemptionConfigEditPopup;
