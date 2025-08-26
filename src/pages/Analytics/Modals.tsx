import React from 'react';
import { WidgetConfig, AvailableWidgetType } from './types';
import { availableWidgetTypes } from './widgetUtils';

interface AddWidgetModalProps {
    showAddWidget: boolean;
    setShowAddWidget: (show: boolean) => void;
    addNewWidget: (widgetType: string, title: string) => void;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
    showAddWidget,
    setShowAddWidget,
    addNewWidget
}) => {
    if (!showAddWidget) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4">
                <h3 className="text-lg font-semibold mb-4 dark:text-white-light">Add New Widget</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white-light">Widget Type</label>
                        <select
                            id="widgetType"
                            className="form-select w-full"
                            defaultValue=""
                        >
                            <option value="" disabled>Select widget type</option>
                            {availableWidgetTypes.map(widget => (
                                <option key={widget.type} value={widget.type}>
                                    {widget.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white-light">Widget Title</label>
                        <input
                            type="text"
                            id="widgetTitle"
                            className="form-input w-full"
                            placeholder="Enter widget title"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={() => setShowAddWidget(false)}
                        className="btn btn-outline-secondary btn-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            const type = (document.getElementById('widgetType') as HTMLSelectElement).value;
                            const title = (document.getElementById('widgetTitle') as HTMLInputElement).value;
                            if (type && title) {
                                addNewWidget(type, title);
                            }
                        }}
                        className="btn btn-primary btn-sm"
                    >
                        Add Widget
                    </button>
                </div>
            </div>
        </div>
    );
};

interface EditWidgetModalProps {
    editingWidget: WidgetConfig | null;
    setEditingWidget: (widget: WidgetConfig | null) => void;
    updateWidgetTitle: (widgetId: string, newTitle: string) => void;
    updateWidgetSize: (widgetId: string, newSize: 'small' | 'medium' | 'large') => void;
    setWidgets: React.Dispatch<React.SetStateAction<WidgetConfig[]>>;
    setGridKey: React.Dispatch<React.SetStateAction<number>>;
}

export const EditWidgetModal: React.FC<EditWidgetModalProps> = ({
    editingWidget,
    setEditingWidget,
    updateWidgetTitle,
    updateWidgetSize,
    setWidgets,
    setGridKey
}) => {
    if (!editingWidget) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4">
                <h3 className="text-lg font-semibold mb-4 dark:text-white-light">Edit Widget</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white-light">Widget Title</label>
                        <input
                            type="text"
                            className="form-input w-full"
                            value={editingWidget.title}
                            onChange={(e) => setEditingWidget({...editingWidget, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white-light">Widget Size</label>
                        <select
                            className="form-select w-full"
                            value={editingWidget.size}
                            onChange={(e) => setEditingWidget({...editingWidget, size: e.target.value as 'small' | 'medium' | 'large'})}
                        >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white-light">Column Width</label>
                        <select
                            className="form-select w-full"
                            value={editingWidget.customWidth || 1}
                            onChange={(e) => setEditingWidget({
                                ...editingWidget,
                                customWidth: parseInt(e.target.value)
                            })}
                        >
                            <option value={1}>Small Width (260px) - 4 per row</option>
                            <option value={2}>Medium Width (520px) - 2 per row</option>
                            <option value={3}>Large Width (1040px) - 1 per row</option>
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Overrides the widget size setting. Row max width: 1040px
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold">
                            Current: {(() => {
                                const width = editingWidget.customWidth || 1;
                                let label: string;
                                let pixels: string;
                                switch (width) {
                                    case 1: label = 'Small Width'; pixels = '260px'; break;
                                    case 2: label = 'Medium Width'; pixels = '520px'; break;
                                    case 3: label = 'Large Width'; pixels = '1040px'; break;
                                    default: label = 'Small Width'; pixels = '260px'; break;
                                }
                                return `${label} (${pixels})`;
                            })()}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="widgetVisible"
                            className="form-checkbox mr-2"
                            checked={editingWidget.visible}
                            onChange={(e) => setEditingWidget({...editingWidget, visible: e.target.checked})}
                        />
                        <label htmlFor="widgetVisible" className="text-sm dark:text-white-light">Visible</label>
                    </div>
                    {(editingWidget.customWidth || editingWidget.customHeight) && (
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Custom Dimensions:</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingWidget({
                                        ...editingWidget,
                                        customWidth: undefined,
                                        customHeight: undefined
                                    })}
                                    className="btn btn-outline-warning btn-sm"
                                >
                                    Reset Size
                                </button>
                                <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                                    {editingWidget.customWidth && (() => {
                                        let pixelWidth: string;
                                        switch (editingWidget.customWidth) {
                                            case 1: pixelWidth = '260px'; break;
                                            case 2: pixelWidth = '520px'; break;
                                            case 3: pixelWidth = '1040px'; break;
                                            default: pixelWidth = '260px'; break;
                                        }
                                        return `Width: ${pixelWidth}`;
                                    })()}
                                    {editingWidget.customWidth && editingWidget.customHeight && ' • '}
                                    {editingWidget.customHeight && `Height: ${editingWidget.customHeight}px`}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={() => setEditingWidget(null)}
                        className="btn btn-outline-secondary btn-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            // Debug log before changes
                            console.log(`Saving widget ${editingWidget.id} with width: ${editingWidget.customWidth}`);

                            updateWidgetTitle(editingWidget.id, editingWidget.title);
                            updateWidgetSize(editingWidget.id, editingWidget.size);

                            // Update visibility and custom width based on form values
                            setWidgets(prev => {
                                const updated = prev.map(widget =>
                                    widget.id === editingWidget.id
                                        ? {
                                            ...widget,
                                            visible: editingWidget.visible,
                                            customWidth: editingWidget.customWidth
                                        }
                                        : widget
                                );
                                console.log('Updated widgets:', updated);
                                return updated;
                            });

                            setEditingWidget(null);

                            // Force immediate grid re-render
                            setGridKey(prev => prev + 1);

                            // Additional force re-render after a short delay
                            setTimeout(() => {
                                const gridContainer = document.querySelector('.grid') as HTMLElement;
                                if (gridContainer) {
                                    gridContainer.style.display = 'none';
                                    setTimeout(() => {
                                        gridContainer.style.display = 'grid';
                                        console.log('Grid re-rendered');
                                    }, 10);
                                }
                            }, 50);
                        }}
                        className="btn btn-primary btn-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
