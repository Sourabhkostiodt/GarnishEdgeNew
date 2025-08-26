// Widget types and interfaces
export interface WidgetConfig {
    id: string;
    type: string;
    title: string;
    visible: boolean;
    position: number;
    size: 'small' | 'medium' | 'large';
    customWidth?: number; // Custom width in grid columns
    customHeight?: number; // Custom height in pixels
    config?: any;
}

export interface AvailableWidgetType {
    type: string;
    title: string;
}

export interface ResizeStart {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ResizeIndicator {
    width: number;
    height: number;
}
