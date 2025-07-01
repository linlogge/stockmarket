import { PortfolioChart } from "./PortfolioChart";
import { stockService } from "../services/stockService";

type Resolution = "1D" | "1W" | "1M" | "1Y" | "5Y";

interface StockChartCardProps {
    icon: string;
    companyName: string;
    symbol: string;
    price: number;
    priceDiff: number;
    priceDiffPercent: number;
}

export const StockChartCard = ({
    icon,
    companyName,
    symbol,
    price,
    priceDiff,
    priceDiffPercent,
}: StockChartCardProps) => {
    const el = document.createElement('div');
    el.className = 'card p-4 shadow-sm';

    const isNegative = priceDiff < 0;

    el.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex align-items-center">
                <div class="me-3">${icon}</div>
                <div>
                    <h5>${companyName} <small class="text-muted">${symbol}</small></h5>
                    <div>
                        <span class="fw-bold fs-5">$${price.toFixed(2)}</span>
                        <span class="ms-2 text-${isNegative ? 'danger' : 'success'}">
                            ${isNegative ? '' : '+'}$${priceDiff.toFixed(2)} (${priceDiffPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>
            <div class="btn-group" role="group" aria-label="Chart time range">
                <button type="button" class="btn btn-outline-secondary btn-sm" data-resolution="1D">1D</button>
                <button type="button" class="btn btn-outline-secondary btn-sm active" data-resolution="1W">1W</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" data-resolution="1M">1M</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" disabled data-resolution="1Y">1Y</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" disabled data-resolution="5Y">5Y</button>
            </div>
        </div>
    `;

    const chartContainer = document.createElement('div');
    chartContainer.style.height = '300px'; 
    el.appendChild(chartContainer);
    
    const initialData = {
        labels: [],
        datasets: [{
            label: `${symbol} Price`,
            data: [],
        }]
    };

    const chart = PortfolioChart(initialData);
    chartContainer.appendChild(chart.element);

    const buttons = el.querySelectorAll<HTMLButtonElement>('.btn-group button');

    const updateChart = (resolution: Resolution) => {
        stockService.getCandles(symbol, resolution).then(candleData => {
            if (candleData.s !== 'ok') {
                console.error('Failed to fetch candle data');
                return;
            }
            
            const labels = candleData.t.map(ts => {
                const date = new Date(ts * 1000);
                if (resolution === '1D' || resolution === '1W') {
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
                return date.toLocaleDateString();
            });

            const newData = {
                labels: labels,
                datasets: [{
                    label: `${symbol} Price`,
                    data: candleData.c,
                    borderColor: '#20c997', // $teal
                    backgroundColor: (context: any) => {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) {
                            return null;
                        }
                        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                        gradient.addColorStop(0, 'rgba(32, 201, 151, 0.3)');
                        gradient.addColorStop(1, 'rgba(32, 201, 151, 0)');
                        return gradient;
                    },
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#20c997',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                }]
            };
            chart.update(newData);
        });
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const resolution = button.dataset.resolution as Resolution;
            updateChart(resolution);
        });
    });

    updateChart('1W');

    return el;
}; 