import React from 'react';
import ReactApexChart from 'react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../../components/Dropdown';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconTrendingUp from '../../components/Icon/IconTrendingUp';
import IconPlus from '../../components/Icon/IconPlus';
import IconCreditCard from '../../components/Icon/IconCreditCard';
import IconUsersGroup from '../../components/Icon/IconUsersGroup';
import IconLink from '../../components/Icon/IconLink';
import IconChatDots from '../../components/Icon/IconChatDots';
import IconThumbUp from '../../components/Icon/IconThumbUp';
import IconCaretsDown from '../../components/Icon/IconCaretsDown';
import IconSquareCheck from '../../components/Icon/IconSquareCheck';
import IconClock from '../../components/Icon/IconClock';
import IconArrowLeft from '../../components/Icon/IconArrowLeft';
import IconChrome from '../../components/Icon/IconChrome';
import { WidgetConfig } from './types';
import {
    totalVisit,
    paidVisit,
    uniqueVisitorSeries,
    followers,
    referral,
    engagement
} from './chartConfigs';
import { getCurrencySymbol } from './widgetUtils';

interface WidgetComponentProps {
    widget: WidgetConfig;
    isEditMode: boolean;
    isRtl: boolean;
    isDark: boolean;
    editControls: React.ReactNode;
    widgetClasses: string;
    widgetStyle: React.CSSProperties;
}

export const StatisticsWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    isRtl,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={widgetClasses} style={widgetStyle}>
        {editControls}
        <div className="flex justify-between dark:text-white-light mb-5">
            <h5 className="font-semibold text-lg">{widget.title}</h5>
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    btnClassName="hover:text-primary"
                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                >
                    <ul>
                        <li><button type="button">This Week</button></li>
                        <li><button type="button">Last Week</button></li>
                        <li><button type="button">This Month</button></li>
                        <li><button type="button">Last Month</button></li>
                    </ul>
                </Dropdown>
            </div>
        </div>
        <div className={`grid gap-8 text-sm text-[#515365] font-bold ${widget.customWidth === 2 ? 'grid-cols-2' : 'sm:grid-cols-2'}`}>
            <div>
                <div>
                    <div>Total Clients</div>
                    <div className="text-[#f8538d] text-lg">42</div>
                </div>
                <ReactApexChart series={totalVisit.series} options={totalVisit.options} type="line" height={58} className="overflow-hidden" />
            </div>
            <div>
                <div>
                    <div>Total Employees</div>
                    <div className="text-[#f8538d] text-lg">7,929</div>
                </div>
                <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={58} className="overflow-hidden" />
            </div>
        </div>
    </div>
);

export const ExpensesWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    isRtl,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={widgetClasses} style={widgetStyle}>
        {editControls}
        <div className="flex justify-between dark:text-white-light mb-5">
            <h5 className="font-semibold text-lg">{widget.title}</h5>
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    btnClassName="hover:text-primary"
                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                >
                    <ul>
                        <li><button type="button">This Week</button></li>
                        <li><button type="button">Last Week</button></li>
                        <li><button type="button">This Month</button></li>
                        <li><button type="button">Last Month</button></li>
                    </ul>
                </Dropdown>
            </div>
        </div>
        <div className="text-[#e95f2b] text-3xl font-bold my-10">
            <span>{getCurrencySymbol()} 45,141 </span>
            <span className="text-black text-sm dark:text-white-light ltr:mr-2 rtl:ml-2">this week</span>
            <IconTrendingUp className="text-success inline" />
        </div>
        <div className="flex items-center justify-between">
            <div className="w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-dark-light/10">
                <div
                    className="bg-gradient-to-r from-[#4361ee] to-[#805dca] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                    style={{ width: '65%' }}
                ></div>
            </div>
            <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">57%</span>
        </div>
    </div>
);

