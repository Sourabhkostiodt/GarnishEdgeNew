import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import IconLogout from './Icon/IconLogout';

const LogoutButton: React.FC = () => {
    const { logout, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <button
            onClick={logout}
            className="btn btn-outline-danger flex items-center space-x-2"
            title="Logout"
        >
            <IconLogout className="w-4 h-4" />
            <span>Logout</span>
        </button>
    );
};

export default LogoutButton;
