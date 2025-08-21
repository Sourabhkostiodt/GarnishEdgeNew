// API Environment Configuration
const API_BASE_URL = 'https://garnishment-backend-6lzi.onrender.com';
const QA_API_BASE_URL = 'https://garnishment-backend-6lzi.onrender.com';
const ProdAPI_BASE_URL = 'https://garnishedge-be.onrender.com';

// Get the base URL based on current environment
const getCurrentBaseUrl = (): string => {
    const environment = localStorage.getItem('apiEnvironment') || 'prod';
    switch (environment) {
        case 'dev':
            return API_BASE_URL;
        case 'qa':
            return QA_API_BASE_URL;
        case 'prod':
            return ProdAPI_BASE_URL;
        default:
            return ProdAPI_BASE_URL;
    }
};

// Get custom endpoints from localStorage if available
const getCustomEndpoints = () => {
    try {
        const customEndpoints = localStorage.getItem('customApiEndpoints');
        return customEndpoints ? JSON.parse(customEndpoints) : null;
    } catch (error) {
        console.warn('Failed to parse custom API endpoints:', error);
        return null;
    }
};

// Import notification utilities
import { showSuccessMessage, showErrorMessage } from '../utils/notifications';

class ApiService {
    // Get the base URL for API calls
    getBaseUrl(): string {
        const customEndpoints = getCustomEndpoints();
        if (customEndpoints) {
            const environment = localStorage.getItem('apiEnvironment') || 'prod';
            return customEndpoints[environment] || getCurrentBaseUrl();
        }
        return getCurrentBaseUrl();
    }

    // Get the production base URL for specific endpoints
    getProdBaseUrl(): string {
        const customEndpoints = getCustomEndpoints();
        return customEndpoints?.prod || ProdAPI_BASE_URL;
    }

    // Get the QA base URL for specific endpoints
    getQaBaseUrl(): string {
        const customEndpoints = getCustomEndpoints();
        return customEndpoints?.qa || QA_API_BASE_URL;
    }

    // Get the development base URL for specific endpoints
    getDevBaseUrl(): string {
        const customEndpoints = getCustomEndpoints();
        return customEndpoints?.dev || API_BASE_URL;
    }

    // Set the current API environment
    setEnvironment(environment: 'dev' | 'qa' | 'prod'): void {
        localStorage.setItem('apiEnvironment', environment);
    }

    // Get the current API environment
    getEnvironment(): string {
        return localStorage.getItem('apiEnvironment') || 'prod';
    }

