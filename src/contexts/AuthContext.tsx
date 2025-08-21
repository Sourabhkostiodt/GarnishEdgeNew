import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiService from './ApiService';
import { showErrorMessage, showSuccessMessage } from '../utils/notifications';

// Types for authentication
interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthTokens {
    access: string;
    refresh: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    refreshToken: () => Promise<boolean>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage keys
const TOKEN_KEYS = {
    ACCESS: 'authToken',
    REFRESH: 'refreshToken',
    USER: 'userData'
};

// Token expiration time (5 minutes in milliseconds)
const TOKEN_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(null);

    // Initialize authentication state
    useEffect(() => {
        initializeAuth();
    }, []);

    // Set up automatic token refresh
    useEffect(() => {
        if (isAuthenticated && user) {
            setupTokenRefresh();
        }
        return () => {
            if (refreshTimeout) {
                clearTimeout(refreshTimeout);
            }
        };
    }, [isAuthenticated, user]);

    const initializeAuth = async () => {
        try {
            const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS);
            const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH);
            const userData = localStorage.getItem(TOKEN_KEYS.USER);

            if (accessToken && refreshToken && userData) {
                // Verify the current token
                try {
                    await apiService.verifyToken();
                    setUser(JSON.parse(userData));
                    setIsAuthenticated(true);
                    console.log('Token verified successfully');
                } catch (error) {
                    console.log('Token verification failed, attempting refresh');
                    // If verification fails, try to refresh the token
                    const refreshSuccess = await refreshTokenFunction();
                    if (!refreshSuccess) {
                        clearAuthData();
                    }
                }
            } else {
                clearAuthData();
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            clearAuthData();
        } finally {
            setIsLoading(false);
        }
    };

    const setupTokenRefresh = () => {
        // Clear any existing timeout
        if (refreshTimeout) {
            clearTimeout(refreshTimeout);
        }

        // Set up refresh 30 seconds before expiration (4.5 minutes)
        const refreshTime = TOKEN_EXPIRY_TIME - 30 * 1000;

        const timeout = setTimeout(async () => {
            console.log('Auto-refreshing token...');
            const success = await refreshTokenFunction();
            if (!success) {
                console.log('Auto-refresh failed, logging out');
                logout();
            }
        }, refreshTime);

        setRefreshTimeout(timeout);
    };

    const clearAuthData = () => {
        // Clear only authentication-related data
        // Note: App settings like primary color, theme preferences, etc. should persist
        localStorage.removeItem(TOKEN_KEYS.ACCESS);
        localStorage.removeItem(TOKEN_KEYS.REFRESH);
        localStorage.removeItem(TOKEN_KEYS.USER);
        sessionStorage.removeItem(TOKEN_KEYS.ACCESS);
        sessionStorage.removeItem(TOKEN_KEYS.REFRESH);
        setUser(null);
        setIsAuthenticated(false);

        if (refreshTimeout) {
            clearTimeout(refreshTimeout);
            setRefreshTimeout(null);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const response = await apiService.login(email, password);

            // Extract tokens and user data from response
            // API returns: { success: boolean, tokens: { access: { token: string }, refresh: { token: string } }, user_data: object }
            const responseData = response as {
                success: boolean;
                tokens: {
                    access: { token: string; expires_at: string };
                    refresh: { token: string; expires_at: string };
                };
                user_data: User;
            };

            const { tokens, user_data: userData } = responseData;

            // Store tokens and user data
            localStorage.setItem(TOKEN_KEYS.ACCESS, tokens.access.token);
            localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refresh.token);
            localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(userData));

            // Update state
            setUser(userData);
            setIsAuthenticated(true);

            // Store the initial refresh timestamp
            localStorage.setItem('lastTokenRefresh', Date.now().toString());

            showSuccessMessage('Login successful!');
            console.log('Login successful');

            return true;
        } catch (error: any) {
            console.error('Login failed:', error);
            showErrorMessage(error.message || 'Login failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        clearAuthData();
        showSuccessMessage('Logged out successfully');

        // Redirect to login page
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
    };

    const refreshTokenFunction = async (): Promise<boolean> => {
        try {
            const refreshTokenValue = localStorage.getItem(TOKEN_KEYS.REFRESH);

            if (!refreshTokenValue) {
                console.log('No refresh token available');
                return false;
            }

            console.log('Refreshing token...');

            // Make refresh request with { refresh: refreshTokenValue } format
            const response = await fetch(`${apiService.getBaseUrl()}/auth/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshTokenValue }),
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();

            // Update tokens - handle both possible response formats
            if (data.access) {
                // If response has direct access token
                localStorage.setItem(TOKEN_KEYS.ACCESS, data.access);
            } else if (data.tokens && data.tokens.access) {
                // If response has nested tokens structure
                localStorage.setItem(TOKEN_KEYS.ACCESS, data.tokens.access.token);
                if (data.tokens.refresh) {
                    localStorage.setItem(TOKEN_KEYS.REFRESH, data.tokens.refresh.token);
                }
            }

            console.log('Token refreshed successfully');

            // Store the refresh timestamp
            localStorage.setItem('lastTokenRefresh', Date.now().toString());

            // Dispatch custom event to notify countdown component
            window.dispatchEvent(new CustomEvent('tokenRefreshed'));

            // Set up next refresh
            setupTokenRefresh();

            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    };

    const updateUser = async (userData: Partial<User>): Promise<void> => {
        try {
            const updatedUser = await apiService.updateUserProfile(userData) as User;
            setUser(updatedUser);
            localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(updatedUser));
            showSuccessMessage('Profile updated successfully');
        } catch (error: any) {
            console.error('Profile update failed:', error);
            showErrorMessage(error.message || 'Profile update failed');
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshToken: refreshTokenFunction,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