export const GarnishmentWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div
        className={`${widgetClasses} overflow-hidden before:bg-[#1937cc] before:absolute before:-right-44 before:top-0 before:bottom-0 before:m-auto before:rounded-full before:w-96 before:h-96 grid grid-cols-1 content-between`}
        style={{ background: 'linear-gradient(0deg,#00c6fb -227%,#005bea)', ...widgetStyle }}
    >
        {editControls}
        <div className="flex items-start justify-between text-white-light mb-16 z-[7]">
            <h5 className="font-semibold text-lg">{widget.title}</h5>
            <div className="relative text-xl whitespace-nowrap">
                {getCurrencySymbol()} 41,741.42
                <span className="table text-[#d3d3d3] bg-[#4361ee] rounded p-1 text-xs mt-1 ltr:ml-auto rtl:mr-auto">+ 2453</span>
            </div>
        </div>
        <div className="flex items-center justify-between z-10">
            <div className="flex items-center justify-between">
                <button type="button" className="shadow-[0_0_2px_0_#bfc9d4] rounded p-1 text-white-light hover:bg-[#1937cc] place-content-center ltr:mr-2 rtl:ml-2">
                    <IconPlus />
                </button>
                <button type="button" className="shadow-[0_0_2px_0_#bfc9d4] rounded p-1 text-white-light hover:bg-[#1937cc] grid place-content-center">
                    <IconCreditCard />
                </button>
            </div>
            <button type="button" className="shadow-[0_0_2px_0_#bfc9d4] rounded p-1 text-white-light hover:bg-[#4361ee] z-10">
                Upgrade
            </button>
        </div>
    </div>
);

export const ChartWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    isRtl,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={`${widgetClasses} p-0`} style={widgetStyle}>
        {editControls}
        <div className="flex items-start justify-between dark:text-white-light mb-5 p-5 border-b border-white-light dark:border-[#1b2e4b]">
            <h5 className="font-semibold text-lg">{widget.title}</h5>
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    btnClassName="hover:text-primary"
                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                >
                    <ul>
                        <li><button type="button">View</button></li>
                        <li><button type="button">Update</button></li>
                        <li><button type="button">Delete</button></li>
                    </ul>
                </Dropdown>
            </div>
        </div>
        <ReactApexChart options={uniqueVisitorSeries.options} series={uniqueVisitorSeries.series} type="bar" height={360} className="overflow-hidden" />
    </div>
);

export const ActivityWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    isRtl,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={widgetClasses} style={widgetStyle}>
        {editControls}
        <div className="flex items-start justify-between dark:text-white-light mb-5 -mx-5 p-5 pt-0 border-b border-white-light dark:border-[#1b2e4b]">
            <h5 className="font-semibold text-lg">{widget.title}</h5>
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    btnClassName="hover:text-primary"
                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                >
                    <ul>
                        <li><button type="button">View All</button></li>
                        <li><button type="button">Mark as Read</button></li>
                    </ul>
                </Dropdown>
            </div>
        </div>
        <PerfectScrollbar className="perfect-scrollbar relative h-[360px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3">
            <div className="space-y-7">
                <div className="flex">
                    <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                        <div className="bg-secondary shadow shadow-secondary w-8 h-8 rounded-full flex items-center justify-center text-white">
                            <IconPlus className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h5 className="font-semibold dark:text-white-light">
                            New project created :{' '}
                            <button type="button" className="text-success">
                                [Garnishment Admin Template]
                            </button>
                        </h5>
                        <p className="text-white-dark text-xs">27 Feb, 2020</p>
                    </div>
                </div>
            </div>
        </PerfectScrollbar>
    </div>
);