    private async refreshTokenIfNeeded(): Promise<boolean> {
        const accessToken = localStorage.getItem('authToken');
        if (!accessToken) return false;

        try {
            await this.verifyToken();
            return true;
        } catch (error) {
            // If token verification fails, try to refresh the token
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await fetch(`${this.getBaseUrl()}/auth/token/refresh/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: refreshToken }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // Handle both response formats
                        if (data.access) {
                            localStorage.setItem('authToken', data.access);
                        } else if (data.tokens && data.tokens.access) {
                            localStorage.setItem('authToken', data.tokens.access.token);
                            if (data.tokens.refresh) {
                                localStorage.setItem('refreshToken', data.tokens.refresh.token);
                            }
                        }
                        if (data.refresh) {
                            localStorage.setItem('refreshToken', data.refresh);
                        }
                        return true;
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
            }

            // If refresh fails, clear auth data and redirect to login
            this.clearAuthData();
            return false;
        }
    }

    private getAuthHeaders(): HeadersInit {
        const accessToken = localStorage.getItem('authToken');
        if (!accessToken) {
            throw new Error('No access token found');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        };
    }

    private clearAuthData(): void {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        // Optionally redirect to login page or show a message
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401) {
            // Token expired or invalid
            this.clearAuthData();
            throw new Error('Your session has expired. Please log in again.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    // Auth endpoints
    async login(email: string, password: string) {
        console.log('API Service: Making login request to:', `${API_BASE_URL}/auth/login/`);
        console.log('API Service: Request body:', { email, password: '***' });

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            console.log('API Service: Response status:', response.status);
            console.log('API Service: Response headers:', Object.fromEntries(response.headers.entries()));

            const data = await this.handleResponse(response);
            console.log('API Service: Response data:', data);
            return data;
        } catch (error) {
            console.error('API Service: Login request failed:', error);
            throw error;
        }
    }

    async verifyToken() {
        // Get access token from localStorage
        const accessToken = localStorage.getItem('authToken');
        if (!accessToken) throw new Error('No access token found');

        const response = await fetch(`${API_BASE_URL}/auth/token/verify/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: accessToken }),
        });
        return this.handleResponse(response);
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');

        const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: refreshToken }),
        });

        const data = await this.handleResponse(response) as {
            access?: string;
            refresh?: string;
            tokens?: {
                access: { token: string; expires_at: string };
                refresh: { token: string; expires_at: string };
            };
        };

        // Update tokens in storage - handle both response formats
        if (data.access) {
            // Direct access token
            localStorage.setItem('authToken', data.access);
        } else if (data.tokens && data.tokens.access) {
            // Nested tokens structure
            localStorage.setItem('authToken', data.tokens.access.token);
            if (data.tokens.refresh) {
                localStorage.setItem('refreshToken', data.tokens.refresh.token);
            }
        }
        if (data.refresh) {
            localStorage.setItem('refreshToken', data.refresh);
        }

        return data;
    }

    async register(userData: { email: string; password: string; name: string }) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return this.handleResponse(response);
    }

    async forgotPassword(email: string) {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        return this.handleResponse(response);
    }

    async resetPassword(token: string, password: string) {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, password }),
        });
        return this.handleResponse(response);
    }

    // User endpoints
    async getUserProfile() {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }

    // State Tax Levy endpoints
    async getStateTaxLevyRules() {
        const response = await fetch(`${API_BASE_URL}/garnishment_state/state-tax-levy-config-data/`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }

    // State Tax Levy endpoints
    async getStateTaxLevyExemptAmtConfig(stateCode: string) {
        const response = await fetch(`${API_BASE_URL}/garnishment_state/state-tax-levy-exempt-amt-config/${stateCode.toLowerCase()}/`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }

    // Creditor Debt endpoints
    async getCreditorDebtRules() {
        const response = await fetch(`${API_BASE_URL}/garnishment_creditor/creditor-debt-rule/`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }

    // Fee Rule endpoints
    async getFeeRules() {
        const response = await fetch(`${API_BASE_URL}/User/GarnishmentFeesStatesRules/`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }

    // Child Support endpoints
    async getChildSupportRules() {
        const response = await fetch(`${API_BASE_URL}/garnishment/child-support-rules/`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }

    async updateUserProfile(userData: Partial<{ name: string; email: string; avatar: string }>) {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(userData),
        });
        return this.handleResponse(response);
    }

    async changePassword(currentPassword: string, newPassword: string) {
        const response = await fetch(`${API_BASE_URL}/user/change-password`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        return this.handleResponse(response);
    }

    // Employee endpoints
    async getEmployees() {
        const response = await fetch(`${API_BASE_URL}/employee/rules/`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }

    // Order endpoints
    async getOrderDetails() {
        const response = await fetch(`${API_BASE_URL}/garnishment/order-details/`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }

    /**
     * Calculate garnishment based on provided JSON data
     * @param data The JSON data to process
     * @returns Processed garnishment data
     */
    async calculateGarnishment(data: any): Promise<any> {
        console.log('Calculating garnishment with data:', data);

        try {
            const response = await fetch(`${ProdAPI_BASE_URL}/garnishment/calculate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(data),
            });

            console.log('Garnishment calculation response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Garnishment calculation result:', result);
            return result;
        } catch (error) {
            console.error('Garnishment calculation failed:', error);
            throw error;
        }
    }

    /**
     * Convert Excel file to JSON
     * @param file The Excel file to convert
     * @returns Converted JSON data
     */
    async convertExcelToJson(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);

        // Log the file being sent for debugging
        console.log('Sending file to convert-excel endpoint:', {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
        });

        try {
            // Get auth headers and ensure we only use the Authorization header
            const authHeaders = this.getAuthHeaders();
            const headers: HeadersInit = {
                'Accept': 'application/json',
                // Let the browser set the Content-Type with boundary
            };

            // Only add Authorization if it exists
            if ('Authorization' in authHeaders) {
                headers['Authorization'] = authHeaders['Authorization'] as string;
            } else if (authHeaders instanceof Headers && authHeaders.has('Authorization')) {
                headers['Authorization'] = authHeaders.get('Authorization') as string;
            }

            const response = await fetch(`${ProdAPI_BASE_URL}/iwo_pdf/convert-excel/`, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            const responseText = await response.text();

            // Try to parse JSON, but don't fail if it's not valid JSON
            let responseData;
            try {
                responseData = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error('Failed to parse JSON response:', responseText);
                throw new Error(`Invalid response from server: ${response.status} ${response.statusText}`);
            }

            if (!response.ok) {
                console.error('Error response from server:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData
                });

                const errorMessage = responseData.detail ||
                                  responseData.message ||
                                  `Failed to convert Excel file: ${response.status} ${response.statusText}`;

                throw new Error(errorMessage);
            }

            console.log('Successfully converted Excel to JSON:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error in convertExcelToJson:', error);
            throw error;
        }
    }

    // Generic API call method with success message support
    async request<T>(
        endpoint: string,
        options: RequestInit = {},
        successMessage?: string,
        redirectTo?: string
    ): Promise<T> {
        try {
            // Check if we have a valid token before making the request
            const hasValidToken = await this.refreshTokenIfNeeded();
            if (!hasValidToken) {
                throw new Error('Authentication required. Please log in again.');
            }

            const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

            // Ensure headers are properly set
            const headers = new Headers(options.headers);
            if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
                headers.set('Content-Type', 'application/json');
            }

            // Add authorization header
            try {
                const authHeaders = this.getAuthHeaders();
                Object.entries(authHeaders).forEach(([key, value]) => {
                    headers.set(key, value);
                });
            } catch (error) {
                // If we can't get auth headers, redirect to login
                this.clearAuthData();
                throw new Error('Authentication required. Please log in again.');
            }

            const config: RequestInit = {
                ...options,
                headers,
                credentials: 'include' as RequestCredentials,
            };

            const response = await fetch(url, config);

            // Handle 401 Unauthorized responses
            if (response.status === 401) {
                this.clearAuthData();
                throw new Error('Your session has expired. Please log in again.');
            }

            const result = await this.handleResponse<T>(response);

            // Show success message if provided
            if (successMessage) {
                showSuccessMessage(successMessage);
            }

            // Redirect if needed
            if (redirectTo) {
                // Use window.location for full page reload to ensure clean state
                window.location.href = redirectTo;
            }

            return result;
        } catch (error) {
            if (error instanceof Error) {
                showErrorMessage(error.message);
            } else {
                showErrorMessage('An unexpected error occurred');
            }
            throw error;
        }
    }

    // Method for operations that should show success message and redirect
    async requestWithSuccess<T>(
        endpoint: string,
        options: RequestInit = {},
        successMessage: string,
        redirectTo: string
    ): Promise<T> {
        return this.request<T>(endpoint, options, successMessage, redirectTo);
    }
}

export const apiService = new ApiService();
export default apiService;
