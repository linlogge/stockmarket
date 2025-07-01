import { StockChartCard } from "../components/StockChartCard";
import { stockService, type Stock } from "../services/stockService";
import { StockCard } from "../components/StockCard";
import { ICONS } from "../utils/icons";
import { LandingHeader } from "../components/LandingHeader";

export const landingView = () => {
    const el = document.createElement('div');
    el.className = 'market-view p-4 container-fluid d-flex flex-column gap-4';
    
    el.appendChild(LandingHeader());
    
    const header = document.createElement('h1');
    header.textContent = 'Market';
    el.appendChild(header);

    const stockCardsContainer = document.createElement('div');
    stockCardsContainer.className = 'd-flex flex-row gap-4 py-3 flex-nowrap overflow-auto';
    el.appendChild(stockCardsContainer);

    const chartContainer = document.createElement('div');
    chartContainer.id = 'market-container';
    el.appendChild(chartContainer);

    let intervalId: number;
    let stocks: Stock[] = [];
    let selectedStock: Stock | null = null;

    const renderStockChartCard = async (stock: Stock, price: number, diff: number) => {
        selectedStock = stock;
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

    const updatePrices = async () => {
        try {
            if (stocks.length === 0) {
                stocks = await stockService.getAvailableStocks();
                if (stocks.length > 0 && !selectedStock) {
                    selectedStock = stocks[0];
                }
            }
            if (stocks.length === 0) {
                chartContainer.innerHTML = `<p>No stocks available.</p>`;
                return;
            }

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
            
            if (selectedStock) {
                const stockPrice = priceMap.get(selectedStock.symbol);
                if (stockPrice) {
                    renderStockChartCard(selectedStock, stockPrice.price, stockPrice.diff);
                }
            }

        } catch (error) {
            console.error('Failed to load available stocks', error);
            if (!stockCardsContainer.hasChildNodes()) {
                chartContainer.innerHTML = `<p class="text-danger">Could not load available stocks.</p>`;
            }
        }
    };

    const init = () => {
        updatePrices();
        intervalId = window.setInterval(updatePrices, 1000);
    };

    init();

    const cleanup = () => {
        clearInterval(intervalId);
    };

    return {
        element: el,
        cleanup,
    };
};