export const BrowsersWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    editControls,
    widgetClasses
}) => (
    <div className={widgetClasses}>
        {editControls}
        <div className="flex items-start justify-between mb-5">
            <h5 className="font-semibold text-lg dark:text-white-light">{widget.title}</h5>
        </div>
        <div className="flex flex-col space-y-5">
            <div className="flex items-center">
                <div className="w-9 h-9">
                    <div className="bg-primary/10 text-primary rounded-xl w-9 h-9 flex justify-center items-center dark:bg-primary dark:text-white-light">
                        <IconChrome className="w-5 h-5" />
                    </div>
                </div>
                <div className="px-3 flex-initial w-full">
                    <div className="w-summary-info flex justify-between font-semibold text-white-dark mb-1">
                        <h6>Chrome</h6>
                        <p className="ltr:ml-auto rtl:mr-auto text-xs">65%</p>
                    </div>
                    <div>
                        <div className="w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:bg-dark-light/10 dark:shadow-none">
                            <div
                                className="bg-gradient-to-r from-[#009ffd] to-[#2a2a72] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                style={{ width: '65%' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const FollowersWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={`${widgetClasses} p-0`} style={widgetStyle}>
        {editControls}
        <div className="flex p-5">
            <div className="shrink-0 bg-primary/10 text-primary rounded-xl w-11 h-11 flex justify-center items-center dark:bg-primary dark:text-white-light">
                <IconUsersGroup className="w-5 h-5" />
            </div>
            <div className="ltr:ml-3 rtl:mr-3 font-semibold">
                <p className="text-xl dark:text-white-light">31.6K</p>
                <h5 className="text-[#506690] text-xs">{widget.title}</h5>
            </div>
        </div>
        <div className="h-40">
            <ReactApexChart series={followers.series} options={followers.options} type="area" height={160} className="w-full absolute bottom-0 overflow-hidden" />
        </div>
    </div>
);

export const ReferralWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={`${widgetClasses} p-0`} style={widgetStyle}>
        {editControls}
        <div className="flex p-5">
            <div className="shrink-0 bg-danger/10 text-danger rounded-xl w-11 h-11 flex justify-center items-center dark:bg-danger dark:text-white-light">
                <IconLink className="w-5 h-5" />
            </div>
            <div className="ltr:ml-3 rtl:mr-3 font-semibold">
                <p className="text-xl dark:text-white-light">1,900</p>
                <h5 className="text-[#506690] text-xs">{widget.title}</h5>
            </div>
        </div>
        <div className="h-40">
            <ReactApexChart series={referral.series} options={referral.options} type="area" height={160} className="w-full absolute bottom-0 overflow-hidden" />
        </div>
    </div>
);

export const EngagementWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={`${widgetClasses} p-0`} style={widgetStyle}>
        {editControls}
        <div className="flex p-5">
            <div className="shrink-0 bg-success/10 text-success rounded-xl w-11 h-11 flex justify-center items-center dark:bg-success dark:text-white-light">
                <IconChatDots className="w-5 h-5" />
            </div>
            <div className="ltr:ml-3 rtl:mr-3 font-semibold">
                <p className="text-xl dark:text-white-light">18.2%</p>
                <h5 className="text-[#506690] text-xs">{widget.title}</h5>
            </div>
        </div>
        <div className="h-40">
            <ReactApexChart series={engagement.series} options={engagement.options} type="area" height={160} className="w-full absolute bottom-0 overflow-hidden" />
        </div>
    </div>
);

export const TestimonialWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={widgetClasses} style={widgetStyle}>
        {editControls}
        <div className="flex items-start border-b border-white-light dark:border-[#1b2e4b] -m-5 mb-5 p-5">
            <div className="shrink-0 ring-2 ring-white-light dark:ring-dark rounded-full ltr:mr-4 rtl:ml-4">
                <img src="/assets/images/profile-1.jpeg" alt="profile1" className="w-10 h-10 rounded-full object-cover" />
            </div>
            <div className="font-semibold">
                <h6>Jimmy Turner</h6>
                <p className="text-xs text-white-dark mt-1">Monday, Nov 18</p>
            </div>
        </div>
        <div>
            <div className="text-white-dark pb-8">
                "Duis aute irure dolor" in reprehenderit in voluptate velit esse cillum "dolore eu fugiat" nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </div>
            <div className="w-full absolute bottom-0 flex items-center justify-between p-5 -mx-5">
                <div className="flex items-center">
                    <IconThumbUp className="w-5 h-5 text-info inline ltr:mr-1.5 rtl:ml-1.5 relative -top-0.5" />
                    <span className="dark:text-info">551 Likes</span>
                </div>
                <button type="button" className="flex items-center bg-success/30 text-success rounded-md px-1.5 py-1 text-xs hover:shadow-[0_10px_20px_-10px] hover:shadow-success">
                    Read More
                    <IconCaretsDown className="w-4 h-4 rtl:rotate-90 -rotate-90 ltr:ml-1.5 rtl:mr-1.5" />
                </button>
            </div>
        </div>
    </div>
);

