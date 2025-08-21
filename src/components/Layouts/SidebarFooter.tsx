import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '../../store';
import { toggleTheme } from '../../store/themeConfigSlice';
import { useAuth } from '../../contexts/AuthContext';
import IconSettings from '../Icon/IconSettings';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import IconClock from '../Icon/IconClock';

interface SidebarFooterProps {
    onSettingsClick?: () => void;
    onThemeToggle?: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
    onSettingsClick,
    onThemeToggle
}) => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [userTimezone, setUserTimezone] = useState<string>(
        localStorage.getItem('userTimezone') || Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    useEffect(() => {
        // Update time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // Listen for timezone changes
    useEffect(() => {
        const handleTimezoneChange = (event: CustomEvent) => {
            setUserTimezone(event.detail.timezone);
        };

        window.addEventListener('timezoneChanged', handleTimezoneChange as EventListener);

        return () => {
            window.removeEventListener('timezoneChanged', handleTimezoneChange as EventListener);
        };
    }, []);

    const formatTime = (date: Date): string => {
        try {
            const timeInTimezone = new Date(date.toLocaleString("en-US", { timeZone: userTimezone }));
            const hours = timeInTimezone.getHours();
            const minutes = timeInTimezone.getMinutes();
            const seconds = timeInTimezone.getSeconds();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
        } catch (error) {
            // Fallback to local time if timezone is invalid
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
        }
    };

    const getTimezone = (): string => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone.includes('America/New_York')) return 'EST';
        if (timezone.includes('America/Los_Angeles')) return 'PST';
        if (timezone.includes('Asia/Kolkata')) return 'IST';
        if (timezone.includes('America/Chicago')) return 'CST';
        if (timezone.includes('America/Denver')) return 'MST';
        if (timezone.includes('Europe/London')) return 'GMT';
        if (timezone.includes('Europe/Paris')) return 'CET';
        if (timezone.includes('Asia/Tokyo')) return 'JST';
        if (timezone.includes('Australia/Sydney')) return 'AEST';
        return timezone.split('/').pop()?.substring(0, 3).toUpperCase() || 'UTC';
    };

    return (
        <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700 flex items-center mt-2">
            <div className="flex items-center justify-between px-2 py-0.5 w-full pt-2">
                {/* System Time Display - Left Corner */}
                <button
                    onClick={() => {
                        // Navigate to settings page with general tab active
                        window.location.href = '/settings?tab=general';
                    }}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 py-0.5 transition-colors duration-200 group"
                    title={`Click to edit timezone (Current: ${userTimezone.replace('_', ' ')})`}
                >
                    <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary">
                        {formatTime(currentTime)}
                    </span>
                </button>

                {/* Action Buttons - Right Side */}
                <div className="flex items-center space-x-1">
                    {/* Theme toggle */}
                    {themeConfig.theme === 'light' ? (
                        <button
                            onClick={() => dispatch(toggleTheme('dark'))}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
                            title="Switch to Dark Mode"
                        >
                            <IconSun className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                        </button>
                    ) : themeConfig.theme === 'dark' ? (
                        <button
                            onClick={() => dispatch(toggleTheme('system'))}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
                            title="Switch to System Mode"
                        >
                            <IconMoon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                        </button>
                    ) : (
                        <button
                            onClick={() => dispatch(toggleTheme('light'))}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
                            title="Switch to Light Mode"
                        >
                            <IconLaptop className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                        </button>
                    )}

                    {/* Separator */}
                    <div className="w-px h-3 bg-gray-300 dark:bg-gray-600 mx-1"></div>

                    {/* Settings */}
                    <button
                        onClick={onSettingsClick}
                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
                        title="Global Settings - Configure application preferences, API endpoints, and UI options"
                    >
                        <IconSettings className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarFooter;
