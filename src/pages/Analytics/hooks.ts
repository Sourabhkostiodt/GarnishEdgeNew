import { useState, useEffect, useCallback } from 'react';
import { WidgetConfig, ResizeStart, ResizeIndicator } from './types';
import { getDefaultWidgets, getUserStorageKey, getResponsiveRowWidth } from './widgetUtils';

export const useWidgetManagement = () => {
    const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
        const userId = localStorage.getItem('user-id') || 'default-user';
        const storageKey = `analytics-widgets-${userId}`;

        const savedWidgets = localStorage.getItem(storageKey);
        if (savedWidgets) {
            return JSON.parse(savedWidgets);
        }
        return getDefaultWidgets();
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [showAddWidget, setShowAddWidget] = useState(false);
    const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);
    const [showHiddenWidgets, setShowHiddenWidgets] = useState(false);
    const [gridKey, setGridKey] = useState(0);

    // Save widgets to localStorage whenever they change
    useEffect(() => {
        const userId = localStorage.getItem('user-id') || 'default-user';
        const storageKey = `analytics-widgets-${userId}`;

        localStorage.setItem(storageKey, JSON.stringify(widgets));
        setGridKey(prev => prev + 1);
    }, [widgets]);

    // Handle window resize for responsive layout
    useEffect(() => {
        const handleResize = () => {
            setGridKey(prev => prev + 1);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        if (isEditMode) {
            setShowAddWidget(false);
            setEditingWidget(null);
        }
    };

    const toggleWidgetVisibility = (widgetId: string) => {
        setWidgets(prev => prev.map(widget =>
            widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
        ));
    };

    const removeWidget = (widgetId: string) => {
        setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
    };

    const updateWidgetPosition = (widgetId: string, newPosition: number) => {
        setWidgets(prev => {
            const updated = [...prev];
            const widgetIndex = updated.findIndex(w => w.id === widgetId);
            if (widgetIndex !== -1) {
                updated[widgetIndex] = { ...updated[widgetIndex], position: newPosition };

                const sortedWidgets = updated.sort((a, b) => a.position - b.position);

                return sortedWidgets.map((widget, index) => ({
                    ...widget,
                    position: index
                }));
            }
            return updated;
        });
    };

    const updateWidgetSize = (widgetId: string, newSize: 'small' | 'medium' | 'large') => {
        setWidgets(prev => prev.map(widget =>
            widget.id === widgetId ? { ...widget, size: newSize } : widget
        ));
    };

    const updateWidgetTitle = (widgetId: string, newTitle: string) => {
        setWidgets(prev => prev.map(widget =>
            widget.id === widgetId ? { ...widget, title: newTitle } : widget
        ));
    };

    const addNewWidget = (widgetType: string, title: string) => {
        const newWidget: WidgetConfig = {
            id: `${widgetType}-${Date.now()}`,
            type: widgetType,
            title: title,
            visible: true,
            position: widgets.length,
            size: 'medium'
        };
        setWidgets(prev => [...prev, newWidget]);
        setShowAddWidget(false);
    };

    const getDisplayWidgets = () => {
        if (showHiddenWidgets) {
            return widgets;
        }
        return widgets.filter(widget => widget.visible);
    };

    const getWidgetsInOrder = () => {
        return getDisplayWidgets().sort((a, b) => a.position - b.position);
    };

    return {
        widgets,
        setWidgets,
        isEditMode,
        setIsEditMode,
        showAddWidget,
        setShowAddWidget,
        editingWidget,
        setEditingWidget,
        showHiddenWidgets,
        setShowHiddenWidgets,
        gridKey,
        setGridKey,
        toggleEditMode,
        toggleWidgetVisibility,
        removeWidget,
        updateWidgetPosition,
        updateWidgetSize,
        updateWidgetTitle,
        addNewWidget,
        getDisplayWidgets,
        getWidgetsInOrder
    };
};

export const useResizeManagement = () => {
    const [resizingWidget, setResizingWidget] = useState<string | null>(null);
    const [resizeStart, setResizeStart] = useState<ResizeStart>({ x: 0, y: 0, width: 0, height: 0 });
    const [resizeIndicator, setResizeIndicator] = useState<ResizeIndicator>({ width: 0, height: 0 });

    const startResize = (e: React.MouseEvent, widgetId: string, widgets: WidgetConfig[]) => {
        e.preventDefault();
        e.stopPropagation();

        const widget = widgets.find(w => w.id === widgetId);
        if (!widget) return;

        const currentWidth = widget.customWidth || (widget.size === 'small' ? 1 : widget.size === 'large' ? 2 : 1);
        const currentHeight = widget.customHeight || 300;

        setResizingWidget(widgetId);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: currentWidth,
            height: currentHeight
        });
    };

    const handleResize = useCallback((e: MouseEvent, widgets: WidgetConfig[], setWidgets: React.Dispatch<React.SetStateAction<WidgetConfig[]>>) => {
        if (!resizingWidget) return;

        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        const sensitivity = 50;
        const calculatedWidth = Math.round(resizeStart.width + deltaX / sensitivity);
        const newWidth = calculatedWidth >= 2 ? 2 : 1;

        const newHeight = Math.max(200, resizeStart.height + deltaY);

        setResizeIndicator({ width: newWidth, height: newHeight });

        const currentWidgets = widgets;
        const rows = organizeWidgetsIntoRows(currentWidgets);
        let targetRowIndex = -1;

        for (let i = 0; i < rows.length; i++) {
            const widgetIndex = rows[i].findIndex(w => w.id === resizingWidget);
            if (widgetIndex !== -1) {
                targetRowIndex = i;
                break;
            }
        }

        setWidgets(prev => prev.map(widget => {
            if (widget.id === resizingWidget) {
                return { ...widget, customWidth: newWidth, customHeight: newHeight };
            }

            if (targetRowIndex !== -1 && rows[targetRowIndex]?.some(rowWidget => rowWidget.id === widget.id)) {
                if (newHeight > 250) {
                    return { ...widget, customHeight: newHeight };
                }
            }

            return widget;
        }));

        const gridContainer = document.querySelector('.grid') as HTMLElement;
        if (gridContainer) {
            gridContainer.style.display = 'none';
            setTimeout(() => {
                gridContainer.style.display = 'grid';
            }, 10);
        }

        console.log(`Resizing widget ${resizingWidget}: ${newWidth} cols × ${newHeight}px`);
        if (targetRowIndex !== -1) {
            console.log(`Applied height change to row ${targetRowIndex} widgets`);
        }
    }, [resizingWidget, resizeStart]);

    const stopResize = useCallback(() => {
        setResizingWidget(null);
        setResizeIndicator({ width: 0, height: 0 });
    }, []);

    return {
        resizingWidget,
        resizeIndicator,
        startResize,
        handleResize,
        stopResize
    };
};

