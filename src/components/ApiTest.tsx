import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../contexts/ApiService';

const ApiTest: React.FC = () => {
    const { isAuthenticated, user, refreshToken } = useAuth();
    const [testResults, setTestResults] = useState<string[]>([]);
    const [isTesting, setIsTesting] = useState(false);

    const addResult = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testTokenVerification = async () => {
        try {
            addResult('Testing token verification...');
            await apiService.verifyToken();
            addResult('✅ Token verification successful');
        } catch (error: any) {
            addResult(`❌ Token verification failed: ${error.message}`);
        }
    };

    const testTokenRefresh = async () => {
        try {
            addResult('Testing token refresh...');
            await refreshToken();
            addResult('✅ Token refresh successful');
        } catch (error: any) {
            addResult(`❌ Token refresh failed: ${error.message}`);
        }
    };

    const testAllApis = async () => {
        setIsTesting(true);
        setTestResults([]);

        addResult('Starting API tests...');

        if (!isAuthenticated) {
            addResult('❌ User not authenticated');
            setIsTesting(false);
            return;
        }

        // Test token verification
        await testTokenVerification();

        // Test token refresh
        await testTokenRefresh();

        addResult('API tests completed');
        setIsTesting(false);
    };

    const clearResults = () => {
        setTestResults([]);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">API Test Panel</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={testAllApis}
                        disabled={isTesting}
                        className="btn btn-primary btn-sm"
                    >
                        {isTesting ? 'Testing...' : 'Test All APIs'}
                    </button>
                    <button
                        onClick={clearResults}
                        className="btn btn-outline-secondary btn-sm"
                    >
                        Clear Results
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                    <strong>Current User:</strong> {user?.email || 'Unknown'}
                </div>
                <div className="text-sm text-gray-600">
                    <strong>Authentication Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <h4 className="font-medium mb-2">Test Results:</h4>
                <div className="max-h-60 overflow-y-auto space-y-1">
                    {testResults.length === 0 ? (
                        <div className="text-gray-500 text-sm">No test results yet. Click "Test All APIs" to start.</div>
                    ) : (
                        testResults.map((result, index) => (
                            <div key={index} className="text-sm font-mono">
                                {result}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
                <p><strong>API Endpoints being tested:</strong></p>
                <ul className="list-disc list-inside mt-1">
                    <li>POST /auth/token/verify/ (body: {"{ token: accessToken }"})</li>
                    <li>POST /auth/token/refresh/ (body: {"{ token: refreshToken }"})</li>
                </ul>
            </div>
        </div>
    );
};

export default ApiTest;
