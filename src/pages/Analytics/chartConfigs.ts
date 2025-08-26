// Chart configurations for Analytics widgets
export const totalVisit: any = {
    series: [{ data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25] }],
    options: {
        chart: {
            height: 58,
            type: 'line',
            fontFamily: 'Nunito, sans-serif',
            sparkline: {
                enabled: true,
            },
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#009688',
                opacity: 0.4,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        colors: ['#009688'],
        grid: {
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5,
            },
        },
        tooltip: {
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: () => {
                        return '';
                    },
                },
            },
        },
    },
};

export const paidVisit: any = {
    series: [{ data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69] }],
    options: {
        chart: {
            height: 58,
            type: 'line',
            fontFamily: 'Nunito, sans-serif',
            sparkline: {
                enabled: true,
            },
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#e2a03f',
                opacity: 0.4,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        colors: ['#e2a03f'],
        grid: {
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5,
            },
        },
        tooltip: {
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: () => {
                        return '';
                    },
                },
            },
        },
    },
};

export const uniqueVisitorSeries: any = {
    series: [
        {
            name: 'Paychecks',
            data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
        },
        {
            name: 'Garnishment',
            data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
        },
    ],
    options: {
        chart: {
            height: 360,
            type: 'bar',
            fontFamily: 'Nunito, sans-serif',
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 2,
            colors: ['transparent'],
        },
        colors: ['#5c1ac3', '#ffbb44'],
        dropShadow: {
            enabled: true,
            blur: 3,
            color: '#515365',
            opacity: 0.4,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 8,
                borderRadiusApplication: 'end',
            },
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '14px',
            itemMargin: {
                horizontal: 8,
                vertical: 8,
            },
        },
        grid: {
            borderColor: '#191e3a',
            padding: {
                left: 20,
                right: 20,
            },
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisBorder: {
                show: true,
                color: '#3b3f5c',
            },
        },
        yaxis: {
            tickAmount: 6,
            opposite: false,
            labels: {
                offsetX: 0,
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'vertical',
                shadeIntensity: 0.3,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 0.8,
                stops: [0, 100],
            },
        },
        tooltip: {
            marker: {
                show: true,
            },
        },
    },
};

export const followers: any = {
    series: [
        {
            data: [38, 60, 38, 52, 36, 40, 28],
        },
    ],
    options: {
        chart: {
            height: 160,
            type: 'area',
            fontFamily: 'Nunito, sans-serif',
            sparkline: {
                enabled: true,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        colors: ['#4361ee'],
        grid: {
            padding: {
                top: 5,
            },
        },
        yaxis: {
            show: false,
        },
        tooltip: {
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: () => {
                        return '';
                    },
                },
            },
        },
    },
};

export const referral: any = {
    series: [
        {
            data: [60, 28, 52, 38, 40, 36, 38],
        },
    ],
    options: {
        chart: {
            height: 160,
            type: 'area',
            fontFamily: 'Nunito, sans-serif',
            sparkline: {
                enabled: true,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        colors: ['#e7515a'],
        grid: {
            padding: {
                top: 5,
            },
        },
        yaxis: {
            show: false,
        },
        tooltip: {
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: () => {
                        return '';
                    },
                },
            },
        },
    },
};

export const engagement: any = {
    series: [
        {
            name: 'Sales',
            data: [28, 50, 36, 60, 38, 52, 38],
        },
    ],
    options: {
        chart: {
            height: 160,
            type: 'area',
            fontFamily: 'Nunito, sans-serif',
            sparkline: {
                enabled: true,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        colors: ['#1abc9c'],
        grid: {
            padding: {
                top: 5,
            },
        },
        yaxis: {
            show: false,
        },
        tooltip: {
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: () => {
                        return '';
                    },
                },
            },
        },
    },
};
