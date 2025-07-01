import { Sidebar } from '../components/DashboardSidebar';
import { stockService } from '../services/stockService';
import { StockCard } from '../components/StockCard';
import { siMeta, siApple, siGoogle } from 'simple-icons';
import { StockChartCard } from '../components/StockChartCard';
import { Watchlist } from '../components/Watchlist';
import { DashboardHeader } from '../components/DashboardHeader';

const MyPortfolioSection = ({ onStockSelected }: { onStockSelected: (symbol: string, companyName: string, icon: string) => void }) => {
    const el = document.createElement('div');
    el.className = 'my-portfolio-section mb-4';

    const header = document.createElement('h3');
    header.className = 'mb-3';
    header.textContent = 'My Portfolio';
    el.appendChild(header);

    const cardContainer = document.createElement('div');
    cardContainer.className = 'd-flex flex-row gap-4 py-3 flex-nowrap overflow-auto';
    cardContainer.innerHTML = `<p>Loading portfolio...</p>`;
    el.appendChild(cardContainer);

    const stockInfoMap: { [key: string]: { icon: string, name: string } } = {
        'AAPL': { icon: siApple.svg, name: 'Apple' },
        'META': { icon: siMeta.svg, name: 'Meta' },
        'GOOGL': { icon: siGoogle.svg, name: 'Google' }
    };
    const stockSymbols = Object.keys(stockInfoMap);

    stockService.getStockPrice(stockSymbols)
        .then(response => {
            cardContainer.innerHTML = '';
            response.symbol.forEach((symbol, index) => {
                const price = response.mid[index];
                const diff = response.diff[index];
                const info = stockInfoMap[symbol];
                if (info) {
                    const card = StockCard({
                        icon: info.icon,
                        name: info.name,
                        price: price,
                        diff: diff,
                    });
                    card.onclick = () => onStockSelected(symbol, info.name, info.icon);
                    card.style.cursor = 'pointer';
                    cardContainer.appendChild(card);
                }
            });
        })
        .catch(error => {
            console.error('Failed to fetch stock prices:', error);
            cardContainer.innerHTML = `<p class="text-danger">Could not load portfolio data.</p>`;
        });

    return el;
};

export const dashboardNewView = () => {
    const el = document.createElement('div');
    el.className = 'd-flex'; 

    const sidebar = Sidebar();
    el.appendChild(sidebar.element);

    const mainContentEl = document.createElement('div');
    mainContentEl.className = 'flex-grow-1 p-4 overflow-auto';
    mainContentEl.style.height = '100vh';

    mainContentEl.appendChild(DashboardHeader());

    const stockChartCol = document.createElement('div');
    stockChartCol.className = 'col-md-8';

    const renderStockChart = async (symbol: string, companyName: string, icon: string) => {
        stockChartCol.innerHTML = `<p>Loading chart for ${symbol}...</p>`;
        try {
            const priceData = await stockService.getStockPrice(symbol);
            const price = priceData.mid[0];
            const diff = priceData.diff[0];
            const openPrice = price - diff;
            const diffPercent = openPrice !== 0 ? (diff / openPrice) * 100 : 0;

            const stockChartCard = StockChartCard({
                icon: icon,
                companyName: companyName,
                symbol: symbol,
                price: price,
                priceDiff: diff,
                priceDiffPercent: diffPercent,
            });
            stockChartCol.innerHTML = '';
            stockChartCol.appendChild(stockChartCard);
        } catch (error) {
            console.error(`Failed to load chart data for ${symbol}`, error);
            stockChartCol.innerHTML = `<p class="text-danger">Could not load chart for ${symbol}.</p>`;
        }
    };

    mainContentEl.appendChild(MyPortfolioSection({ onStockSelected: renderStockChart }));

    const bottomRowEl = document.createElement('div');
    bottomRowEl.className = 'row g-4';
    
    bottomRowEl.appendChild(stockChartCol);

    const myWatchlistCol = document.createElement('div');
    myWatchlistCol.className = 'col-md-4';
    const watchlist = Watchlist();
    myWatchlistCol.appendChild(watchlist.element);
    bottomRowEl.appendChild(myWatchlistCol);

    mainContentEl.appendChild(bottomRowEl);

    el.appendChild(mainContentEl);

    const cleanup = () => {
        watchlist.cleanup();
        sidebar.cleanup();
    };

    renderStockChart('AAPL', 'Apple', siApple.svg);

    return { element: el, cleanup };
};