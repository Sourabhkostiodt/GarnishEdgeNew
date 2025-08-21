import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import IconRefresh from './Icon/IconRefresh';
import IconCheckCircle from './Icon/IconCircleCheck';
import IconXCircle from './Icon/IconXCircle';

const TokenStatus: React.FC = () => {
    const { isAuthenticated, user, refreshToken, isLoading } = useAuth();

    const handleManualRefresh = async () => {
        try {
            await refreshToken();
        } catch (error) {
            console.error('Manual refresh failed:', error);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="panel bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        ) : (
                            <IconCheckCircle className="text-green-500 text-lg" />
                        )}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            Authentication Status
                        </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.email && `Logged in as: ${user.email}`}
                    </div>
                </div>
                <button
                    onClick={handleManualRefresh}
                    disabled={isLoading}
                    className="btn btn-sm btn-outline-primary flex items-center space-x-1"
                    title="Manually refresh token"
                >
                    <IconRefresh className="w-4 h-4" />
                    <span>Refresh Token</span>
                </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Token will auto-refresh 30 seconds before expiration (every 4.5 minutes)
            </div>
        </div>
    );
};

export default TokenStatus;
