import React from 'react';
import { showSuccessMessage, showErrorMessage, showWarningMessage, showInfoMessage, showConfirmation } from '../utils/notifications';

const SuccessExample: React.FC = () => {
    const handleSuccessWithRedirect = () => {
        showSuccessMessage('Operation completed successfully!', '/analytics');
    };

    const handleSuccessWithoutRedirect = () => {
        showSuccessMessage('Data saved successfully!');
    };

    const handleError = () => {
        showErrorMessage('Something went wrong!');
    };

    const handleWarning = () => {
        showWarningMessage('Please check your input!');
    };

    const handleInfo = () => {
        showInfoMessage('This is an informational message.');
    };

    const handleConfirmation = async () => {
        const confirmed = await showConfirmation(
            'Are you sure?',
            'This action cannot be undone.',
            'Yes, proceed',
            'Cancel'
        );

        if (confirmed) {
            showSuccessMessage('Action confirmed!', '/dashboard');
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Notification Examples</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                    onClick={handleSuccessWithRedirect}
                    className="btn btn-success"
                >
                    Success with Redirect
                </button>

                <button
                    onClick={handleSuccessWithoutRedirect}
                    className="btn btn-success"
                >
                    Success without Redirect
                </button>

                <button
                    onClick={handleError}
                    className="btn btn-danger"
                >
                    Error Message
                </button>

                <button
                    onClick={handleWarning}
                    className="btn btn-warning"
                >
                    Warning Message
                </button>

                <button
                    onClick={handleInfo}
                    className="btn btn-info"
                >
                    Info Message
                </button>

                <button
                    onClick={handleConfirmation}
                    className="btn btn-primary"
                >
                    Confirmation Dialog
                </button>
            </div>
        </div>
    );
};

export default SuccessExample;
