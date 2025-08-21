import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../../../contexts/ApiService';
import JsonTableRender from '../TableRender/JsonTableRender';
import { IconUpload, IconTable, IconFileSpreadsheet, IconCode, IconCalculator, IconRefresh } from '@tabler/icons-react';
import CopyToClipboardButton from '../TableRender/CopyToClipboardButton';

interface ApiResponse {
    success: boolean;
    data?: any;
    message?: string;
}

interface ProcessResult {
    convertedData?: any;
    calculationResult?: any;
    success: boolean;
    message?: string;
}

const ExcelRun: React.FC = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<ProcessResult | null>(null);
    const [activeTab, setActiveTab] = useState<'converted' | 'calculated'>('calculated');
    const [showTableView, setShowTableView] = useState({
        converted: false,
        calculated: false
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Check file type
            const validExtensions = ['.xlsx', '.xls', '.csv'];
            const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
            
            if (!fileExt || !validExtensions.includes(`.${fileExt}`)) {
                setError(`Unsupported file type: .${fileExt || 'unknown'}. Please upload an Excel (.xlsx, .xls) or CSV file.`);
                return;
            }
            
            // Check file size (10MB max)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (selectedFile.size > maxSize) {
                setError('File is too large. Maximum size is 10MB.');
                return;
            }
            
            setFile(selectedFile);
            setError('');
            setResult(null);
            
            console.log('File selected:', {
                name: selectedFile.name,
                type: selectedFile.type,
                size: selectedFile.size,
                lastModified: new Date(selectedFile.lastModified).toLocaleString()
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        // Double-check file type (in case it was changed after selection)
        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!fileExt || !validExtensions.includes(`.${fileExt}`)) {
            setError(`Unsupported file type: .${fileExt || 'unknown'}. Please upload an Excel (.xlsx, .xls) or CSV file.`);
            return;
        }

        // Double-check file size (in case it was changed after selection)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setError('File is too large. Maximum size is 10MB.');
            return;
        }

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            // Step 1: Convert Excel to JSON
            const convertedData = await apiService.convertExcelToJson(file);
            
            if (!convertedData) {
                throw new Error('Failed to convert Excel file: Empty response from server');
            }
            
            // Step 2: Process the converted JSON
            const calculationResult = await apiService.calculateGarnishment(convertedData);
            
            setResult({
                success: true,
                convertedData: convertedData,
                calculationResult: calculationResult,
                message: 'File processed successfully'
            });
            setActiveTab('calculated');
        } catch (err: any) {
            let errorMessage = 'An error occurred while processing the file';
            
            // Handle different types of errors
            if (err instanceof Error) {
                errorMessage = err.message;
                
                // Handle specific error cases
                if (errorMessage.includes('401')) {
                    errorMessage = 'Authentication failed. Please log in again.';
                } else if (errorMessage.includes('413')) {
                    errorMessage = 'File is too large. Please try a smaller file.';
                } else if (errorMessage.includes('415')) {
                    errorMessage = 'Unsupported file type. Please upload a valid Excel file.';
                } else if (errorMessage.includes('500')) {
                    errorMessage = 'Server error. Please try again later.';
                }
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            
            setError(errorMessage);
setResult({
                success: false,
                message: errorMessage,
                convertedData: null,
                calculationResult: null
            });
            console.error('Error processing file:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            // Check file type
            const validExtensions = ['.xlsx', '.xls', '.csv'];
            const fileExt = droppedFile.name.split('.').pop()?.toLowerCase();
            
            if (!fileExt || !validExtensions.includes(`.${fileExt}`)) {
                setError(`Unsupported file type: .${fileExt || 'unknown'}. Please upload an Excel (.xlsx, .xls) or CSV file.`);
                return;
            }
            
            // Check file size (10MB max)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (droppedFile.size > maxSize) {
                setError('File is too large. Maximum size is 10MB.');
                return;
            }
            
            setFile(droppedFile);
            setError('');
            setResult(null);
            
            console.log('File selected:', {
                name: droppedFile.name,
                type: droppedFile.type,
                size: droppedFile.size,
                lastModified: new Date(droppedFile.lastModified).toLocaleString()
            });
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleReset = () => {
        setFile(null);
        setError('');
        setResult(null);
        setActiveTab('calculated');
        setShowTableView({ converted: false, calculated: false });
        
        // Clear the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="panel">
            <h2 className="text-xl font-bold mb-6">{t('Excel Processor')}</h2>
            
            <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                />
                
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <IconFileSpreadsheet className="w-8 h-8" />
                    </div>
                    
                    {file ? (
                        <div className="text-center">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB • Click to change file
                            </p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="font-medium">Drag & drop your Excel file here</p>
                            <p className="text-sm text-gray-500">or click to browse files</p>
                            <p className="text-xs text-gray-400 mt-2">Supports: .xlsx, .xls, .csv</p>
                            <p className="text-xs text-gray-400">Max size: 10MB</p>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
                    {error}
                </div>
            )}

            <div className="mt-6 flex justify-between">
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
                    type="button"
                    onClick={handleSubmit}
                    disabled={!file || isLoading}
                    className={`btn btn-primary flex items-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
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
                            <IconUpload className="w-4 h-4 mr-2" />
                            {t('Process Excel')}
                        </>
                    )}
                </button>
            </div>

            {result && (
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                            {result.success ? t('Processing Results') : t('Error')}
                        </h3>
                    </div>

                    {result.success ? (
                        <>
                            {/* Tabs */}
                            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('converted')}
                                    className={`py-2 px-4 flex items-center ${activeTab === 'converted' 
                                        ? 'border-b-2 border-primary text-primary' 
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                >
                                    <IconCode className="w-4 h-4 mr-2" />
                                    Converted JSON
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('calculated')}
                                    className={`py-2 px-4 flex items-center ${activeTab === 'calculated' 
                                        ? 'border-b-2 border-primary text-primary' 
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                >
                                    <IconCalculator className="w-4 h-4 mr-2" />
                                    Calculation Result
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                                {result.message && (
                                    <p className="text-green-700 dark:text-green-300 mb-4">
                                        {result.message}
                                    </p>
                                )}

                                <div className="flex justify-end mb-2 space-x-2">
                                    <CopyToClipboardButton 
                                        text={JSON.stringify(
                                            activeTab === 'converted' ? result.convertedData : result.calculationResult, 
                                            null, 
                                            2
                                        )} 
                                        title={t('Copy JSON to clipboard')}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowTableView(prev => ({
                                            ...prev,
                                            [activeTab]: !prev[activeTab as keyof typeof prev]
                                        }))}
                                        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                            showTableView[activeTab as keyof typeof showTableView] 
                                                ? 'text-primary' 
                                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                        title={showTableView[activeTab as keyof typeof showTableView] ? t('Show raw JSON') : t('Show in table')}
                                    >
                                        <IconTable className="w-5 h-5" />
                                    </button>
                                </div>

                                {activeTab === 'converted' && result.convertedData && (
                                    <div className="mt-2">
                                        {showTableView.converted ? (
                                            <JsonTableRender 
                                                data={result.convertedData} 
                                                className="bg-white dark:bg-gray-800 rounded border"
                                            />
                                        ) : (
                                            <div className="overflow-auto max-h-96">
                                                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
                                                    <code>{JSON.stringify(result.convertedData, null, 2)}</code>
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'calculated' && result.calculationResult && (
                                    <div className="mt-2">
                                        {showTableView.calculated ? (
                                            <JsonTableRender 
                                                data={result.calculationResult} 
                                                className="bg-white dark:bg-gray-800 rounded border"
                                            />
                                        ) : (
                                            <div className="overflow-auto max-h-96">
                                                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
                                                    <code>{JSON.stringify(result.calculationResult, null, 2)}</code>
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-red-700 dark:text-red-300">
                                {result.message || 'An error occurred while processing the file'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExcelRun;
