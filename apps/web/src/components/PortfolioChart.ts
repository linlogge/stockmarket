import { type ChartConfiguration, Chart } from 'chart.js/auto';

export const PortfolioChart = (data: any, options?: any) => {
    const canvas = document.createElement('canvas');
    let chart: Chart | null = null;

    const createChart = (config: ChartConfiguration) => {
        chart = new Chart(canvas, config);
    };

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: "Inter, sans-serif",
                    },
                    color: '#6c757d', // $gray-600
                },
            },
            y: {
                beginAtZero: false,
                border: {
                    display: false,
                },
                grid: {
                    color: '#e9ecef', // $gray-200,
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        family: "Inter, sans-serif",
                    },
                    color: '#6c757d', // $gray-600
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: '#343a40', // $gray-800
                titleColor: '#fff',
                bodyColor: '#fff',
                titleFont: {
                    family: "Inter, sans-serif",
                    weight: 'bold',
                },
                bodyFont: {
                    family: "Inter, sans-serif",
                },
                cornerRadius: 16,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function(context: any) {
                        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                    }
                }
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    setTimeout(() => {
        const config: ChartConfiguration = {
            type: 'line',
            data: data,
            options: { ...defaultOptions, ...options }
        };
        createChart(config);
    }, 0);

    return {
        element: canvas,
        update: (newData: any) => {
            if (chart) {
                chart.data = newData;
                chart.update();
            }
        },
        destroy: () => {
            if (chart) {
                chart.destroy();
            }
        }
    };
}; 