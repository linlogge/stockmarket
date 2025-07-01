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
    onResolutionChange: (resolution: Resolution) => Promise<any>;
}

export const StockChartCard = ({
    icon,
    companyName,
    symbol,
    price,
    priceDiff,
    priceDiffPercent,
}: Omit<StockChartCardProps, 'onResolutionChange'>) => {
    const el = document.createElement('div');
    el.className = 'card shadow-sm p-4';

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
                <button type="button" class="btn btn-outline-secondary btn-sm" data-resolution="1Y">1Y</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" data-resolution="5Y">5Y</button>
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
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
        }]
    };

    const chart = PortfolioChart(initialData, {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    });
    chartContainer.appendChild(chart.element);

    const buttons = el.querySelectorAll<HTMLButtonElement>('.btn-group button');

    const updateChart = (resolution: Resolution) => {
        stockService.getCandles(symbol, resolution).then(candleData => {
            const newData = {
                labels: candleData.t.map(ts => new Date(ts * 1000).toLocaleDateString()),
                datasets: [{
                    label: `${symbol} Price`,
                    data: candleData.c,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
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