import { WidgetConfig, AvailableWidgetType } from './types';
import { getCurrencyConfig } from '../../utils/currencyUtils';

// Available widget types for adding
export const availableWidgetTypes: AvailableWidgetType[] = [
    { type: 'statistics', title: 'Statistics Widget' },
    { type: 'expenses', title: 'Expenses Widget' },
    { type: 'garnishment', title: 'Garnishment Widget' },
    { type: 'chart', title: 'Chart Widget' },
    { type: 'activity', title: 'Activity Log Widget' },
    { type: 'browsers', title: 'Browser Stats Widget' },
    { type: 'followers', title: 'Followers Widget' },
    { type: 'referral', title: 'Referral Widget' },
    { type: 'engagement', title: 'Engagement Widget' },
    { type: 'testimonial', title: 'Testimonial Widget' },
    { type: 'event', title: 'Event Widget' },
    { type: 'project', title: 'Project Widget' },
    { type: 'calendar', title: 'Calendar Widget' },
];

// Default widgets configuration
export const getDefaultWidgets = (): WidgetConfig[] => [
    { id: 'statistics', type: 'statistics', title: 'Statistics', visible: true, position: 0, size: 'small' },
    { id: 'expenses', type: 'expenses', title: 'Calculated Expenses', visible: true, position: 1, size: 'medium' },
    { id: 'garnishment', type: 'garnishment', title: 'Total Garnishment Amount', visible: true, position: 2, size: 'large' },
    { id: 'chart', type: 'chart', title: 'Garnishment Calculations Vs Paychecks', visible: true, position: 3, size: 'large' },
    { id: 'activity', type: 'activity', title: 'Activity Log', visible: true, position: 4, size: 'medium' },
    { id: 'browsers', type: 'browsers', title: 'Visitors by Browser', visible: true, position: 5, size: 'medium' },
    { id: 'followers', type: 'followers', title: 'Followers', visible: true, position: 6, size: 'small' },
    { id: 'referral', type: 'referral', title: 'Referral', visible: true, position: 7, size: 'small' },
    { id: 'engagement', type: 'engagement', title: 'Engagement', visible: true, position: 8, size: 'small' },
    { id: 'testimonial', type: 'testimonial', title: 'Testimonial', visible: true, position: 9, size: 'medium' },
    { id: 'event', type: 'event', title: 'Event', visible: true, position: 10, size: 'medium' },
    { id: 'project', type: 'project', title: 'Project', visible: true, position: 11, size: 'medium' },
];

// Widget utility functions
export const getWidgetSizeClasses = (widget: WidgetConfig) => {
    switch (widget.size) {
        case 'small':
            return 'col-span-1 sm:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1';
        case 'medium':
            return 'col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-1 2xl:col-span-1';
        case 'large':
            return 'col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2';
        default:
            return 'col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-1 2xl:col-span-1';
    }
};

export const getWidgetStyle = (widget: WidgetConfig) => {
    const style: React.CSSProperties = {};

    // Apply custom height if available
    if (widget.customHeight) {
        style.height = `${widget.customHeight}px`;
    }

    // Apply responsive width instead of fixed pixel widths
    if (widget.customWidth) {
        switch (widget.customWidth) {
            case 1:
                style.flex = '1 1 300px'; // Small: flexible, min 300px
                style.minWidth = '300px';
                break;
            case 2:
                style.flex = '2 1 500px'; // Medium: takes 2x space, min 500px
                style.minWidth = '500px';
                break;
            case 3:
                style.flex = '1 1 100%'; // Large: full width
                style.width = '100%';
                break;
            default:
                style.flex = '1 1 300px';
                style.minWidth = '300px';
                break;
        }
        style.flexShrink = 0; // Prevent shrinking
    }

    return style;
};

export const getWidgetClasses = (widget: WidgetConfig) => {
    let classes = 'panel h-full group relative shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border border-white/30 dark:border-gray-700/30';

    // Add specific classes for custom width
    if (widget.customWidth) {
        classes += ' flex-shrink-0';
    }

    return classes;
};

// Get responsive row width based on screen size
export const getResponsiveRowWidth = () => {
    if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 640) return width - 32; // Mobile: full width minus padding
        if (width < 1024) return width - 64; // Tablet: full width minus padding
        if (width < 1280) return 1200; // Desktop: max 1200px
        return 1400; // Large screens: max 1400px
    }
    return 1200; // Default fallback
};

// Get equal width for 3 columns (no longer needed with fixed widths)
export const getEqualWidth = () => {
    return 260; // Fixed small width
};

// Calculate available width for widgets in a row (responsive max width)
export const calculateAvailableWidth = (widgets: WidgetConfig[], currentIndex: number) => {
    const ROW_MAX_WIDTH = getResponsiveRowWidth();
    let usedWidth = 0;
    let currentRowWidth = 0;

    // Calculate how much width is used in the current row up to this widget
    for (let i = 0; i <= currentIndex; i++) {
        const widget = widgets[i];
        if (widget.customWidth) {
            let widgetWidth: number;

            // Width system (same logic as getWidgetStyle)
            switch (widget.customWidth) {
                case 1: widgetWidth = 260; break;        // Small width (260px)
                case 2: widgetWidth = 520; break;        // Medium width (520px)
                case 3: widgetWidth = 1040; break;       // Large width (1040px)
                default: widgetWidth = 260; break;       // Default to small width
            }

            currentRowWidth += widgetWidth;

            // If this widget would exceed row width, start a new row
            if (currentRowWidth > ROW_MAX_WIDTH) {
                currentRowWidth = widgetWidth; // Start new row with this widget
                usedWidth = 0;
            } else {
                usedWidth = currentRowWidth;
            }
        }
    }

    return ROW_MAX_WIDTH - usedWidth;
};

// Organize widgets into rows based on responsive flex layout
export const organizeWidgetsIntoRows = (widgets: WidgetConfig[]) => {
    const rows: WidgetConfig[][] = [];
    let currentRow: WidgetConfig[] = [];
    let currentRowFlex = 0;

    widgets.forEach(widget => {
        let widgetFlex = 1; // Default small width

        if (widget.customWidth) {
            switch (widget.customWidth) {
                case 1: widgetFlex = 1; break;   // Small: 1 flex unit
                case 2: widgetFlex = 2; break;   // Medium: 2 flex units
                case 3: widgetFlex = 4; break;   // Large: 4 flex units (full row)
                default: widgetFlex = 1; break;
            }
        }

        // If this is a large widget (flex >= 4) or adding it would exceed 4 flex units, start new row
        if (widgetFlex >= 4 || (currentRowFlex + widgetFlex) > 4) {
            if (currentRow.length > 0) {
                rows.push([...currentRow]);
            }
            currentRow = [widget];
            currentRowFlex = widgetFlex;
        } else {
            currentRow.push(widget);
            currentRowFlex += widgetFlex;
        }
    });

    // Add the last row if it has widgets
    if (currentRow.length > 0) {
        rows.push(currentRow);
    }

    return rows;
};

// Get user-specific storage key
export const getUserStorageKey = () => {
    const userId = localStorage.getItem('user-id') || 'default-user';
    return `analytics-widgets-${userId}`;
};

// Get currency configuration
export const getCurrencySymbol = () => {
    return getCurrencyConfig().symbol;
};
