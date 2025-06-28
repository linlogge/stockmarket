import { Chart } from 'chart.js/auto';
import { stockService } from '../services/stockService';

export const PortfolioChart = () => {
    const el = document.createElement('div');
    el.innerHTML = `<canvas id="portfolioChart"></canvas>`;

    setTimeout(() => {
        const ctx = (document.getElementById('portfolioChart') as HTMLCanvasElement)?.getContext('2d');
        if (!ctx) {
            return;
        }

        stockService.getPortfolioHistory().then(history => {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: history.labels,
                    datasets: [{
                        label: 'Portfolio Value',
                        data: history.data,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        });
    }, 0);


    return el;
}; 