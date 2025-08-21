import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { showSuccessMessage } from '../utils/notifications';

const LoginDebug: React.FC = () => {
    const { login, isLoading, user, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password123');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const handleTestLogin = async () => {
        addLog('Testing login with real API...');
        try {
            const result = await login(email, password);
            addLog(`Login result: ${result}`);

            if (result) {
                addLog('Login successful!');
                addLog(`User authenticated: ${isAuthenticated}`);
                addLog(`User data: ${JSON.stringify(user)}`);
            } else {
                addLog('Login failed');
            }
        } catch (error) {
            addLog(`Error: ${error}`);
        }
    };

    const handleTestSuccessMessage = () => {
        addLog('Testing success message with redirection...');
        showSuccessMessage('Test success message!', '/analytics');
        addLog('Success message triggered');
    };

    const handleTestDirectRedirect = () => {
        addLog('Testing direct redirect...');
        window.location.href = '/analytics';
    };

    const clearLogs = () => {
        setLogs([]);
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Login Debug Component (Real API)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Test Controls</h3>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input w-full"
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input w-full"
                            placeholder="Enter password"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleTestLogin}
                            disabled={isLoading}
                            className="btn btn-primary"
                        >
                            {isLoading ? 'Logging in...' : 'Test Login'}
                        </button>

                        <button
                            onClick={handleTestSuccessMessage}
                            className="btn btn-success"
                        >
                            Test Success Message
                        </button>

                        <button
                            onClick={handleTestDirectRedirect}
                            className="btn btn-info"
                        >
                            Direct Redirect
                        </button>

                        <button
                            onClick={clearLogs}
                            className="btn btn-secondary"
                        >
                            Clear Logs
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Current State</h3>
                    <div className="space-y-2 text-sm">
                        <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
                        <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
                        <div><strong>User:</strong> {user ? JSON.stringify(user) : 'None'}</div>
                        <div><strong>Token:</strong> {localStorage.getItem('authToken') || 'None'}</div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Debug Logs</h3>
                <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                        <p className="text-gray-500">No logs yet. Start testing to see logs here.</p>
                    ) : (
                        <div className="space-y-1">
                            {logs.map((log, index) => (
                                <div key={index} className="text-sm font-mono">
                                    {log}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginDebug;
