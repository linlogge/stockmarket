import { siGoogle, siApple, siMsi, siMeta } from "simple-icons";
import { StockChartCard } from "../components/StockChartCard";
import { stockService, type Stock } from "../services/stockService";

const ICONS: { [key: string]: string } = {
    'GOOGL': siGoogle.svg,
    'AAPL': siApple.svg,
    'MSFT': siMsi.svg,
    'META': siMeta.svg,
    'DEFAULT': siGoogle.svg,
};

export const marketView = () => {
    const el = document.createElement('div');
    el.className = 'market-view p-4';
    
    const header = document.createElement('h1');
    header.textContent = 'Market';
    el.appendChild(header);

    const stockListContainer = document.createElement('div');
    stockListContainer.className = 'd-flex flex-row gap-3 py-3';
    el.appendChild(stockListContainer);

    const chartContainer = document.createElement('div');
    chartContainer.id = 'market-container';
    el.appendChild(chartContainer);

    const renderStockChartCard = async (stock: Stock) => {
        chartContainer.innerHTML = `<p>Loading chart for ${stock.symbol}...</p>`;
        try {
            const priceData = await stockService.getStockPrice(stock.symbol);
            const price = priceData.mid[0];
            const stockChartCard = StockChartCard({
                icon: ICONS[stock.symbol] || ICONS['DEFAULT'],
                companyName: stock.company,
                symbol: stock.symbol,
                price: price,
                priceDiff: 1.2,
                priceDiffPercent: 0.5,
            });
            chartContainer.innerHTML = '';
            chartContainer.appendChild(stockChartCard);
        } catch (error) {
            console.error(`Failed to load chart data for ${stock.symbol}`, error);
            chartContainer.innerHTML = `<p class="text-danger">Could not load chart for ${stock.symbol}.</p>`;
        }
    };

    const renderStockList = (stocks: Stock[], onStockSelected: (stock: Stock) => void) => {
        stockListContainer.innerHTML = '';
        stocks.forEach(stock => {
            const stockButton = document.createElement('button');
            stockButton.className = 'btn btn-outline-secondary';
            stockButton.textContent = stock.company;
            stockButton.onclick = () => onStockSelected(stock);
            stockListContainer.appendChild(stockButton);
        });
    };
    
    const init = async () => {
        try {
            const stocks = await stockService.getAvailableStocks();
            if (stocks.length > 0) {
                renderStockList(stocks, (selectedStock) => {
                    renderStockChartCard(selectedStock);
                });
                renderStockChartCard(stocks[0]);
            } else {
                chartContainer.innerHTML = `<p>No stocks available.</p>`;
            }
        } catch (error) {
            console.error('Failed to load available stocks', error);
            chartContainer.innerHTML = `<p class="text-danger">Could not load available stocks.</p>`;
        }
    };

    init();

    return {
        element: el,
    };
};
