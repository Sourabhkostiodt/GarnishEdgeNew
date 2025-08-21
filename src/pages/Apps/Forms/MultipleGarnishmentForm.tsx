import React, { useState } from 'react';
import BaseGarnishmentForm, { GarnishmentFormData } from './BaseGarnishmentForm';
import { getCurrencyConfig } from '../../../utils/currencyUtils';

interface MultipleGarnishmentFormProps {
  formData: GarnishmentFormData;
  onChange: (data: Partial<GarnishmentFormData>) => void;
  onSubmit: (data: GarnishmentFormData) => void;
  isSubmitting?: boolean;
}

const MultipleGarnishmentForm: React.FC<MultipleGarnishmentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isSubmitting = false,
}) => {
  const [garnishments, setGarnishments] = useState<Array<{
    type: string;
    amount: string | number;
    caseNumber?: string;
    notes?: string;
  }>>(formData.garnishments || []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleSubmit = (data: GarnishmentFormData) => {
    onSubmit({
      ...data,
      garnishments,
    });
  };

  const addGarnishment = () => {
    setGarnishments([
      ...garnishments,
      { type: '', amount: '', caseNumber: '', notes: '' },
    ]);
  };

  const removeGarnishment = (index: number) => {
    const updated = [...garnishments];
    updated.splice(index, 1);
    setGarnishments(updated);
    onChange({ garnishments: updated });
  };

  const updateGarnishment = (index: number, field: string, value: string | number) => {
    const updated = [...garnishments];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setGarnishments(updated);
    onChange({ garnishments: updated });
  };

  return (
    <BaseGarnishmentForm
      formData={formData}
      onChange={onChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      title="Multiple Garnishment Form"
    >
      {/* Multiple Garnishment Specific Fields */}
      <div className="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4">

        {garnishments.map((garnishment, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-medium">Garnishment #{index + 1}</h5>
              <button
                type="button"
                onClick={() => removeGarnishment(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={garnishment.type}
                  onChange={(e) => updateGarnishment(index, 'type', e.target.value)}
                  className="form-select w-full"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="child-support">Child Support</option>
                  <option value="creditor-debt">Creditor Debt</option>
                  <option value="federal-tax">Federal Tax</option>
                  <option value="state-tax">State Tax</option>
                  <option value="student-loan">Student Loan</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    {getCurrencyConfig().symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={garnishment.amount}
                    onChange={(e) => updateGarnishment(index, 'amount', e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Case/Reference Number
                </label>
                <input
                  type="text"
                  value={garnishment.caseNumber || ''}
                  onChange={(e) => updateGarnishment(index, 'caseNumber', e.target.value)}
                  className="form-input w-full"
                  placeholder="e.g., Case #12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={garnishment.notes || ''}
                  onChange={(e) => updateGarnishment(index, 'notes', e.target.value)}
                  className="form-input w-full"
                  placeholder="Additional details"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <button
            type="button"
            onClick={addGarnishment}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Garnishment
          </button>
        </div>
      </div>
    </BaseGarnishmentForm>
  );
};

export default MultipleGarnishmentForm;
