import React from 'react';
import BaseGarnishmentForm, { GarnishmentFormData } from './BaseGarnishmentForm';

interface StudentDefaultLoanFormProps {
  formData: GarnishmentFormData;
  onChange: (data: Partial<GarnishmentFormData>) => void;
  onSubmit: (data: GarnishmentFormData) => void;
  isSubmitting?: boolean;
}

const StudentDefaultLoanForm: React.FC<StudentDefaultLoanFormProps> = ({
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
      title="Student Default Loan Form"
    >
      {/* Student Default Loan Specific Fields */}
      <div className="col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Loan Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="loanAccountNumber"
              value={formData.loanAccountNumber || ''}
              onChange={handleChange}
              className="form-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Loan Type <span className="text-red-500">*</span>
            </label>
            <select
              name="loanType"
              value={formData.loanType || ''}
              onChange={handleChange}
              className="form-select w-full"
              required
            >
              <option value="">Select Loan Type</option>
              <option value="federal">Federal Student Loan</option>
              <option value="private">Private Student Loan</option>
              <option value="parent-plus">Parent PLUS Loan</option>
              <option value="graduate-plus">Graduate PLUS Loan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Guaranty Agency/Lender Name
            </label>
            <input
              type="text"
              name="lenderName"
              value={formData.lenderName || ''}
              onChange={handleChange}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Default Date
            </label>
            <input
              type="date"
              name="defaultDate"
              value={formData.defaultDate || ''}
              onChange={handleChange}
              className="form-input w-full"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Additional Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes || ''}
              onChange={handleChange}
              className="form-textarea w-full"
              placeholder="Any additional information about the loan..."
            />
          </div>
        </div>
      </div>
    </BaseGarnishmentForm>
  );
};

export default StudentDefaultLoanForm;
