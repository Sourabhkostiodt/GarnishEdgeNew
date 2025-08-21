import Swal from 'sweetalert2';

// Success message with optional redirection
export const showSuccessMessage = (message: string, redirectTo?: string) => {
    console.log('Showing success message:', message, 'Redirect to:', redirectTo);

    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
            popup: 'swal2-success-toast',
        },
    });

    toast.fire({
        icon: 'success',
        title: message,
        background: '#10b981', // Green background
        color: '#ffffff', // White text
        iconColor: '#ffffff',
        customClass: {
            popup: 'swal2-success-toast',
            title: 'swal2-success-title',
            icon: 'swal2-success-icon'
        },
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            // Ensure green styling is applied
            const popup = toast.querySelector('.swal2-popup');
            if (popup) {
                (popup as HTMLElement).style.backgroundColor = '#10b981';
                (popup as HTMLElement).style.color = '#ffffff';
            }
        }
    });

    // Redirect after showing the message if redirectTo is provided
    if (redirectTo) {
        setTimeout(() => {
            console.log('Redirecting to:', redirectTo);
            window.location.href = redirectTo;
        }, 1000); // Wait 1 second before redirecting to ensure user sees the message
    }
};

// Error message
export const showErrorMessage = (message: string) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
            popup: 'swal2-error-toast',
        },
    });

    toast.fire({
        icon: 'error',
        title: message,
        background: '#ef4444', // Red background
        color: '#ffffff', // White text
        iconColor: '#ffffff',
    });
};

// Warning message
export const showWarningMessage = (message: string) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
            popup: 'swal2-warning-toast',
        },
    });

    toast.fire({
        icon: 'warning',
        title: message,
        background: '#f59e0b', // Yellow background
        color: '#ffffff', // White text
        iconColor: '#ffffff',
    });
};

// Info message
export const showInfoMessage = (message: string) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
            popup: 'swal2-info-toast',
        },
    });

    toast.fire({
        icon: 'info',
        title: message,
        background: '#3b82f6', // Blue background
        color: '#ffffff', // White text
        iconColor: '#ffffff',
    });
};

// Confirmation dialog
export const showConfirmation = (
    title: string,
    text: string,
    confirmButtonText: string = 'Yes',
    cancelButtonText: string = 'No'
): Promise<boolean> => {
    return Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText,
        cancelButtonText,
    }).then((result) => {
        return result.isConfirmed;
    });
};