export const EventWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={widgetClasses} style={widgetStyle}>
        {editControls}
        <div className="flex items-center justify-between border-b border-white-light dark:border-[#1b2e4b] -m-5 mb-5 p-5">
            <div className="flex">
                <div className="media-aside align-self-start">
                    <div className="shrink-0 ring-2 ring-white-light dark:ring-dark rounded-full ltr:mr-4 rtl:ml-4">
                        <img src="/assets/images/g-8.png" alt="profile2" className="w-10 h-10 rounded-full object-cover" />
                    </div>
                </div>
                <div className="font-semibold">
                    <h6>Dev Summit - New York</h6>
                    <p className="text-xs text-white-dark mt-1">Bronx, NY</p>
                </div>
            </div>
        </div>
        <div className="font-semibold text-center pb-8">
            <div className="mb-4 text-primary">4 Members Going</div>
            <div className="flex items-center justify-center gap-3 pb-8">
                <img className="w-10 h-10 ring-2 ring-white-light dark:ring-dark rounded-lg overflow-hidden object-cover" src="/assets/images/profile-1.jpeg" alt="profile1" />
                <img className="w-10 h-10 ring-2 ring-white-light dark:ring-dark rounded-lg overflow-hidden object-cover" src="/assets/images/profile-2.jpeg" alt="profile2" />
                <img className="w-10 h-10 ring-2 ring-white-light dark:ring-dark rounded-lg overflow-hidden object-cover" src="/assets/images/profile-3.jpeg" alt="profile3" />
                <img className="w-10 h-10 ring-2 ring-white-light dark:ring-dark rounded-lg overflow-hidden object-cover" src="/assets/images/profile-4.jpeg" alt="profile4" />
            </div>
            <div className="w-full absolute bottom-0 flex items-center justify-between p-5 -mx-5">
                <button type="button" className="btn btn-secondary btn-lg w-full border-0 bg-gradient-to-r from-[#3d38e1] to-[#1e9afe]">
                    View Details
                </button>
            </div>
        </div>
    </div>
);

export const ProjectWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    isRtl,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={widgetClasses} style={widgetStyle}>
        {editControls}
        <div className="flex items-center justify-between border-b border-white-light dark:border-[#1b2e4b] -m-5 mb-5 p-5">
            <button type="button" className="flex font-semibold">
                <div className="shrink-0 bg-secondary w-10 h-10 rounded-md flex items-center justify-center text-white ltr:mr-4 rtl:ml-4">
                    <span>FD</span>
                </div>
                <div style={{ textAlign: 'left' }}>
                    <h6>Figma Design</h6>
                    <p className="text-xs text-white-dark mt-1">Design Reset</p>
                </div>
            </button>
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    btnClassName="hover:text-primary"
                    button={<IconHorizontalDots className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" />}
                >
                    <ul>
                        <li><button type="button">View Project</button></li>
                        <li><button type="button">Edit Project</button></li>
                        <li><button type="button">Mark as Done</button></li>
                    </ul>
                </Dropdown>
            </div>
        </div>
        <div className="group">
            <div className="text-white-dark mb-5">Doloribus nisi vel suscipit modi, optio ex repudiandae voluptatibus officiis commodi. Nesciunt quas aut neque incidunt!</div>
            <div className="flex items-center justify-between mb-2 font-semibold">
                <div className="flex items-center">
                    <IconSquareCheck className="w-4 h-4 text-success" />
                    <div className="ltr:ml-2 rtl:mr-2 text-xs">5 Tasks</div>
                </div>
                <p className="text-primary">65%</p>
            </div>
            <div className="rounded-full h-2.5 p-0.5 bg-dark-light dark:bg-dark-light/10 mb-5">
                <div className="bg-gradient-to-r from-[#1e9afe] to-[#60dfcd] h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex items-end justify-between">
                <div className="flex items-center rounded-full bg-danger/20 px-2 py-1 text-xs text-danger font-semibold">
                    <IconClock className="w-3 h-3 ltr:mr-1 rtl:ml-1" />3 Days Left
                </div>
                <div className="flex items-center justify-center group-hover:-space-x-2 rtl:space-x-reverse rtl:group-hover:space-x-reverse">
                    <span className="bg-[#bfc9d4] dark:bg-dark w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 opacity-0 group-hover:opacity-100">
                        +6
                    </span>
                    <img
                        className="w-9 h-9 border-2 border-white dark:border-dark rounded-full object-cover transition-all duration-300"
                        src="/assets/images/profile-6.jpeg"
                        alt="profile6"
                    />
                    <img
                        className="w-9 h-9 border-2 border-white dark:border-dark rounded-full object-cover transition-all duration-300"
                        src="/assets/images/profile-7.jpeg"
                        alt="profile7"
                    />
                    <img
                        className="w-9 h-9 border-2 border-white dark:border-dark rounded-full object-cover transition-all duration-300"
                        src="/assets/images/profile-8.jpeg"
                        alt="profile8"
                    />
                </div>
            </div>
        </div>
    </div>
);

