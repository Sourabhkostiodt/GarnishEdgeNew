import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseGarnishmentForm from './BaseGarnishmentForm';
import ChildSupportForm, { ChildSupportFormData } from './ChildSupportForm';
import CreditorDebtForm from './CreditorDebtForm';
import FederalTaxLevyForm from './FederalTaxLevyForm';
import StudentDefaultLoanForm from './StudentDefaultLoanForm';
import StateTaxLevyForm from './StateTaxLevyForm';
import MultipleGarnishmentForm from './MultipleGarnishmentForm';
import type { GarnishmentFormData } from './BaseGarnishmentForm';

type FormType = 
  | 'child-support'
  | 'creditor-debt'
  | 'federal-tax-levy'
  | 'student-default-loan'
  | 'state-tax-levy'
  | 'multiple-garnishment';

// Union of all possible form data types
type AnyFormData = GarnishmentFormData | ChildSupportFormData;

// Type guard to check if data is ChildSupportFormData
function isChildSupportFormData(data: any): data is ChildSupportFormData {
  return 'workState' in data && 'payPeriod' in data;
}

// Type for form configuration
interface FormConfig {
  component: React.ComponentType<{
    formData: any;
    onChange: (data: any) => void;
    onSubmit: (data: any) => void;
    isSubmitting?: boolean;
  }>;
  title: string;
}

// Form configuration
const formConfigs: Record<FormType, FormConfig> = {
  'child-support': {
    component: ChildSupportForm,
    title: 'Child Support Form'
  },
  'creditor-debt': {
    component: CreditorDebtForm,
    title: 'Creditor Debt Form'
  },
  'federal-tax-levy': {
    component: FederalTaxLevyForm,
    title: 'Federal Tax Levy Form'
  },
  'student-default-loan': {
    component: StudentDefaultLoanForm,
    title: 'Student Default Loan Form'
  },
  'state-tax-levy': {
    component: StateTaxLevyForm,
    title: 'State Tax Levy Form'
  },
  'multiple-garnishment': {
    component: MultipleGarnishmentForm,
    title: 'Multiple Garnishment Form'
  }
};

const FormSelector: React.FC = () => {
  const { t } = useTranslation();
  const [selectedForm, setSelectedForm] = useState<FormType>('child-support');
  
  // Initialize form data based on the selected form type
  const [formData, setFormData] = useState<AnyFormData>(() => {
    const baseData: GarnishmentFormData = {
      employeeId: '',
      employeeName: '',
      ssn: '',
      amountType: 'percentage',
      amount: ''
    };
    
    if (selectedForm === 'child-support') {
      return {
        ...baseData,
        workState: '',
        payPeriod: 'Weekly',
        grossPay: 0,
        totalMandatoryDeduction: 0,
        numberOfExemptions: 1,
        supportSecondFamily: false,
        arrearsGreaterThan12Weeks: false
      };
    }
    
    return baseData;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { component: FormComponent, title } = formConfigs[selectedForm];

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormType = e.target.value as FormType;
    setSelectedForm(newFormType);
    
    // Reset form data when changing form type
    if (newFormType !== selectedForm) {
      const baseData: GarnishmentFormData = {
        employeeId: '',
        employeeName: '',
        ssn: '',
        amountType: 'percentage',
        amount: ''
      };
      
      if (newFormType === 'child-support') {
        setFormData({
          ...baseData,
          workState: '',
          payPeriod: 'Weekly',
          grossPay: 0,
          totalMandatoryDeduction: 0,
          numberOfExemptions: 1,
          supportSecondFamily: false,
          arrearsGreaterThan12Weeks: false
        });
      } else {
        setFormData(baseData);
      }
    }
  };

  const handleChange = (data: Partial<AnyFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const handleFormSubmit = async (data: AnyFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call
      console.log('Submitting form data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="panel">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Garnishment Forms</h2>
        <div className="mb-6">
          <label htmlFor="form-select" className="block text-sm font-medium mb-2">
            Select Form Type
          </label>
          <select
            id="form-select"
            value={selectedForm}
            onChange={handleFormChange}
            className="form-select w-full"
          >
            {Object.entries(formConfigs).map(([value, config]) => (
              <option key={value} value={value}>
                {config.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
<FormComponent 
            formData={formData as any}
            onChange={handleChange as any}
            onSubmit={handleFormSubmit as any}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default FormSelector;
