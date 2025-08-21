import React from 'react';
import BaseGarnishmentForm, { type GarnishmentFormData } from './BaseGarnishmentForm';
import apiService from '../../../contexts/ApiService';
import { getCurrencyConfig } from '../../../utils/currencyUtils';
import { showSuccessMessage, showErrorMessage } from '../../../utils/notifications';

type PayPeriod = 'Weekly' | 'Bi-Weekly' | 'Semi-Monthly' | 'Monthly';

export interface ChildSupportFormData extends Omit<GarnishmentFormData, 'amountType' | 'amount'> {
  workState: string;
  payPeriod: PayPeriod;
  grossPay: number;
  totalMandatoryDeduction: number;
  numberOfExemptions: number;
  supportSecondFamily: boolean;
  arrearsGreaterThan12Weeks: boolean;
  orderedAmount: number;
  arrearAmount: number;
}

interface ChildSupportFormProps {
  formData: ChildSupportFormData;
  onChange: (data: Partial<ChildSupportFormData>) => void;
  onSubmit: (data: ChildSupportFormData) => void;
  isSubmitting?: boolean;
}

const ChildSupportForm: React.FC<ChildSupportFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isSubmitting = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleSubmit = async (data: GarnishmentFormData) => {
    try {
      // Create a new object with all required ChildSupportFormData fields
      const childSupportData: ChildSupportFormData = {
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        ssn: data.ssn,
        workState: formData.workState,
        payPeriod: formData.payPeriod,
        grossPay: formData.grossPay,
        totalMandatoryDeduction: formData.totalMandatoryDeduction,
        numberOfExemptions: formData.numberOfExemptions,
        supportSecondFamily: formData.supportSecondFamily,
        arrearsGreaterThan12Weeks: formData.arrearsGreaterThan12Weeks,
        orderedAmount: formData.orderedAmount,
        arrearAmount: formData.arrearAmount
      };

      // Call the garnishment calculation API
      const calculationResult = await apiService.calculateGarnishment({
        type: 'child_support',
        data: childSupportData
      });

      showSuccessMessage('Child support calculation completed successfully!');

      // Pass both the form data and calculation result to the parent component
      onSubmit(childSupportData);

      // You can also handle the calculation result here if needed
      console.log('Calculation result:', calculationResult);

    } catch (error: any) {
      console.error('Child support calculation failed:', error);
      showErrorMessage(error.message || 'Failed to calculate child support');
    }
  };

  // Create a base form data object that matches the expected type
  const baseFormData: GarnishmentFormData = {
    ...formData
  };

  return (
    <BaseGarnishmentForm
      formData={baseFormData}
      onChange={onChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      title="Child Support Calculation"
    >
      <div className="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Work State Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Work State <span className="text-red-500">*</span>
            </label>
            <select
              name="workState"
              value={formData.workState || ''}
              onChange={handleChange}
              className="form-select w-full"
              required
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              {/* Add all other states */}
              <option value="WY">Wyoming</option>
            </select>
          </div>

          {/* Pay Period Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Pay Period <span className="text-red-500">*</span>
            </label>
            <select
              name="payPeriod"
              value={formData.payPeriod || ''}
              onChange={handleChange}
              className="form-select w-full"
              required
            >
              <option value="">Select Pay Period</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Semi-Monthly">Semi-Monthly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {/* Gross Pay */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Gross Pay <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{getCurrencyConfig().symbol}</span>
              </div>
              <input
                type="number"
                name="grossPay"
                min="0.01"
                step="0.01"
                value={formData.grossPay || ''}
                onChange={handleChange}
                className="form-input w-full pl-7"
                placeholder={`0.00`}
                required
              />
            </div>
          </div>

          {/* Total Mandatory Deduction */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Total Mandatory Deduction <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{getCurrencyConfig().symbol}</span>
              </div>
              <input
                type="number"
                name="totalMandatoryDeduction"
                min="0"
                step="0.01"
                value={formData.totalMandatoryDeduction || ''}
                onChange={handleChange}
                className="form-input w-full pl-7"
                placeholder={`0.00`}
                required
              />
            </div>
          </div>

          {/* Number of Exemptions */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Exemptions (Including Self) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="numberOfExemptions"
              min="1"
              value={formData.numberOfExemptions || ''}
              onChange={handleChange}
              className="form-input w-full"
              required
            />
          </div>

          {/* Support Second Family Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Support Second Family <span className="text-red-500">*</span>
            </label>
            <select
              name="supportSecondFamily"
              value={formData.supportSecondFamily?.toString() || ''}
              onChange={(e) => onChange({ supportSecondFamily: e.target.value === 'true' })}
              className="form-select w-full"
              required
            >
              <option value="">Select Option</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Arrears Greater Than 12 Weeks Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Arrears Greater Than 12 Weeks <span className="text-red-500">*</span>
            </label>
            <select
              name="arrearsGreaterThan12Weeks"
              value={formData.arrearsGreaterThan12Weeks?.toString() || ''}
              onChange={(e) => onChange({ arrearsGreaterThan12Weeks: e.target.value === 'true' })}
              className="form-select w-full"
              required
            >
              <option value="">Select Option</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Ordered Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ordered Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{getCurrencyConfig().symbol}</span>
              </div>
              <input
                type="number"
                name="orderedAmount"
                min="0.01"
                step="0.01"
                value={formData.orderedAmount || ''}
                onChange={handleChange}
                className="form-input w-full pl-7"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Arrear Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Arrear Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{getCurrencyConfig().symbol}</span>
              </div>
              <input
                type="number"
                name="arrearAmount"
                min="0"
                step="0.01"
                value={formData.arrearAmount || ''}
                onChange={handleChange}
                className="form-input w-full pl-7"
                placeholder="0.00"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </BaseGarnishmentForm>
  );
};

export default ChildSupportForm;
