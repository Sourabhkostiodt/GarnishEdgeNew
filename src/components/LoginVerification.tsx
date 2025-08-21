import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { showSuccessMessage } from '../utils/notifications';

const LoginVerification: React.FC = () => {
    const { login, isLoading, user, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password123');
    const [verificationSteps, setVerificationSteps] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    const addStep = (step: string) => {
        setVerificationSteps(prev => [...prev, `${currentStep + 1}. ${step}`]);
        setCurrentStep(prev => prev + 1);
    };

    const clearSteps = () => {
        setVerificationSteps([]);
        setCurrentStep(0);
    };

    const handleTestLogin = async () => {
        try {
            clearSteps();
            addStep('Starting login verification...');
            addStep(`Using credentials: ${email} / ${password}`);

            const result = await login(email, password);
            addStep(`Login result: ${result.success ? 'SUCCESS' : 'FAILED'}`);

            if (result.success) {
                addStep('✅ Login successful!');
                addStep(`✅ Token stored: ${localStorage.getItem('authToken') ? 'YES' : 'NO'}`);
                addStep(`✅ User authenticated: ${isAuthenticated ? 'YES' : 'NO'}`);
                addStep(`✅ User data: ${JSON.stringify(user)}`);
                addStep('✅ Success message should appear in green');
                addStep('✅ Redirecting to /analytics in 1 second...');
            } else {
                addStep(`❌ Login failed: ${result.message}`);
            }
        } catch (error) {
            addStep(`❌ Error: ${error}`);
        }
    };

    const handleTestSuccessMessage = () => {
        addStep('Testing success message styling...');
        showSuccessMessage('Test success message!', '/analytics');
        addStep('✅ Success message triggered with green styling');
    };

    const handleCheckToken = () => {
        const token = localStorage.getItem('authToken');
        addStep(`Token in localStorage: ${token ? 'EXISTS' : 'NOT FOUND'}`);
        if (token) {
            addStep(`Token preview: ${token.substring(0, 20)}...`);
        }
    };

    const handleCheckUser = () => {
        addStep(`User authenticated: ${isAuthenticated ? 'YES' : 'NO'}`);
        addStep(`User data: ${user ? JSON.stringify(user) : 'NONE'}`);
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Login Verification Component</h2>

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

                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={handleTestLogin}
                            disabled={isLoading}
                            className="btn btn-primary"
                        >
                            {isLoading ? 'Logging in...' : 'Test Login Flow'}
                        </button>

                        <button
                            onClick={handleTestSuccessMessage}
                            className="btn btn-success"
                        >
                            Test Success Message
                        </button>

                        <button
                            onClick={handleCheckToken}
                            className="btn btn-info"
                        >
                            Check Token
                        </button>

                        <button
                            onClick={handleCheckUser}
                            className="btn btn-warning"
                        >
                            Check User
                        </button>

                        <button
                            onClick={clearSteps}
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
                        <div><strong>Token:</strong> {localStorage.getItem('authToken') ? 'Exists' : 'None'}</div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Verification Steps</h3>
                <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                    {verificationSteps.length === 0 ? (
                        <p className="text-gray-500">No verification steps yet. Start testing to see steps here.</p>
                    ) : (
                        <div className="space-y-1">
                            {verificationSteps.map((step, index) => (
                                <div key={index} className="text-sm font-mono">
                                    {step}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginVerification;
