import React, { useState } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface CopyToClipboardButtonProps {
    text: string;
    className?: string;
    title?: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
    text,
    className = '',
    title = 'Copy to clipboard'
}) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
            title={copied ? t('Copied!') : t(title)}
            disabled={!text}
        >
            {copied ? (
                <IconCheck className="w-4 h-4 text-green-500" />
            ) : (
                <IconCopy className="w-4 h-4" />
            )}
        </button>
    );
};

export default CopyToClipboardButton;
