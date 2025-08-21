import React from 'react';
import { useTranslation } from 'react-i18next';

export interface GarnishmentFormData {
  employeeId?: string;
  employeeName?: string;
  ssn?: string;
  [key: string]: any; // For additional form-specific fields
}

interface BaseGarnishmentFormProps {
  formData: GarnishmentFormData;
  onChange: (data: Partial<GarnishmentFormData>) => void;
  onSubmit: (data: GarnishmentFormData) => void;
  isSubmitting?: boolean;
  children?: React.ReactNode;
  title: string;
}

const BaseGarnishmentForm: React.FC<BaseGarnishmentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isSubmitting = false,
  children,
  title,
}) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    onChange({
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form-specific fields will be rendered here */}
        {children}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => {
            // Reset form logic if needed
            onChange({});
          }}
        >
          Reset
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default BaseGarnishmentForm;
