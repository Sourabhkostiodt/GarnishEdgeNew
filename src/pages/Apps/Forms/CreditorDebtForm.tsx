import React from 'react';
import BaseGarnishmentForm, { GarnishmentFormData } from './BaseGarnishmentForm';

interface CreditorDebtFormProps {
  formData: GarnishmentFormData;
  onChange: (data: Partial<GarnishmentFormData>) => void;
  onSubmit: (data: GarnishmentFormData) => void;
  isSubmitting?: boolean;
}

const CreditorDebtForm: React.FC<CreditorDebtFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isSubmitting = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <BaseGarnishmentForm
      formData={formData}
      onChange={onChange}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      title="Creditor Debt Form"
    >
      {/* Creditor Debt Specific Fields */}
      <div className="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Creditor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="creditorName"
              value={formData.creditorName || ''}
              onChange={handleChange}
              className="form-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber || ''}
              onChange={handleChange}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Court Case Number
            </label>
            <input
              type="text"
              name="caseNumber"
              value={formData.caseNumber || ''}
              onChange={handleChange}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              State of Origin
            </label>
            <select
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              className="form-select w-full"
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              {/* Add all other states */}
              <option value="WY">Wyoming</option>
            </select>
          </div>
        </div>
      </div>
    </BaseGarnishmentForm>
  );
};

export default CreditorDebtForm;
