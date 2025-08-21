import React from 'react';
import BaseGarnishmentForm, { GarnishmentFormData } from './BaseGarnishmentForm';

interface FederalTaxLevyFormProps {
  formData: GarnishmentFormData;
  onChange: (data: Partial<GarnishmentFormData>) => void;
  onSubmit: (data: GarnishmentFormData) => void;
  isSubmitting?: boolean;
}

const FederalTaxLevyForm: React.FC<FederalTaxLevyFormProps> = ({
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
      title="Federal Tax Levy Form"
    >
      {/* Federal Tax Levy Specific Fields */}
      <div className="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Notice ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="noticeId"
              value={formData.noticeId || ''}
              onChange={handleChange}
              className="form-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              IRS Contact Name
            </label>
            <input
              type="text"
              name="irsContactName"
              value={formData.irsContactName || ''}
              onChange={handleChange}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              IRS Contact Phone
            </label>
            <input
              type="tel"
              name="irsContactPhone"
              value={formData.irsContactPhone || ''}
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

export default FederalTaxLevyForm;