export const useDragAndDrop = () => {
    const [dragOverWidget, setDragOverWidget] = useState<string | null>(null);
    const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    return {
        dragOverWidget,
        setDragOverWidget,
        draggedWidget,
        setDraggedWidget,
        isDragging,
        setIsDragging
    };
};

// Helper function for organizing widgets into rows
const organizeWidgetsIntoRows = (widgets: WidgetConfig[]) => {
    const ROW_MAX_WIDTH = getResponsiveRowWidth();
    const GAP_WIDTH = 16;
    const rows: WidgetConfig[][] = [];
    let currentRow: WidgetConfig[] = [];
    let currentRowWidth = 0;

    widgets.forEach(widget => {
        let widgetWidth = 260;

        if (widget.customWidth) {
            switch (widget.customWidth) {
                case 1: widgetWidth = 260; break;
                case 2: widgetWidth = 520; break;
                case 3: widgetWidth = 1040; break;
                default: widgetWidth = 260; break;
            }
        }

        const gapsNeeded = currentRow.length;
        const totalWidthWithGaps = currentRowWidth + (gapsNeeded * GAP_WIDTH) + widgetWidth;

        if (totalWidthWithGaps > ROW_MAX_WIDTH) {
            if (currentRow.length > 0) {
                rows.push([...currentRow]);
            }
            currentRow = [widget];
            currentRowWidth = widgetWidth;
        } else {
            currentRow.push(widget);
            currentRowWidth += widgetWidth;
        }
    });

    if (currentRow.length > 0) {
        rows.push(currentRow);
    }

    return rows;
};
