import { type ChartConfiguration, Chart } from 'chart.js/auto';
import { stockService } from '../services/stockService';

export const PortfolioChart = (data: any, options?: any) => {
    const canvas = document.createElement('canvas');
    let chart: Chart | null = null;

    const createChart = (config: ChartConfiguration) => {
        chart = new Chart(canvas, config);
    };

    setTimeout(() => {
        const config: ChartConfiguration = {
            type: 'line',
            data: data,
            options: options || {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
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