import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../../contexts/ApiService';
import JsonTableRender from '../TableRender/JsonTableRender';
import { IconTable, IconRefresh, IconPlayerPlay } from '@tabler/icons-react';
import CopyToClipboardButton from '../TableRender/CopyToClipboardButton';

interface CalculationResult {
    success: boolean;
    data?: any;
    message?: string;
    // Add other fields based on your API response structure
}

const JsonRun: React.FC = () => {
    const { t } = useTranslation();
    const [jsonInput, setJsonInput] = useState('');
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showTableView, setShowTableView] = useState(false);

    const handleReset = () => {
        setJsonInput('');
        setError('');
        setResult(null);
        setShowTableView(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResult(null);
        
        try {
            // Validate JSON
            const parsedJson = JSON.parse(jsonInput);
            
            // Call the API to process the JSON
            const response = await apiService.calculateGarnishment(parsedJson);
            
            // Format the response for display
            setResult({
                success: true,
                data: response,
                message: 'Calculation completed successfully'
            });
            
        } catch (err: any) {
            const errorMessage = err.message || 'An error occurred while processing your request';
            setError(errorMessage);
            console.error('Error processing JSON:', err);
            
            // Set error result for display
            setResult({
                success: false,
                message: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="panel">
            <h2 className="text-xl font-bold mb-6">{t('JSON Processor')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        {t('Enter JSON')}
                    </label>
                    <textarea
                        id="jsonInput"
                        className="form-textarea min-h-[200px] w-full"
                        placeholder='{"key": "value"}'
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                
                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}
                
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={isLoading}
                        className="btn btn-outline-primary flex items-center"
                    >
                        <IconRefresh className="w-4 h-4 mr-2" />
                        {t('Reset')}
                    </button>
                    
                    <button
                        type="submit"
                        className="btn btn-primary flex items-center"
                        disabled={isLoading || !jsonInput.trim()}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('Processing...')}
                            </>
                        ) : (
                            <>
                                <IconPlayerPlay className="w-4 h-4 mr-2" />
                                {t('Process JSON')}
                            </>
                        )}
                    </button>
                </div>
            </form>
            
            {result && (
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                            {result.success ? t('Result') : t('Error')}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <CopyToClipboardButton 
                                text={JSON.stringify(result, null, 2)} 
                                title={t('Copy JSON to clipboard')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowTableView(!showTableView)}
                                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                    showTableView ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                                title={showTableView ? 'Show raw JSON' : 'Show table view'}
                            >
                                <IconTable className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className={`p-4 rounded-md ${
                        result.success 
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}>
                        {result.message && (
                            <p className={`mb-4 ${result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                {result.message}
                            </p>
                        )}
                        {result.data && (
                            <div className="mt-4">
                                {showTableView ? (
                                    <JsonTableRender 
                                        data={result.data} 
                                        className="bg-white dark:bg-gray-800 rounded border"
                                    />
                                ) : (
                                    <div>
                                        <h4 className="font-medium mb-2">Details:</h4>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm">
                                            <code>{JSON.stringify(result.data, null, 2)}</code>
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JsonRun;
