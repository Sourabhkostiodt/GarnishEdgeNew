import React from 'react';
import BaseGarnishmentForm, { GarnishmentFormData } from './BaseGarnishmentForm';

interface StateTaxLevyFormProps {
  formData: GarnishmentFormData;
  onChange: (data: Partial<GarnishmentFormData>) => void;
  onSubmit: (data: GarnishmentFormData) => void;
  isSubmitting?: boolean;
}

const StateTaxLevyForm: React.FC<StateTaxLevyFormProps> = ({
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
      title="State Tax Levy Form"
    >
      {/* State Tax Levy Specific Fields */}
      <div className="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={formData.state || ''}
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

          <div>
            <label className="block text-sm font-medium mb-1">
              Tax ID/Notice Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId || ''}
              onChange={handleChange}
              className="form-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tax Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="taxYear"
              min="2000"
              max="2100"
              value={formData.taxYear || ''}
              onChange={handleChange}
              className="form-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              State Agency
            </label>
            <input
              type="text"
              name="stateAgency"
              value={formData.stateAgency || ''}
              onChange={handleChange}
              className="form-input w-full"
              placeholder="e.g., Department of Revenue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Agency Contact Name
            </label>
            <input
              type="text"
              name="agencyContactName"
              value={formData.agencyContactName || ''}
              onChange={handleChange}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Agency Contact Phone
            </label>
            <input
              type="tel"
              name="agencyContactPhone"
              value={formData.agencyContactPhone || ''}
              onChange={handleChange}
              className="form-input w-full"
              placeholder="(555) 555-5555"
            />
          </div>
        </div>
      </div>
    </BaseGarnishmentForm>
  );
};

export default StateTaxLevyForm;
