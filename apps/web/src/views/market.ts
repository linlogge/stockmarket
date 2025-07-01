import { siGoogle } from "simple-icons";
import { StockChartCard } from "../components/StockChartCard";
import { stockService } from "../services/stockService";

export const marketView = () => {
    const el = document.createElement('div');
    el.className = 'market-view p-4';
    
    const header = document.createElement('h1');
    header.textContent = 'Market';
    el.appendChild(header);

    const container = document.createElement('div');
    container.id = 'market-container';
    el.appendChild(container);

    container.innerHTML = `<p>Loading chart...</p>`;

    stockService.getStockPrice('GOOGL').then(priceData => {
        const price = priceData.mid[0];
        const stockChartCard = StockChartCard({
            icon: siGoogle.svg,
            companyName: 'Alphabet Inc.',
            symbol: 'GOOGL',
            price: price,
            priceDiff: 1.2,
            priceDiffPercent: 0.5,
        });
        container.innerHTML = '';
        container.appendChild(stockChartCard);
    }).catch(error => {
        console.error('Failed to load chart data', error);
        container.innerHTML = `<p class="text-danger">Could not load chart.</p>`;
    });


    return {
        element: el,
    };
};
