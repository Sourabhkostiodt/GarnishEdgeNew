import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import IconClock from './Icon/IconClock';
import IconRefresh from './Icon/IconRefresh';

const RefreshCountdown: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    // Token expiration time (5 minutes in milliseconds)
    const TOKEN_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
    const REFRESH_TIME = TOKEN_EXPIRY_TIME - 30 * 1000; // 4.5 minutes (30 seconds before expiry)

        useEffect(() => {
        if (!isAuthenticated) {
            setIsVisible(false);
            return;
        }

        const calculateTimeRemaining = () => {
            const now = Date.now();
            const lastRefresh = localStorage.getItem('lastTokenRefresh');

            if (lastRefresh) {
                const lastRefreshTime = parseInt(lastRefresh);
                const nextRefreshTime = lastRefreshTime + REFRESH_TIME;
                const remaining = Math.max(0, nextRefreshTime - now);

                if (remaining > 0) {
                    setTimeRemaining(remaining);
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            } else {
                // If no last refresh time, set to full refresh time
                setTimeRemaining(REFRESH_TIME);
                setIsVisible(true);
            }
        };

        // Calculate initial time remaining
        calculateTimeRemaining();

        // Update countdown every second
        const interval = setInterval(() => {
            calculateTimeRemaining();
        }, 1000);

        // Listen for storage changes to detect when refresh happens
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'lastTokenRefresh') {
                // Reset countdown when refresh happens
                setTimeRemaining(REFRESH_TIME);
                setIsVisible(true);
            }
        };

        // Listen for custom refresh event
        const handleRefreshEvent = () => {
            setTimeRemaining(REFRESH_TIME);
            setIsVisible(true);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('tokenRefreshed', handleRefreshEvent);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('tokenRefreshed', handleRefreshEvent);
        };
    }, [isAuthenticated]);

    const formatTime = (milliseconds: number): string => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = (): number => {
        return ((REFRESH_TIME - timeRemaining) / REFRESH_TIME) * 100;
    };

    const getStatusColor = (): string => {
        const percentage = getProgressPercentage();
        if (percentage < 50) return 'text-success';
        if (percentage < 80) return 'text-warning';
        return 'text-danger';
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="mb-6 mt-6">
            <div className="panel bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <IconRefresh className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span className="font-semibold text-blue-800 dark:text-blue-200">
                                Next Token Refresh
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <IconClock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className={`text-lg font-mono font-bold ${getStatusColor()}`}>
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Auto-refresh in progress
                        </div>
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ease-out ${
                                    getProgressPercentage() < 50
                                        ? 'bg-green-500'
                                        : getProgressPercentage() < 80
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                }`}
                                style={{ width: `${getProgressPercentage()}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Token will be automatically refreshed 30 seconds before expiration to maintain session security.
                </div>
            </div>
        </div>
    );
};

export default RefreshCountdown;
