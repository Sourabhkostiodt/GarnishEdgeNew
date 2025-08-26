import React from 'react';
import { WidgetConfig } from './types';
import {
    StatisticsWidget,
    ExpensesWidget,
    GarnishmentWidget,
    ChartWidget,
    ActivityWidget,
    BrowsersWidget,
    FollowersWidget,
    ReferralWidget,
    EngagementWidget,
    TestimonialWidget,
    EventWidget,
    ProjectWidget,
    CalendarWidget,
    DefaultWidget
} from './WidgetComponents';

interface WidgetRendererProps {
    widget: WidgetConfig;
    isEditMode: boolean;
    isRtl: boolean;
    isDark: boolean;
    editControls: React.ReactNode;
    widgetClasses: string;
    widgetStyle: React.CSSProperties;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({
    widget,
    isEditMode,
    isRtl,
    isDark,
    editControls,
    widgetClasses,
    widgetStyle
}) => {
    const commonProps = {
        widget,
        isEditMode,
        isRtl,
        isDark,
        editControls,
        widgetClasses,
        widgetStyle
    };

    switch (widget.type) {
        case 'statistics':
            return <StatisticsWidget {...commonProps} />;
        case 'expenses':
            return <ExpensesWidget {...commonProps} />;
        case 'garnishment':
            return <GarnishmentWidget {...commonProps} />;
        case 'chart':
            return <ChartWidget {...commonProps} />;
        case 'activity':
            return <ActivityWidget {...commonProps} />;
        case 'browsers':
            return <BrowsersWidget {...commonProps} />;
        case 'followers':
            return <FollowersWidget {...commonProps} />;
        case 'referral':
            return <ReferralWidget {...commonProps} />;
        case 'engagement':
            return <EngagementWidget {...commonProps} />;
        case 'testimonial':
            return <TestimonialWidget {...commonProps} />;
        case 'event':
            return <EventWidget {...commonProps} />;
        case 'project':
            return <ProjectWidget {...commonProps} />;
        case 'calendar':
            return <CalendarWidget {...commonProps} />;
        default:
            return <DefaultWidget {...commonProps} />;
    }
};

export default WidgetRenderer;
