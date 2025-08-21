import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle, toggleTheme, toggleSidebar, toggleRTL, toggleLocale, setPrimaryColor } from '../../store/themeConfigSlice';
import IconSettings from '../../components/Icon/IconSettings';
import IconBell from '../../components/Icon/IconBell';
import IconLock from '../../components/Icon/IconLock';
import IconSun from '../../components/Icon/IconSun';
import IconUser from '../../components/Icon/IconUser';
import IconServer from '../../components/Icon/IconServer';
import IconGlobe from '../../components/Icon/IconGlobe';
import IconSave from '../../components/Icon/IconSave';
import IconClock from '../../components/Icon/IconClock';
import { showSuccessMessage, showErrorMessage } from '../../utils/notifications';
import { applyCurrencyPreset, CURRENCY_PRESETS } from '../../utils/currencyUtils';

const Settings = () => {
    const dispatch = useDispatch();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(false);

        useEffect(() => {
        dispatch(setPageTitle('Settings'));

        // Handle URL parameters for tab selection
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam && ['general', 'theme', 'notifications', 'security', 'api', 'data'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [dispatch]);

    const [settings, setSettings] = useState({
        // General Settings
        companyName: 'GarnishEdge',
        companyEmail: 'admin@garnishedge.com',
        timezone: localStorage.getItem('userTimezone') || Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        language: 'en',
        showUserInterfaceMenu: localStorage.getItem('showUserInterfaceMenu') !== 'false', // Default to true unless explicitly set to false

        // Global Currency Settings
        globalCurrency: localStorage.getItem('globalCurrency') || 'USD',
        currencySymbol: localStorage.getItem('currencySymbol') || '$',
        currencyPosition: localStorage.getItem('currencyPosition') || 'before',
        decimalPlaces: parseInt(localStorage.getItem('decimalPlaces') || '2'),
        thousandsSeparator: localStorage.getItem('thousandsSeparator') || ',',
        decimalSeparator: localStorage.getItem('decimalSeparator') || '.',

        // Theme Settings
        theme: themeConfig.theme || 'light',
        primaryColor: themeConfig.primaryColor || '#4361ee',
        sidebarCollapsed: themeConfig.sidebar === 'collapsed' || false,
        rtlMode: themeConfig.rtlClass === 'rtl',

        // Notification Settings
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        notificationSound: true,
        notificationFrequency: 'immediate',

        // Security Settings
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        loginAttempts: 5,
        ipWhitelist: [],

        // API Settings
        apiEnvironment: 'prod', // 'dev', 'qa', 'prod'
        apiRateLimit: 1000,
        apiTimeout: 30,
        enableApiLogging: true,
        corsOrigins: ['*'],
        customApiEndpoints: {
            dev: 'https://garnishment-backend-6lzi.onrender.com',
            qa: 'https://garnishment-backend-6lzi.onrender.com',
            prod: 'https://garnishedge-be.onrender.com'
        },

        // Data Settings
        dataRetention: 365,
        autoBackup: true,
        backupFrequency: 'daily',
        enableAuditLog: true,
    });

    const handleSettingChange = (category: string, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));

        // Apply theme changes immediately for better UX
        if (category === 'theme' && key === 'theme') {
            dispatch(toggleTheme(value));
        }

        // Apply sidebar changes immediately
        if (category === 'theme' && key === 'sidebarCollapsed') {
            if (value !== themeConfig.sidebar) {
                dispatch(toggleSidebar());
            }
        }

        // Apply RTL changes immediately
        if (category === 'theme' && key === 'rtlMode') {
            const currentRtl = themeConfig.rtlClass === 'rtl';
            if (value !== currentRtl) {
                dispatch(toggleRTL(value ? 'rtl' : 'ltr'));
            }
        }

        // Apply primary color changes immediately
        if (category === 'theme' && key === 'primaryColor') {
            dispatch(setPrimaryColor(value));
        }

        // Apply language changes immediately
        if (category === 'general' && key === 'language') {
            if (value !== themeConfig.locale) {
                dispatch(toggleLocale(value));
            }
        }

        // Apply UI menu visibility changes immediately
        if (category === 'general' && key === 'showUserInterfaceMenu') {
            localStorage.setItem('showUserInterfaceMenu', value.toString());
            // Dispatch custom event to notify sidebar
            window.dispatchEvent(new CustomEvent('uiMenuVisibilityChanged', { detail: { visible: value } }));
        }

        // Apply timezone changes immediately
        if (category === 'general' && key === 'timezone') {
            localStorage.setItem('userTimezone', value);
            // Dispatch custom event to notify sidebar footer
            window.dispatchEvent(new CustomEvent('timezoneChanged', { detail: { timezone: value } }));
        }

        // Auto-apply currency preset when currency code changes
        if (category === 'general' && key === 'globalCurrency') {
            if (value === 'CUSTOM') {
                // For custom currency, don't auto-apply preset but keep current settings
                return;
            }

            applyCurrencyPreset(value);
            // Update local state with preset values
            const preset = CURRENCY_PRESETS[value];
            if (preset) {
                setSettings(prev => ({
                    ...prev,
                    currencySymbol: preset.symbol || prev.currencySymbol,
                    currencyPosition: preset.position || prev.currencyPosition,
                    decimalPlaces: preset.decimalPlaces || prev.decimalPlaces,
                    thousandsSeparator: preset.thousandsSeparator || prev.thousandsSeparator,
                    decimalSeparator: preset.decimalSeparator || prev.decimalSeparator
                }));
            }
            // Dispatch currency change event
            window.dispatchEvent(new CustomEvent('currencyChanged'));
        }

        // Dispatch currency change event for other currency settings
        if (category === 'general' && ['currencySymbol', 'currencyPosition', 'decimalPlaces', 'thousandsSeparator', 'decimalSeparator'].includes(key)) {
            window.dispatchEvent(new CustomEvent('currencyChanged'));
        }
    };

    const handleUpdateApiService = async () => {
        try {
            const apiServiceContent = `// Auto-generated API Service Configuration
// Generated on: ${new Date().toISOString()}
// Environment: ${settings.apiEnvironment}

const API_BASE_URL = '${settings.customApiEndpoints.dev}';
const QA_API_BASE_URL = '${settings.customApiEndpoints.qa}';
const PROD_API_BASE_URL = '${settings.customApiEndpoints.prod}';

// Get the base URL based on current environment
const getCurrentBaseUrl = (): string => {
    const environment = localStorage.getItem('apiEnvironment') || '${settings.apiEnvironment}';
    switch (environment) {
        case 'dev':
            return API_BASE_URL;
        case 'qa':
            return QA_API_BASE_URL;
        case 'prod':
            return PROD_API_BASE_URL;
        default:
            return PROD_API_BASE_URL;
    }
};

// Import notification utilities
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';

class ApiService {
    // Get the base URL for API calls
    getBaseUrl(): string {
        return getCurrentBaseUrl();
    }

    // Get the production base URL for specific endpoints
    getProdBaseUrl(): string {
        return PROD_API_BASE_URL;
    }

    // Get the QA base URL for specific endpoints
    getQaBaseUrl(): string {
        return QA_API_BASE_URL;
    }

    // Get the development base URL for specific endpoints
    getDevBaseUrl(): string {
        return API_BASE_URL;
    }

    // Set the current API environment
    setEnvironment(environment: 'dev' | 'qa' | 'prod'): void {
        localStorage.setItem('apiEnvironment', environment);
    }

    // Get the current API environment
    getEnvironment(): string {
        return localStorage.getItem('apiEnvironment') || '${settings.apiEnvironment}';
    }

    // ... rest of your existing ApiService methods
`;

            // Create a downloadable file
            const blob = new Blob([apiServiceContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ApiService.ts';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Save environment to localStorage
            localStorage.setItem('apiEnvironment', settings.apiEnvironment);
            localStorage.setItem('customApiEndpoints', JSON.stringify(settings.customApiEndpoints));

            showSuccessMessage('ApiService.ts configuration downloaded successfully!');
        } catch (error) {
            showErrorMessage('Failed to generate ApiService configuration');
        }
    };

    const handleTestApiConnection = async () => {
        try {
            const currentEndpoint = settings.customApiEndpoints[settings.apiEnvironment as keyof typeof settings.customApiEndpoints];

            // Test the connection with a simple GET request
            const response = await fetch(`${currentEndpoint}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                showSuccessMessage(`✅ Connection successful to ${settings.apiEnvironment.toUpperCase()} environment!`);
            } else {
                showErrorMessage(`⚠️ Connection failed: HTTP ${response.status}`);
            }
        } catch (error) {
            showErrorMessage(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleSaveSettings = async () => {
        setIsLoading(true);
        try {
            // Simulate API call to save settings
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Apply theme changes
            if (settings.theme !== themeConfig.theme) {
                dispatch(toggleTheme(settings.theme));
            }

            // Apply sidebar collapse setting
            if (settings.sidebarCollapsed !== themeConfig.sidebar) {
                dispatch(toggleSidebar());
            }

            // Apply RTL setting
            if (settings.rtlMode !== (themeConfig.rtlClass === 'rtl')) {
                dispatch(toggleRTL(settings.rtlMode ? 'rtl' : 'ltr'));
            }

            // Apply language setting
            if (settings.language !== themeConfig.locale) {
                dispatch(toggleLocale(settings.language));
            }

            // Save API environment settings
            localStorage.setItem('apiEnvironment', settings.apiEnvironment);
            localStorage.setItem('customApiEndpoints', JSON.stringify(settings.customApiEndpoints));

            // Save UI menu visibility setting
            localStorage.setItem('showUserInterfaceMenu', settings.showUserInterfaceMenu.toString());

            // Save Global Currency Settings
            localStorage.setItem('globalCurrency', settings.globalCurrency);
            localStorage.setItem('currencySymbol', settings.currencySymbol);
            localStorage.setItem('currencyPosition', settings.currencyPosition);
            localStorage.setItem('decimalPlaces', settings.decimalPlaces.toString());
            localStorage.setItem('thousandsSeparator', settings.thousandsSeparator);
            localStorage.setItem('decimalSeparator', settings.decimalSeparator);

            showSuccessMessage('Settings saved successfully!');
        } catch (error) {
            showErrorMessage('Failed to save settings');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: IconSettings },
        { id: 'theme', label: 'Theme', icon: IconSun },
        { id: 'notifications', label: 'Notifications', icon: IconBell },
        { id: 'security', label: 'Security', icon: IconLock },
        { id: 'api', label: 'API', icon: IconServer },
        { id: 'data', label: 'Data', icon: IconGlobe },
    ];

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                        className="form-input w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Company Email</label>
                    <input
                        type="email"
                        value={settings.companyEmail}
                        onChange={(e) => handleSettingChange('general', 'companyEmail', e.target.value)}
                        className="form-input w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 flex items-center">
                        <IconClock className="w-4 h-4 mr-2 text-primary" />
                        Sidebar Timezone
                    </label>
                    <select
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        className="form-select w-full"
                    >
                        <option value="America/New_York">Eastern Time (ET) - New York</option>
                        <option value="America/Chicago">Central Time (CT) - Chicago</option>
                        <option value="America/Denver">Mountain Time (MT) - Denver</option>
                        <option value="America/Los_Angeles">Pacific Time (PT) - Los Angeles</option>
                        <option value="America/Anchorage">Alaska Time (AKT) - Anchorage</option>
                        <option value="Pacific/Honolulu">Hawaii Time (HST) - Honolulu</option>
                        <option value="Europe/London">Greenwich Mean Time (GMT) - London</option>
                        <option value="Europe/Paris">Central European Time (CET) - Paris</option>
                        <option value="Europe/Berlin">Central European Time (CET) - Berlin</option>
                        <option value="Europe/Rome">Central European Time (CET) - Rome</option>
                        <option value="Europe/Moscow">Moscow Time (MSK) - Moscow</option>
                        <option value="Asia/Tokyo">Japan Standard Time (JST) - Tokyo</option>
                        <option value="Asia/Shanghai">China Standard Time (CST) - Shanghai</option>
                        <option value="Asia/Kolkata">India Standard Time (IST) - Mumbai</option>
                        <option value="Asia/Dubai">Gulf Standard Time (GST) - Dubai</option>
                        <option value="Asia/Singapore">Singapore Time (SGT) - Singapore</option>
                        <option value="Australia/Sydney">Australian Eastern Time (AET) - Sydney</option>
                        <option value="Australia/Perth">Australian Western Time (AWT) - Perth</option>
                        <option value="Pacific/Auckland">New Zealand Standard Time (NZST) - Auckland</option>
                        <option value="UTC">UTC - Coordinated Universal Time</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <span className="mr-1">🕐</span>
                        Changes apply immediately to sidebar footer time display
                    </p>
                    <p className="text-xs text-blue-500 mt-1 flex items-center">
                        <span className="mr-1">💡</span>
                        Click the time in sidebar footer to quickly access this setting
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select
                        value={themeConfig.locale || 'en'}
                        onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                        className="form-select w-full"
                    >
                        {themeConfig.languageList.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Changes apply immediately</p>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.showUserInterfaceMenu}
                            onChange={(e) => handleSettingChange('general', 'showUserInterfaceMenu', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Show User Interface Menu Items</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Control visibility of UI components in sidebar</p>
                </div>
            </div>

            {/* Global Currency Settings */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Global Currency Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Currency Code</label>
                        <select
                            value={settings.globalCurrency}
                            onChange={(e) => handleSettingChange('general', 'globalCurrency', e.target.value)}
                            className="form-select w-full"
                        >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                            <option value="CNY">CNY - Chinese Yuan</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="MXN">MXN - Mexican Peso</option>
                            <option value="CUSTOM">CUSTOM - Custom Currency</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Currency Symbol</label>
                        <input
                            type="text"
                            value={settings.currencySymbol}
                            onChange={(e) => handleSettingChange('general', 'currencySymbol', e.target.value)}
                            className="form-input w-full"
                            placeholder="$"
                            readOnly={settings.globalCurrency !== 'CUSTOM' && CURRENCY_PRESETS[settings.globalCurrency]?.symbol !== undefined}
                            title={settings.globalCurrency === 'CUSTOM' ? "Custom symbol - Edit freely" : (CURRENCY_PRESETS[settings.globalCurrency]?.symbol ? "Symbol is auto-set based on currency code" : "Custom symbol")}
                        />
                        {settings.globalCurrency !== 'CUSTOM' && CURRENCY_PRESETS[settings.globalCurrency]?.symbol && (
                            <p className="text-xs text-gray-500 mt-1">Auto-set based on currency code</p>
                        )}
                        {settings.globalCurrency === 'CUSTOM' && (
                            <p className="text-xs text-blue-500 mt-1">Custom currency - Edit symbol freely</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Symbol Position</label>
                        <select
                            value={settings.currencyPosition}
                            onChange={(e) => handleSettingChange('general', 'currencyPosition', e.target.value)}
                            className="form-select w-full"
                        >
                            <option value="before">Before amount ($100)</option>
                            <option value="after">After amount (100$)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Decimal Places</label>
                        <select
                            value={settings.decimalPlaces}
                            onChange={(e) => handleSettingChange('general', 'decimalPlaces', parseInt(e.target.value))}
                            className="form-select w-full"
                        >
                            <option value={0}>0 (100)</option>
                            <option value={1}>1 (100.1)</option>
                            <option value={2}>2 (100.10)</option>
                            <option value={3}>3 (100.100)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Thousands Separator</label>
                        <input
                            type="text"
                            value={settings.thousandsSeparator}
                            onChange={(e) => handleSettingChange('general', 'thousandsSeparator', e.target.value)}
                            className="form-input w-full"
                            placeholder=","
                            maxLength={1}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Decimal Separator</label>
                        <input
                            type="text"
                            value={settings.decimalSeparator}
                            onChange={(e) => handleSettingChange('general', 'decimalSeparator', e.target.value)}
                            className="form-input w-full"
                            placeholder="."
                            maxLength={1}
                        />
                    </div>
                </div>

                {/* Currency Preview */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Preview:</h4>
                    <div className="text-lg font-mono">
                        {settings.currencyPosition === 'before'
                            ? `${settings.currencySymbol}1,234${settings.decimalSeparator}56`
                            : `1,234${settings.decimalSeparator}56${settings.currencySymbol}`
                        }
                    </div>
                </div>
            </div>
        </div>
    );

    const renderThemeSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Theme Mode</label>
                    <select
                        value={themeConfig.theme || 'light'}
                        onChange={(e) => handleSettingChange('theme', 'theme', e.target.value)}
                        className="form-select w-full"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Changes apply immediately</p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Primary Color</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => handleSettingChange('theme', 'primaryColor', e.target.value)}
                            className="form-input w-16 h-10 p-1"
                        />
                        <input
                            type="text"
                            value={settings.primaryColor}
                            onChange={(e) => handleSettingChange('theme', 'primaryColor', e.target.value)}
                            className="form-input flex-1"
                            placeholder="#4361ee"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Customize your primary color - changes apply immediately</p>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={themeConfig.sidebar === 'collapsed'}
                            onChange={(e) => handleSettingChange('theme', 'sidebarCollapsed', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Collapse Sidebar by Default</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Changes apply immediately</p>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={themeConfig.rtlClass === 'rtl'}
                            onChange={(e) => handleSettingChange('theme', 'rtlMode', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Enable RTL Mode</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Changes apply immediately</p>
                </div>
            </div>

            {/* Primary Color Preview */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h6 className="font-medium mb-3">Primary Color Preview</h6>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg border">
                        <span className="text-sm font-medium mb-2">Button</span>
                        <button className="btn btn-primary btn-sm">Primary Button</button>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg border">
                        <span className="text-sm font-medium mb-2">Text</span>
                        <span className="text-primary font-semibold">Primary Text</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg border">
                        <span className="text-sm font-medium mb-2">Badge</span>
                        <span className="badge badge-outline-primary">Primary Badge</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h6 className="font-medium mb-2">Current Theme Status</h6>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Active Theme:</span>
                        <span className="ml-2 font-medium">{themeConfig.theme || 'light'}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Sidebar:</span>
                        <span className="ml-2 font-medium">{themeConfig.sidebar ? 'Collapsed' : 'Expanded'}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">RTL Mode:</span>
                        <span className="ml-2 font-medium">{themeConfig.rtlClass === 'rtl' ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Primary Color:</span>
                        <span className="ml-2 font-medium flex items-center gap-2">
                            <div className="w-4 h-4 rounded border" style={{ backgroundColor: themeConfig.primaryColor }}></div>
                            {themeConfig.primaryColor}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Dark Mode:</span>
                        <span className="ml-2 font-medium">{themeConfig.isDarkMode ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Language:</span>
                        <span className="ml-2 font-medium">
                            {themeConfig.languageList.find(lang => lang.code === themeConfig.locale)?.name || 'English'}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Timezone:</span>
                        <span className="ml-2 font-medium">
                            {settings.timezone.replace('_', ' ')}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">API Environment:</span>
                        <span className="ml-2 font-medium capitalize">
                            {settings.apiEnvironment} ({settings.customApiEndpoints[settings.apiEnvironment as keyof typeof settings.customApiEndpoints]})
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Email Notifications</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.pushNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Push Notifications</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.smsNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">SMS Notifications</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.notificationSound}
                            onChange={(e) => handleSettingChange('notifications', 'notificationSound', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Notification Sound</span>
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Notification Frequency</label>
                    <select
                        value={settings.notificationFrequency}
                        onChange={(e) => handleSettingChange('notifications', 'notificationFrequency', e.target.value)}
                        className="form-select w-full"
                    >
                        <option value="immediate">Immediate</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.twoFactorAuth}
                            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Enable Two-Factor Authentication</span>
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                    <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="form-input w-full"
                        min="5"
                        max="480"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Password Expiry (days)</label>
                    <input
                        type="number"
                        value={settings.passwordExpiry}
                        onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                        className="form-input w-full"
                        min="30"
                        max="365"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
                    <input
                        type="number"
                        value={settings.loginAttempts}
                        onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                        className="form-input w-full"
                        min="3"
                        max="10"
                    />
                </div>
            </div>
        </div>
    );

    const renderApiSettings = () => (
        <div className="space-y-6">
            {/* API Environment Configuration */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h6 className="font-medium mb-3 text-blue-800 dark:text-blue-200">API Environment Configuration</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Environment</label>
                        <select
                            value={settings.apiEnvironment}
                            onChange={(e) => handleSettingChange('api', 'apiEnvironment', e.target.value)}
                            className="form-select w-full"
                        >
                            <option value="dev">Development</option>
                            <option value="qa">QA/Staging</option>
                            <option value="prod">Production</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Select the API environment to use</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Current Endpoint</label>
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded border text-sm font-mono">
                            {settings.customApiEndpoints[settings.apiEnvironment as keyof typeof settings.customApiEndpoints]}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom API Endpoints */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h6 className="font-medium mb-3 text-yellow-800 dark:text-yellow-200">Custom API Endpoints</h6>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Development URL</label>
                        <input
                            type="url"
                            value={settings.customApiEndpoints.dev}
                            onChange={(e) => handleSettingChange('api', 'customApiEndpoints', {
                                ...settings.customApiEndpoints,
                                dev: e.target.value
                            })}
                            className="form-input w-full text-sm"
                            placeholder="https://dev-api.example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">QA/Staging URL</label>
                        <input
                            type="url"
                            value={settings.customApiEndpoints.qa}
                            onChange={(e) => handleSettingChange('api', 'customApiEndpoints', {
                                ...settings.customApiEndpoints,
                                qa: e.target.value
                            })}
                            className="form-input w-full text-sm"
                            placeholder="https://qa-api.example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Production URL</label>
                        <input
                            type="url"
                            value={settings.customApiEndpoints.prod}
                            onChange={(e) => handleSettingChange('api', 'customApiEndpoints', {
                                ...settings.customApiEndpoints,
                                prod: e.target.value
                            })}
                            className="form-input w-full text-sm"
                            placeholder="https://api.example.com"
                        />
                    </div>
                </div>
                <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => handleUpdateApiService()}
                        className="btn btn-primary btn-sm"
                    >
                        Update ApiService.ts
                    </button>
                    <button
                        onClick={() => handleTestApiConnection()}
                        className="btn btn-outline-primary btn-sm"
                    >
                        Test Connection
                    </button>
                </div>
            </div>

            {/* API Configuration */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h6 className="font-medium mb-3">API Configuration</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">API Rate Limit (requests/hour)</label>
                        <input
                            type="number"
                            value={settings.apiRateLimit}
                            onChange={(e) => handleSettingChange('api', 'apiRateLimit', parseInt(e.target.value))}
                            className="form-input w-full"
                            min="100"
                            max="10000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">API Timeout (seconds)</label>
                        <input
                            type="number"
                            value={settings.apiTimeout}
                            onChange={(e) => handleSettingChange('api', 'apiTimeout', parseInt(e.target.value))}
                            className="form-input w-full"
                            min="5"
                            max="300"
                        />
                    </div>
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={settings.enableApiLogging}
                                onChange={(e) => handleSettingChange('api', 'enableApiLogging', e.target.checked)}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Enable API Logging</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">CORS Origins</label>
                        <input
                            type="text"
                            value={settings.corsOrigins.join(', ')}
                            onChange={(e) => handleSettingChange('api', 'corsOrigins', e.target.value.split(',').map(s => s.trim()))}
                            className="form-input w-full"
                            placeholder="* or specific domains"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDataSettings = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Data Retention (days)</label>
                    <input
                        type="number"
                        value={settings.dataRetention}
                        onChange={(e) => handleSettingChange('data', 'dataRetention', parseInt(e.target.value))}
                        className="form-input w-full"
                        min="30"
                        max="3650"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                    <select
                        value={settings.backupFrequency}
                        onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
                        className="form-select w-full"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.autoBackup}
                            onChange={(e) => handleSettingChange('data', 'autoBackup', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Enable Auto Backup</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.enableAuditLog}
                            onChange={(e) => handleSettingChange('data', 'enableAuditLog', e.target.checked)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">Enable Audit Log</span>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralSettings();
            case 'theme':
                return renderThemeSettings();
            case 'notifications':
                return renderNotificationSettings();
            case 'security':
                return renderSecuritySettings();
            case 'api':
                return renderApiSettings();
            case 'data':
                return renderDataSettings();
            default:
                return renderGeneralSettings();
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <a href="#" className="text-primary hover:underline">
                        Dashboard
                    </a>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Settings</span>
                </li>
            </ul>

            <div className="pt-5">
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Global Settings</h5>
                        <button
                            type="button"
                            onClick={handleSaveSettings}
                            disabled={isLoading}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <IconSave className="w-4 h-4" />
                            {isLoading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
