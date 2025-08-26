import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconPlus from '../../components/Icon/IconPlus';
import IconEdit from '../../components/Icon/IconEdit';
import IconEye from '../../components/Icon/IconEye';
import IconTrash from '../../components/Icon/IconTrash';
import IconSettings from '../../components/Icon/IconSettings';
import TokenStatus from '../../components/TokenStatus';
import ApiTest from '../../components/ApiTest';
import RefreshCountdown from '../../components/RefreshCountdown';

// Import modular components
import { useWidgetManagement, useResizeManagement, useDragAndDrop } from './hooks';
import { organizeWidgetsIntoRows, getWidgetSizeClasses, getWidgetStyle, getWidgetClasses, calculateAvailableWidth, getResponsiveRowWidth } from './widgetUtils';
import WidgetRenderer from './WidgetRenderer';
import { AddWidgetModal, EditWidgetModal } from './Modals';

const Analytics = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Analytics Admin'));
    });

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    // Custom hooks for state management
    const {
        widgets,
        setWidgets,
        isEditMode,
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
    } = useWidgetManagement();

    const {
        resizingWidget,
        resizeIndicator,
        startResize,
        handleResize,
        stopResize
    } = useResizeManagement();

    const {
        dragOverWidget,
        setDragOverWidget,
        draggedWidget,
        setDraggedWidget,
        isDragging,
        setIsDragging
    } = useDragAndDrop();

    // Add global mouse event listeners for resize
    useEffect(() => {
        if (resizingWidget) {
            const handleMouseMove = (e: MouseEvent) => handleResize(e, widgets, setWidgets);
            const handleMouseUp = () => stopResize();

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [resizingWidget, handleResize, stopResize, widgets, setWidgets]);

    // Render edit controls for widgets
    const renderEditControls = (widget: any) => {
        if (!isEditMode) return null;

        return (
            <>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="flex gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingWidget(widget);
                            }}
                            className="btn btn-sm btn-outline-primary"
                            title="Edit Widget"
                        >
                            <IconEdit className="w-3 h-3" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleWidgetVisibility(widget.id);
                            }}
                            className={`btn btn-sm ${widget.visible ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            title={widget.visible ? "Hide Widget" : "Show Widget"}
                        >
                            <IconEye className="w-3 h-3" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeWidget(widget.id);
                            }}
                            className="btn btn-sm btn-outline-danger"
                            title="Remove Widget"
                        >
                            <IconTrash className="w-3 h-3" />
                        </button>
                    </div>
                </div>
                {/* Resize handle */}
                <div
                    className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-tl"
                    onMouseDown={(e) => startResize(e, widget.id, widgets)}
                    title="Resize Widget"
                >
                    <div className="w-full h-full flex items-end justify-end p-1">
                        <div className="w-2 h-2 border-r-2 border-b-2 border-gray-500 dark:border-gray-400"></div>
                    </div>
                </div>

                {/* Dimension indicator for custom sized widgets */}
                {(widget.customWidth || widget.customHeight) && (
                    <div className="absolute top-2 left-2 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        {widget.customWidth && (() => {
                            let pixelWidth: string;
                            switch (widget.customWidth) {
                                case 1: pixelWidth = '260px'; break;
                                case 2: pixelWidth = '520px'; break;
                                case 3: pixelWidth = '1040px'; break;
                                default: pixelWidth = '260px'; break;
                            }
                            return pixelWidth;
                        })()}
                        {widget.customWidth && widget.customHeight && ' × '}
                        {widget.customHeight && `${widget.customHeight}px`}
                    </div>
                )}

                {/* Always visible width indicator for custom width widgets */}
                {widget.customWidth && (
                    <div className="absolute top-2 right-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded font-semibold">
                        {(() => {
                            let pixelWidth: string;
                            switch (widget.customWidth) {
                                case 1: pixelWidth = '260px'; break;
                                case 2: pixelWidth = '520px'; break;
                                case 3: pixelWidth = '1040px'; break;
                                default: pixelWidth = '260px'; break;
                            }
                            return pixelWidth;
                        })()}
                    </div>
                )}

                {/* Available width indicator */}
                {widget.customWidth && (
                    <div className="absolute top-2 left-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded font-semibold">
                        Available: {calculateAvailableWidth(getDisplayWidgets(), getWidgetsInOrder().findIndex(w => w.id === widget.id))}px
                    </div>
                )}

                {/* Row width indicator */}
                {widget.customWidth && (
                    <div className="absolute bottom-2 right-2 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded font-semibold">
                        Row: {(() => {
                            const ROW_MAX_WIDTH = getResponsiveRowWidth();
                            let currentRowWidth = 0;

                            for (let i = 0; i <= getWidgetsInOrder().findIndex(w => w.id === widget.id); i++) {
                                const w = getDisplayWidgets()[i];
                                if (w.customWidth) {
                                    let widgetWidth: number;

                                    switch (w.customWidth) {
                                        case 1: widgetWidth = 260; break;
                                        case 2: widgetWidth = 520; break;
                                        case 3: widgetWidth = 1040; break;
                                        default: widgetWidth = 260; break;
                                    }

                                    currentRowWidth += widgetWidth;

                                    if (currentRowWidth > ROW_MAX_WIDTH) {
                                        currentRowWidth = widgetWidth;
                                    }
                                }
                            }
                            return `${currentRowWidth}/${ROW_MAX_WIDTH}px`;
                        })()}
                    </div>
                )}
            </>
        );
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Analytics</span>
                </li>
            </ul>

            {/* Widget Management Controls */}
            <div className="pt-5 mb-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold dark:text-white-light">Analytics Dashboard</h2>
                    <div className="flex items-center gap-2">
                        {widgets.filter(w => !w.visible).length > 0 && (
                            <button
                                onClick={() => setShowHiddenWidgets(!showHiddenWidgets)}
                                className={`btn btn-sm ${showHiddenWidgets ? 'btn-warning' : 'btn-outline-warning'}`}
                            >
                                <IconEye className="w-4 h-4 mr-2" />
                                {showHiddenWidgets ? 'Hide Hidden Widgets' : `Show Hidden (${widgets.filter(w => !w.visible).length})`}
                            </button>
                        )}
                        {isEditMode && (
                            <button
                                onClick={() => setShowAddWidget(true)}
                                className="btn btn-primary btn-sm"
                            >
                                <IconPlus className="w-4 h-4 mr-2" />
                                Add Widget
                            </button>
                        )}
                        <button
                            onClick={toggleEditMode}
                            className={`${isEditMode ? 'btn btn-sm btn-danger' : 'block p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300'}`}
                            title={isEditMode ? 'Exit Edit Mode' : 'Edit Dashboard'}
                        >
                            <IconSettings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {isEditMode && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            Edit Mode: Click on widgets to edit, hide, or remove them. Drag to reorder.
                        </p>
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Visible: {widgets.filter(w => w.visible).length}</span>
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Hidden: {widgets.filter(w => !w.visible).length}</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Total: {widgets.length}</span>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">User: {localStorage.getItem('user-id') || 'default-user'}</span>
                            {widgets.filter(w => w.customWidth || w.customHeight).length > 0 && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    Custom Size: {widgets.filter(w => w.customWidth || w.customHeight).length}
                                </span>
                            )}
                            {resizingWidget && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Resizing: {resizeIndicator.width === 1 ? '1 Col' : '2 Cols'} × {resizeIndicator.height}
                                </span>
                            )}
                            {widgets.filter(w => !w.visible).length > 0 && (
                                <button
                                    onClick={() => {
                                        setWidgets(prev => prev.map(widget => ({ ...widget, visible: true })));
                                        setShowHiddenWidgets(false);
                                    }}
                                    className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors"
                                >
                                    Show All Hidden
                                </button>
                            )}
                            {widgets.filter(w => w.customWidth || w.customHeight).length > 0 && (
                                <button
                                    onClick={() => {
                                        setWidgets(prev => prev.map(widget => ({
                                            ...widget,
                                            customWidth: undefined,
                                            customHeight: undefined
                                        })));
                                    }}
                                    className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                                >
                                    Reset All Sizes
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    const userId = localStorage.getItem('user-id') || 'default-user';
                                    const storageKey = `analytics-widgets-${userId}`;
                                    localStorage.removeItem(storageKey);
                                    window.location.reload();
                                }}
                                className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                                title="Clear all saved settings for current user"
                            >
                                Clear User Settings
                            </button>
                            <button
                                onClick={() => {
                                    setWidgets(prev => prev.map(widget => ({
                                        ...widget,
                                        customWidth: widget.customWidth === 1 ? 2 : 1
                                    })));
                                }}
                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                                title="Toggle between 1 and 2 columns for all widgets"
                            >
                                Toggle Columns
                            </button>
                            <button
                                onClick={() => {
                                    setWidgets(prev => prev.map((widget, index) => ({
                                        ...widget,
                                        customWidth: 1
                                    })));
                                }}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                title="Set all widgets to 260px width (4 per row)"
                            >
                                4 per Row
                            </button>
                            <button
                                onClick={() => {
                                    setWidgets(prev => prev.map((widget, index) => ({
                                        ...widget,
                                        customWidth: 2
                                    })));
                                }}
                                className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded hover:bg-indigo-200 transition-colors"
                                title="Set all widgets to 520px width (2 per row)"
                            >
                                2 per Row
                            </button>
                            <button
                                onClick={() => {
                                    setWidgets(prev => prev.map((widget, index) => ({
                                        ...widget,
                                        customWidth: 3
                                    })));
                                }}
                                className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
                                title="Set all widgets to 1040px width (1 per row)"
                            >
                                1 per Row
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddWidgetModal
                showAddWidget={showAddWidget}
                setShowAddWidget={setShowAddWidget}
                addNewWidget={addNewWidget}
            />
            <EditWidgetModal
                editingWidget={editingWidget}
                setEditingWidget={setEditingWidget}
                updateWidgetTitle={updateWidgetTitle}
                updateWidgetSize={updateWidgetSize}
                setWidgets={setWidgets}
                setGridKey={setGridKey}
            />

            <div className="pt-2">
                {isEditMode && (
                    <div className="mt-1 mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                            <div className="w-4 h-4 bg-yellow-600 rounded-full animate-pulse"></div>
                            <span className="font-semibold">Drag & Drop Mode Active</span>
                        </div>
                        <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                            • Click and drag any widget to reorder
                            • Drop on other widgets to insert before them
                            • Drop on empty row space to add to end
                            • Visual feedback shows valid drop zones
                        </div>
                    </div>
                )}

                {/* Resize Indicator */}
                {resizingWidget && (
                    <div className="fixed top-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg z-50 text-sm">
                        <div>Width: {resizeIndicator.width} flex unit{resizeIndicator.width > 1 ? 's' : ''} • Height: {resizeIndicator.height}px</div>
                        <div className="text-xs opacity-75 mt-1">
                            Options: 1, 2, or 4 flex units
                        </div>
                    </div>
                )}

                {/* Drag and Drop Indicator */}
                {isDragging && (
                    <div className="fixed top-4 left-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl z-50 text-sm font-semibold animate-pulse">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
                            <span>Dragging Widget</span>
                        </div>
                        <div className="text-xs opacity-90 mt-1">
                            Drop to reorder • Drag over widgets to insert
                        </div>
                    </div>
                )}

                {/* Drop Zone Indicator */}
                {isDragging && !dragOverWidget && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 border-2 border-white border-dashed rounded-full animate-spin"></div>
                            <span>Drop here to add to end</span>
                        </div>
                    </div>
                )}

                <div key={gridKey} className="mb-6 w-full">
                    {organizeWidgetsIntoRows(getWidgetsInOrder()).map((row, rowIndex) => {
                        const rowFlex = row.reduce((total, widget) => {
                            let widgetFlex = 1;
                            if (widget.customWidth) {
                                switch (widget.customWidth) {
                                    case 1: widgetFlex = 1; break;
                                    case 2: widgetFlex = 2; break;
                                    case 3: widgetFlex = 4; break;
                                    default: widgetFlex = 1; break;
                                }
                            }
                            return total + widgetFlex;
                        }, 0);

                        return (
                            <div
                                key={rowIndex}
                                className="relative mb-4"
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = 'move';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragOverWidget(null);
                                    setDraggedWidget(null);
                                    setIsDragging(false);
                                    const droppedWidget = JSON.parse(e.dataTransfer.getData('text/plain'));
                                    const rowStartIndex = getWidgetsInOrder().findIndex(w => w.id === row[0].id);
                                    const newPosition = rowStartIndex + row.length;
                                    updateWidgetPosition(droppedWidget.id, newPosition);
                                }}
                            >
                                {/* Row indicator */}
                                {isEditMode && (
                                    <div className="absolute -top-6 left-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded font-medium">
                                        Row {rowIndex + 1}: {rowFlex}/4 flex units ({row.length} widget{row.length > 1 ? 's' : ''})
                                        {isDragging && (
                                            <span className="ml-2 text-blue-600 font-bold">← Drop Zone</span>
                                        )}
                                    </div>
                                )}
                                <div
                                    className="flex gap-4 flex-wrap"
                                    style={{ width: '100%' }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = 'move';
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragOverWidget(null);
                                        setDraggedWidget(null);
                                        setIsDragging(false);
                                        const droppedWidget = JSON.parse(e.dataTransfer.getData('text/plain'));
                                        const rowStartIndex = getWidgetsInOrder().findIndex(w => w.id === row[0].id);
                                        const newPosition = rowStartIndex + row.length;
                                        updateWidgetPosition(droppedWidget.id, newPosition);
                                    }}
                                >
                                    {row.map((widget, widgetIndex) => {
                                        const globalIndex = getWidgetsInOrder().findIndex(w => w.id === widget.id);
                                        const widgetClasses = `${getWidgetClasses(widget)} ${widget.customHeight ? '' : 'h-full'} ${getWidgetSizeClasses(widget)} ${isEditMode ? 'relative group cursor-pointer' : ''} ${!widget.visible ? 'opacity-75' : ''} ${resizingWidget === widget.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`;
                                        const widgetStyle = getWidgetStyle(widget);
                                        const editControls = renderEditControls(widget);

                                        return (
                                            <div
                                                key={widget.id}
                                                draggable={isEditMode}
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('text/plain', JSON.stringify(widget));
                                                    e.dataTransfer.effectAllowed = 'move';
                                                    setDraggedWidget(widget.id);
                                                    setIsDragging(true);
                                                }}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    e.dataTransfer.dropEffect = 'move';
                                                    setDragOverWidget(widget.id);
                                                }}
                                                onDragLeave={(e) => {
                                                    setDragOverWidget(null);
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    setDragOverWidget(null);
                                                    setDraggedWidget(null);
                                                    setIsDragging(false);
                                                    const droppedWidget = JSON.parse(e.dataTransfer.getData('text/plain'));
                                                    const newPosition = globalIndex;
                                                    updateWidgetPosition(droppedWidget.id, newPosition);
                                                }}
                                                className={`${!widget.visible ? 'relative' : ''} ${widget.customWidth ? 'flex-shrink-0' : 'flex-1 min-w-0'} ${
                                                    isEditMode ? 'cursor-move transition-all duration-200' : ''
                                                } ${
                                                    dragOverWidget === widget.id && draggedWidget !== widget.id ? 'ring-4 ring-blue-500 ring-opacity-75 bg-blue-50 dark:bg-blue-900/20 scale-105' : ''
                                                } ${
                                                    draggedWidget === widget.id ? 'opacity-50 scale-95 rotate-2' : ''
                                                } ${
                                                    isEditMode ? 'hover:shadow-lg hover:scale-102' : ''
                                                }`}
                                            >
                                                {!widget.visible && (
                                                    <div className="absolute top-0 left-0 right-0 bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-300 dark:border-yellow-700 px-3 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200 z-10 rounded-t-lg">
                                                        Hidden Widget
                                                    </div>
                                                )}
                                                <WidgetRenderer
                                                    widget={widget}
                                                    isEditMode={isEditMode}
                                                    isRtl={isRtl}
                                                    isDark={isDark}
                                                    editControls={editControls}
                                                    widgetClasses={widgetClasses}
                                                    widgetStyle={widgetStyle}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* System Status Panels - Bottom of Page */}
                <div className="mb-6">
                    <RefreshCountdown />
                </div>
                <div className="mb-6">
                    <TokenStatus />
                    <ApiTest />
                </div>
            </div>
        </div>
    );
};

export default Analytics;
