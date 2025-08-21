import { useState } from 'react';

const IWOProcess = () => {
    const [file, setFile] = useState<File | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(selectedFile));
            } else {
                setPreviewUrl(null);
            }
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // TODO: Handle file upload logic here
    };

    return (
        <div className="w-full mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Instructions/Info Panel */}
            <div className="panel p-4 bg-blue-100 dark:bg-blue-900/10 rounded-xl shadow-sm flex items-center gap-3">
                <svg className="w-8 h-8 text-primary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 8v.01" /></svg>
                <div>
                    <div className="font-semibold text-lg mb-1">How to Submit an IWO</div>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                        <li>Upload your Income Withholding Order (IWO) as a PDF, Word, or image file.</li>
                        <li>Preview images before submitting. For other files, verify the file name.</li>
                        <li>After submitting, your file will appear in the Recent Uploads section below.</li>
                    </ul>
                </div>
            </div>

            {/* Status Summary */}
            <div className="panel p-4 flex flex-wrap gap-x-16 gap-y-4 justify-center items-center bg-white dark:bg-[#232a3b] rounded-xl shadow-sm">
                <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Active IWOs</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-green-600">5</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-yellow-500">1</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pending Review</div>
                </div>
            </div>

            {/* Main Upload Form */}
            <div className="panel p-4 bg-white dark:bg-[#20263c] rounded-xl shadow-sm col-span-full">
                <h2 className="text-xl font-bold mb-4 text-center">IWO Process</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="iwo-file" className="block mb-1 font-semibold">Upload IWO File</label>
                        <label
                            htmlFor="iwo-file"
                            className={`block w-full border-2 border-dashed rounded cursor-pointer p-6 text-center transition-colors ${previewUrl ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#232a3b]'}`}
                            onDragOver={e => e.preventDefault()}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="mx-auto mb-2 max-h-40 rounded shadow" />
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <svg className="w-12 h-12 mb-2 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Drag & Drop or Click to Upload</span>
                                </div>
                            )}
                            <input
                                id="iwo-file"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                                onChange={handleFileChange}
                                className="hidden"
                                required
                            />
                        </label>
                        {file && (
                            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">Selected file: {file.name}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary-dark transition"
                    >
                        Submit
                    </button>
                    {submitted && file && (
                        <div className="mt-3 text-green-600 font-semibold text-center text-sm">
                            IWO file submitted: {file.name}
                        </div>
                    )}
                </form>
            </div>

            {/* Recent Uploads Table */}
            <div className="panel p-4 bg-white dark:bg-[#232a3b] rounded-xl shadow-sm">
                <div className="font-semibold mb-2">Recent Uploads</div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-[#232a3b]">
                                <th className="p-2 border">File Name</th>
                                <th className="p-2 border">Date</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2 border">iwo_sample.pdf</td>
                                <td className="p-2 border">2025-08-01</td>
                                <td className="p-2 border text-green-600">Processed</td>
                            </tr>
                            <tr>
                                <td className="p-2 border">iwo_image.png</td>
                                <td className="p-2 border">2025-08-03</td>
                                <td className="p-2 border text-yellow-600">Pending</td>
                            </tr>
                            <tr>
                                <td className="p-2 border">wage_garnishment.docx</td>
                                <td className="p-2 border">2025-08-04</td>
                                <td className="p-2 border text-green-600">Processed</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAQ Accordion */}
            <div className="panel p-4 bg-white dark:bg-[#20263c] rounded-xl shadow-sm">
                <div className="font-semibold mb-3">Frequently Asked Questions</div>
                <details className="mb-2">
                    <summary className="cursor-pointer font-semibold">What is an IWO?</summary>
                    <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">An Income Withholding Order (IWO) is a court order to withhold income for child support or other obligations.</div>
                </details>
                <details className="mb-2">
                    <summary className="cursor-pointer font-semibold">What file types are supported?</summary>
                    <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">You can upload PDF, Word, or common image files (JPG, PNG).</div>
                </details>
                <details>
                    <summary className="cursor-pointer font-semibold">How do I check my submission status?</summary>
                    <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">Check the Recent Uploads section above for the current status of your files.</div>
                </details>
            </div>
        </div>
    );
};

export default IWOProcess;
