import { StockChartCard } from "../components/StockChartCard";
import { stockService, type Stock } from "../services/stockService";
import { StockCard } from "../components/StockCard";
import { ICONS } from "../utils/icons";
import { LandingHeader } from "../components/LandingHeader";
import CountryPicker from "../components/CountryPicker";

export const landingView = () => {
    const el = document.createElement('div');
    el.className = 'market-view p-4 container-fluid d-flex flex-column gap-4';

    el.appendChild(LandingHeader());

    const header = document.createElement('h1');
    header.textContent = 'Market';
    el.appendChild(header);

    let locale: "US" | "DE" | undefined;

    const setLocale = (newLocale: "US" | "DE") => {
        if (locale === newLocale) return;
        locale = newLocale;
        init(newLocale);
    }

    const getCountryCode = async () => {
        const countryCode = await stockService.getCountryCode();
        
        if (countryCode === "US" || countryCode === "DE") {
            return countryCode;
        }

        return "DE";
    }


    let countryPicker = CountryPicker({
        locale,
        onChange: setLocale
    });

    el.appendChild(countryPicker.element);

    const stockCardsContainer = document.createElement('div');
    stockCardsContainer.className = 'd-flex flex-row gap-4 py-3 flex-nowrap overflow-auto';
    el.appendChild(stockCardsContainer);

    const chartContainer = document.createElement('div');
    chartContainer.id = 'market-container';
    el.appendChild(chartContainer);

    let intervalId: number;
    let stocks: Stock[] = [];
    let selectedStock: Stock | null = null;
    let priceMap = new Map<string, { price: number, diff: number }>();
    const stockCardElements = new Map<string, HTMLElement>();

    const renderStockChartCard = async (stock: Stock) => {
        selectedStock = stock;

        const stockPrice = priceMap.get(stock.symbol);
        if (!stockPrice) {
            console.error(`Price not found for ${stock.symbol}`);
            chartContainer.innerHTML = `<p class="text-danger">Could not load chart for ${stock.symbol}.</p>`;
            return;
        }

        chartContainer.innerHTML = '';
        const stockChartCard = StockChartCard({
            icon: ICONS[stock.symbol] || ICONS['DEFAULT'],
            companyName: stock.company,
            symbol: stock.symbol,
            price: stockPrice.price,
            priceDiff: stockPrice.diff,
            priceDiffPercent: stockPrice.price - stockPrice.diff !== 0 ? (stockPrice.diff / (stockPrice.price - stockPrice.diff)) * 100 : 0,
        });
        chartContainer.appendChild(stockChartCard);
    };

    const updateCardDOM = (cardElement: HTMLElement, price: number, diff: number) => {
        const openPrice = price - diff;
        const changePercent = openPrice !== 0 ? ((diff / openPrice) * 100).toFixed(2) : '0.00';
        const isNegative = diff < 0;

        const priceEl = cardElement.querySelector('h4.card-text');
        if (priceEl) {
            priceEl.textContent = `$${price.toFixed(2)}`;
        }

        const badgeEl = cardElement.querySelector('span.badge');
        if (badgeEl) {
            badgeEl.className = `badge bg-${isNegative ? 'danger' : 'success'}`;
            badgeEl.innerHTML = `<i class="bi bi-arrow-${isNegative ? 'down' : 'up'}"></i> ${changePercent}%`;
        }
    }

    const updatePrices = async () => {
        try {
            if (stocks.length === 0) return;

            const symbols = stocks.map(s => s.symbol);
            const priceData = await stockService.getStockPrice(symbols);

            for (let i = 0; i < priceData.symbol.length; i++) {
                const symbol = priceData.symbol[i];
                const price = priceData.mid[i];
                const diff = priceData.diff[i];
                priceMap.set(symbol, { price, diff });

                const cardElement = stockCardElements.get(symbol);
                if (cardElement) {
                    updateCardDOM(cardElement, price, diff);
                }
            }
        } catch (error) {
            console.error('Failed to update stock prices', error);
        }
    };

    const init = async (countryCode: "US" | "DE" | undefined) => {
        try {
            if (!countryCode) {
                countryCode = await getCountryCode();
                locale = countryCode;
                countryPicker.setValue(countryCode);
            }

            clearInterval(intervalId);
            stockCardsContainer.innerHTML = '';
            chartContainer.innerHTML = '';
            stocks = [];
            selectedStock = null;
            priceMap.clear();
            stockCardElements.clear();

            stocks = await stockService.getAvailableStocks(countryCode);
            if (stocks.length > 0) {
                const symbols = stocks.map(s => s.symbol);
                const priceData = await stockService.getStockPrice(symbols);
                for (let i = 0; i < priceData.symbol.length; i++) {
                    priceMap.set(priceData.symbol[i], {
                        price: priceData.mid[i],
                        diff: priceData.diff[i]
                    });
                }

                stocks.forEach(stock => {
                    const stockPrice = priceMap.get(stock.symbol);
                    if (stockPrice) {
                        const stockCard = StockCard({
                            icon: ICONS[stock.symbol] || ICONS['DEFAULT'],
                            name: stock.company,
                            price: stockPrice.price,
                            diff: stockPrice.diff
                        });
                        stockCard.onclick = () => renderStockChartCard(stock);
                        stockCard.style.cursor = 'pointer';
                        stockCardsContainer.appendChild(stockCard);
                        stockCardElements.set(stock.symbol, stockCard);
                    }
                });

                if (!selectedStock) {
                    selectedStock = stocks[0];
                }
                renderStockChartCard(selectedStock);
                intervalId = window.setInterval(updatePrices, 1000);
            } else {
                chartContainer.innerHTML = `<p>No stocks available.</p>`;
            }
        } catch (error) {
            console.error('Failed to load available stocks', error);
            chartContainer.innerHTML = `<p class="text-danger">Could not load available stocks.</p>`;
        }
    };

    init(locale);

    const cleanup = () => {
        clearInterval(intervalId);
    };

    return {
        element: el,
        cleanup,
    };
};
