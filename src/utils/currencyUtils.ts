export interface CurrencyConfig {
    currencyCode: string;
    symbol: string;
    position: 'before' | 'after';
    decimalPlaces: number;
    thousandsSeparator: string;
    decimalSeparator: string;
}

export const getCurrencyConfig = (): CurrencyConfig => {
    return {
        currencyCode: localStorage.getItem('globalCurrency') || 'USD',
        symbol: localStorage.getItem('currencySymbol') || '$',
        position: (localStorage.getItem('currencyPosition') as 'before' | 'after') || 'before',
        decimalPlaces: parseInt(localStorage.getItem('decimalPlaces') || '2'),
        thousandsSeparator: localStorage.getItem('thousandsSeparator') || ',',
        decimalSeparator: localStorage.getItem('decimalSeparator') || '.'
    };
};

export const formatCurrency = (amount: number | string, customConfig?: Partial<CurrencyConfig>): string => {
    const config = { ...getCurrencyConfig(), ...customConfig };

    // Convert to number if string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return '0';
    }

    // Format the number with proper separators
    const formattedNumber = numericAmount.toLocaleString('en-US', {
        minimumFractionDigits: config.decimalPlaces,
        maximumFractionDigits: config.decimalPlaces,
        useGrouping: true
    });

    // Replace default separators with custom ones
    let result = formattedNumber
        .replace(/,/g, config.thousandsSeparator)
        .replace(/\./g, config.decimalSeparator);

    // Add currency symbol
    if (config.position === 'before') {
        result = `${config.symbol}${result}`;
    } else {
        result = `${result}${config.symbol}`;
    }

    return result;
};

export const parseCurrency = (formattedAmount: string): number => {
    const config = getCurrencyConfig();

    // Remove currency symbol
    let cleaned = formattedAmount.replace(new RegExp(`[${config.symbol}]`, 'g'), '');

    // Replace custom separators with standard ones
    cleaned = cleaned.replace(new RegExp(`\\${config.thousandsSeparator}`, 'g'), '');
    cleaned = cleaned.replace(new RegExp(`\\${config.decimalSeparator}`, 'g'), '.');

    const result = parseFloat(cleaned);
    return isNaN(result) ? 0 : result;
};

// Predefined currency configurations
export const CURRENCY_PRESETS: Record<string, Partial<CurrencyConfig>> = {
    USD: { symbol: '$', position: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.' },
    EUR: { symbol: '€', position: 'before', decimalPlaces: 2, thousandsSeparator: '.', decimalSeparator: ',' },
    GBP: { symbol: '£', position: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.' },
    JPY: { symbol: '¥', position: 'before', decimalPlaces: 0, thousandsSeparator: ',', decimalSeparator: '.' },
    CAD: { symbol: 'C$', position: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.' },
    AUD: { symbol: 'A$', position: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.' },
    CHF: { symbol: 'CHF', position: 'before', decimalPlaces: 2, thousandsSeparator: "'", decimalSeparator: '.' },
    CNY: { symbol: '¥', position: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.' },
    INR: { symbol: '₹', position: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.' },
    MXN: { symbol: '$', position: 'before', decimalPlaces: 2, thousandsSeparator: ',', decimalSeparator: '.' }
};

// Auto-apply currency preset when currency code changes
export const applyCurrencyPreset = (currencyCode: string) => {
    const preset = CURRENCY_PRESETS[currencyCode];
    if (preset) {
        Object.entries(preset).forEach(([key, value]) => {
            localStorage.setItem(key === 'currencyCode' ? 'globalCurrency' : key, String(value));
        });
    }
};