export const CalendarWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    isRtl,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={widgetClasses} style={widgetStyle}>
        {editControls}
        <div className="flex justify-between dark:text-white-light mb-5">
            <h5 className="font-semibold text-lg">{widget.title}</h5>
            <div className="dropdown">
                <Dropdown
                    offset={[0, 5]}
                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                    btnClassName="hover:text-primary"
                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                >
                    <ul>
                        <li><button type="button">Today</button></li>
                        <li><button type="button">This Week</button></li>
                        <li><button type="button">This Month</button></li>
                        <li><button type="button">This Year</button></li>
                    </ul>
                </Dropdown>
            </div>
        </div>
        <div className="calendar-widget">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
                <button className="btn btn-sm btn-outline-secondary">
                    <IconArrowLeft className="w-4 h-4" />
                </button>
                <h6 className="font-semibold text-lg">December 2024</h6>
                <button className="btn btn-sm btn-outline-secondary">
                    <IconArrowLeft className="w-4 h-4 rotate-180" />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 0 + 1; // Adjust for December 2024
                    const isCurrentMonth = day >= 1 && day <= 31;
                    const isToday = day === 15; // Example: today is 15th
                    const hasEvent = [3, 8, 15, 22, 28].includes(day); // Days with events

                    return (
                        <div
                            key={i}
                            className={`
                                text-center text-sm py-2 rounded cursor-pointer transition-colors
                                ${isCurrentMonth
                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    : 'text-gray-300 dark:text-gray-600'
                                }
                                ${isToday ? 'bg-primary text-white font-semibold' : ''}
                                ${hasEvent && isCurrentMonth && !isToday ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}
                            `}
                        >
                            {isCurrentMonth ? day : ''}
                        </div>
                    );
                })}
            </div>

            {/* Upcoming Events */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <h6 className="font-semibold text-sm mb-2 dark:text-white-light">Upcoming Events</h6>
                <div className="space-y-2">
                    <div className="flex items-center text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-gray-600 dark:text-gray-400">Team Meeting - Dec 15</span>
                    </div>
                    <div className="flex items-center text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-gray-600 dark:text-gray-400">Project Deadline - Dec 22</span>
                    </div>
                    <div className="flex items-center text-xs">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        <span className="text-gray-600 dark:text-gray-400">Client Call - Dec 28</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const DefaultWidget: React.FC<WidgetComponentProps> = ({
    widget,
    isEditMode,
    editControls,
    widgetClasses,
    widgetStyle
}) => (
    <div className={widgetClasses} style={widgetStyle}>
        {editControls}
        <div className="flex justify-between dark:text-white-light mb-5">
            <h5 className="font-semibold text-lg">{widget.title}</h5>
        </div>
        <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Widget type "{widget.type}" not implemented yet.</p>
        </div>
    </div>
);
