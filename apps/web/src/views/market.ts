import { siGoogle, siApple, siMsi, siMeta } from "simple-icons";
import { StockChartCard } from "../components/StockChartCard";
import { stockService, type Stock } from "../services/stockService";
import { StockCard } from "../components/StockCard";

const ICONS: { [key: string]: string } = {
    'GOOGL': siGoogle.svg,
    'AAPL': siApple.svg,
    'MSFT': siMsi.svg,
    'META': siMeta.svg,
    'DEFAULT': siGoogle.svg,
};

export const marketView = () => {
    const el = document.createElement('div');
    el.className = 'market-view p-4 container-fluid d-flex flex-column gap-4';
    
    const header = document.createElement('h1');
    header.textContent = 'Market';
    el.appendChild(header);

    const stockCardsContainer = document.createElement('div');
    stockCardsContainer.className = 'd-flex flex-row gap-4 py-3 flex-nowrap overflow-auto';
    el.appendChild(stockCardsContainer);

    const chartContainer = document.createElement('div');
    chartContainer.id = 'market-container';
    el.appendChild(chartContainer);

    const renderStockChartCard = async (stock: Stock, price: number, diff: number) => {
        chartContainer.innerHTML = `<p>Loading chart for ${stock.symbol}...</p>`;
        try {
            const openPrice = price - diff;
            const diffPercent = openPrice !== 0 ? (diff / openPrice) * 100 : 0;

            const stockChartCard = StockChartCard({
                icon: ICONS[stock.symbol] || ICONS['DEFAULT'],
                companyName: stock.company,
                symbol: stock.symbol,
                price: price,
                priceDiff: diff,
                priceDiffPercent: diffPercent,
            });
            chartContainer.innerHTML = '';
            chartContainer.appendChild(stockChartCard);
        } catch (error) {
            console.error(`Failed to load chart data for ${stock.symbol}`, error);
            chartContainer.innerHTML = `<p class="text-danger">Could not load chart for ${stock.symbol}.</p>`;
        }
    };

    const init = async () => {
        try {
            const stocks = await stockService.getAvailableStocks();
            if (stocks.length > 0) {
                const symbols = stocks.map(s => s.symbol);
                const priceData = await stockService.getStockPrice(symbols);
                
                const priceMap = new Map<string, {price: number, diff: number}>();
                for (let i = 0; i < priceData.symbol.length; i++) {
                    priceMap.set(priceData.symbol[i], {
                        price: priceData.mid[i],
                        diff: priceData.diff[i]
                    });
                }

                stockCardsContainer.innerHTML = '';
                stocks.forEach(stock => {
                    const stockPrice = priceMap.get(stock.symbol);
                    if (stockPrice) {
                        const stockCard = StockCard({
                            icon: ICONS[stock.symbol] || ICONS['DEFAULT'],
                            name: stock.company,
                            price: stockPrice.price,
                            diff: stockPrice.diff
                        });
                        stockCard.onclick = () => renderStockChartCard(stock, stockPrice.price, stockPrice.diff);
                        stockCardsContainer.appendChild(stockCard);
                    }
                });
                
                const firstStock = stocks[0];
                const firstStockPrice = priceMap.get(firstStock.symbol);
                if (firstStockPrice) {
                    renderStockChartCard(firstStock, firstStockPrice.price, firstStockPrice.diff);
                }

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
